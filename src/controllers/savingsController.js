/**
 * EnergySaver - Savings Controller
 * Implements the What-If simulation sandbox and baseline modification applier.
 * - POST /api/savings/simulate: In-memory delta calculation without database mutation.
 * - POST /api/savings/apply: Transactional persistence of modified daily operating hours.
 */

'use strict';

const { getPool } = require('../config/database');
const calculator = require('../services/calculator');

/**
 * Validate modifications array structure and values.
 * @param {*} modifications 
 * @returns {{ valid: boolean, error?: string, sanitized?: Array }}
 */
function validateModifications(modifications) {
  if (!Array.isArray(modifications) || modifications.length === 0) {
    return { valid: false, error: { code: 'VALIDATION_ERROR', message: 'Modifications must be a non-empty array of appliance adjustments.', field: 'modifications' } };
  }

  const seenIds = new Set();
  const sanitized = [];

  for (let i = 0; i < modifications.length; i++) {
    const item = modifications[i];
    if (!item || typeof item !== 'object') {
      return { valid: false, error: { code: 'VALIDATION_ERROR', message: `Invalid item at index ${i}.`, field: `modifications[${i}]` } };
    }

    const applianceId = parseInt(item.appliance_id, 10);
    if (!Number.isInteger(applianceId) || applianceId <= 0) {
      return { valid: false, error: { code: 'VALIDATION_ERROR', message: `Valid positive integer appliance_id is required at index ${i}.`, field: 'appliance_id' } };
    }

    if (seenIds.has(applianceId)) {
      return { valid: false, error: { code: 'VALIDATION_ERROR', message: `Duplicate appliance_id ${applianceId} in modifications list.`, field: 'appliance_id' } };
    }
    seenIds.add(applianceId);

    // Support either proposed_daily_hours or daily_hours
    const hoursVal = item.proposed_daily_hours !== undefined ? item.proposed_daily_hours : item.daily_hours;
    const hours = parseFloat(hoursVal);
    if (isNaN(hours) || hours < 0.1 || hours > 24.0) {
      return { valid: false, error: { code: 'VALIDATION_ERROR', message: `Daily hours for appliance ${applianceId} must be between 0.1 and 24.0.`, field: 'daily_hours' } };
    }

    sanitized.push({
      appliance_id: applianceId,
      proposed_daily_hours: hours,
      daily_hours: hours
    });
  }

  return { valid: true, sanitized };
}

/**
 * POST /api/savings/simulate
 * Simulates the energy and financial impact of reducing/increasing appliance hours.
 * In-memory calculation; NEVER modifies the database.
 */
async function simulateSavings(req, res, next) {
  try {
    const userId = req.session.userId;
    const { modifications } = req.body;

    const validation = validateModifications(modifications);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const pool = getPool();

    // 1. Fetch user settings
    const [settingsRows] = await pool.execute(
      'SELECT electricity_rate, monthly_budget FROM user_settings WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const settings = settingsRows.length > 0 ? settingsRows[0] : {};
    const rate = settings.electricity_rate ? parseFloat(settings.electricity_rate) : 8.0;
    const budget = settings.monthly_budget !== undefined && settings.monthly_budget !== null ? parseFloat(settings.monthly_budget) : 3500.0;

    // 2. Fetch all user's appliances to form the complete household baseline
    const [appliances] = await pool.execute(
      'SELECT id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month FROM appliances WHERE user_id = ?',
      [userId]
    );

    const applianceMap = new Map();
    appliances.forEach((app) => applianceMap.set(app.id, app));

    // Verify all modified appliance IDs belong to the authenticated user
    for (const mod of validation.sanitized) {
      if (!applianceMap.has(mod.appliance_id)) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: `Appliance with ID ${mod.appliance_id} not found in your inventory.` }
        });
      }
    }

    // 3. Create proposed cloned dataset with modifications applied
    const baselineItems = appliances.map((a) => ({
      ...a,
      rated_watts: parseFloat(a.rated_watts),
      quantity: parseInt(a.quantity, 10),
      daily_hours: parseFloat(a.daily_hours),
      days_used_per_month: parseInt(a.days_used_per_month, 10)
    }));

    const modMap = new Map(validation.sanitized.map((m) => [m.appliance_id, m.proposed_daily_hours]));

    const proposedItems = baselineItems.map((a) => ({
      ...a,
      daily_hours: modMap.has(a.id) ? modMap.get(a.id) : a.daily_hours
    }));

    // 4. Authoritative delta calculation
    const delta = calculator.calculateScenarioDelta(baselineItems, proposedItems, rate, budget, { round: true });

    return res.status(200).json({
      success: true,
      data: {
        baseline_kwh: delta.baseline.total_monthly_kwh,
        baseline_cost: delta.baseline.total_monthly_cost,
        proposed_kwh: delta.proposed.total_monthly_kwh,
        proposed_cost: delta.proposed.total_monthly_cost,
        saved_kwh: delta.saved_kwh,
        saved_cost: delta.saved_cost,
        is_savings: delta.is_savings,
        proposed_budget_status: delta.proposed.budget_status === 'NORMAL' ? 'WITHIN_BUDGET' : delta.proposed.budget_status
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/savings/apply
 * Applies proposed appliance hour modifications into the database in an atomic transaction.
 */
async function applySavings(req, res, next) {
  let connection;
  try {
    const userId = req.session.userId;
    const { modifications } = req.body;

    const validation = validateModifications(modifications);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const pool = getPool();
    connection = await pool.getConnection();

    await connection.beginTransaction();

    // Verify ownership of each appliance
    const modIds = validation.sanitized.map((m) => m.appliance_id);
    const placeholders = modIds.map(() => '?').join(',');
    const [existing] = await connection.execute(
      `SELECT id FROM appliances WHERE user_id = ? AND id IN (${placeholders})`,
      [userId, ...modIds]
    );

    if (existing.length !== modIds.length) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'One or more specified appliances do not exist in your inventory.' }
      });
    }

    // Update each appliance's daily_hours atomically
    for (const mod of validation.sanitized) {
      await connection.execute(
        'UPDATE appliances SET daily_hours = ? WHERE id = ? AND user_id = ?',
        [mod.daily_hours, mod.appliance_id, userId]
      );
    }

    await connection.commit();

    const count = validation.sanitized.length;
    return res.status(200).json({
      success: true,
      message: `${count} appliance${count === 1 ? '' : 's'} updated. New baseline is now active.`
    });
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rbErr) {
        // Log rollback error
      }
    }
    next(err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  simulateSavings,
  applySavings
};
