/**
 * EnergySaver - Appliance Controller
 * Manages CRUD operations and calculations for the appliance inventory.
 * Enforces zero-trust cross-user isolation: all queries filter by req.session.userId.
 */

'use strict';

const { getPool } = require('../config/database');
const calculator = require('../services/calculator');

/**
 * Validates appliance input fields against the bounds defined in docs/API_SPEC.md.
 * @param {Object} data - Input payload
 * @returns {{ valid: boolean, error?: { code: string, message: string, field: string }, cleanData?: Object }}
 */
function validateApplianceInput(data) {
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Request body must be a valid JSON object' }
    };
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const category = typeof data.category === 'string' ? data.category.trim() : '';
  const room = typeof data.room === 'string' ? data.room.trim() : '';

  if (!name || name.length > 100) {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Name is required (1-100 characters)', field: 'name' }
    };
  }

  if (!category || category.length > 50) {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Category is required (1-50 characters)', field: 'category' }
    };
  }

  if (!room || room.length > 50) {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Room is required (1-50 characters)', field: 'room' }
    };
  }

  const ratedWatts = Number(data.rated_watts);
  if (!Number.isFinite(ratedWatts) || ratedWatts < 1.0 || ratedWatts > 10000.0) {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Rated watts must be a number between 1.0 and 10000.0', field: 'rated_watts' }
    };
  }

  const quantity = Number(data.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Quantity must be an integer between 1 and 50', field: 'quantity' }
    };
  }

  const dailyHours = Number(data.daily_hours);
  if (!Number.isFinite(dailyHours) || dailyHours < 0.1 || dailyHours > 24.0) {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Daily hours must be a number between 0.1 and 24.0', field: 'daily_hours' }
    };
  }

  const daysUsed = Number(data.days_used_per_month);
  if (!Number.isInteger(daysUsed) || daysUsed < 1 || daysUsed > 31) {
    return {
      valid: false,
      error: { code: 'VALIDATION_ERROR', message: 'Days used per month must be an integer between 1 and 31', field: 'days_used_per_month' }
    };
  }

  return {
    valid: true,
    cleanData: {
      name,
      category,
      room,
      rated_watts: ratedWatts,
      quantity,
      daily_hours: dailyHours,
      days_used_per_month: daysUsed
    }
  };
}

/**
 * Helper to fetch the authenticated user's current electricity rate.
 * @param {number} userId
 * @returns {Promise<number>}
 */
async function getUserRate(userId) {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT electricity_rate FROM user_settings WHERE user_id = ? LIMIT 1',
    [userId]
  );
  if (rows.length > 0 && rows[0].electricity_rate) {
    return parseFloat(rows[0].electricity_rate);
  }
  return 8.0000;
}

/**
 * GET /api/appliances
 * List appliances owned by the authenticated user with optional search, filtering, and sorting.
 */
async function listAppliances(req, res, next) {
  try {
    const userId = req.session.userId;
    const { room, category, search, sort_by, sort_order } = req.query;

    let sql = 'SELECT id, user_id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month, created_at, updated_at FROM appliances WHERE user_id = ?';
    const params = [userId];

    if (room && typeof room === 'string' && room.trim()) {
      sql += ' AND room = ?';
      params.push(room.trim());
    }

    if (category && typeof category === 'string' && category.trim()) {
      sql += ' AND category = ?';
      params.push(category.trim());
    }

    if (search && typeof search === 'string' && search.trim()) {
      sql += ' AND name LIKE ?';
      params.push(`%${search.trim()}%`);
    }

    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    const rate = await getUserRate(userId);

    // Map rows to numbers and calculate authoritative metrics
    const list = rows.map((r) => {
      const appData = {
        id: r.id,
        name: r.name,
        category: r.category,
        room: r.room,
        rated_watts: parseFloat(r.rated_watts),
        quantity: parseInt(r.quantity, 10),
        daily_hours: parseFloat(r.daily_hours),
        days_used_per_month: parseInt(r.days_used_per_month, 10),
        created_at: r.created_at,
        updated_at: r.updated_at
      };

      return calculator.computeApplianceMetrics(appData, rate, { round: true });
    });

    // Sort list according to sort_by and sort_order
    const isAsc = String(sort_order).toLowerCase() === 'asc';
    const orderMultiplier = isAsc ? 1 : -1;
    const sortBy = String(sort_by || 'created_at').toLowerCase();

    list.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) * orderMultiplier;
      }
      if (sortBy === 'monthly_kwh') {
        return (a.monthly_kwh - b.monthly_kwh) * orderMultiplier;
      }
      if (sortBy === 'monthly_cost') {
        return (a.monthly_cost - b.monthly_cost) * orderMultiplier;
      }
      // default: created_at
      const timeA = new Date(a.created_at).getTime() || 0;
      const timeB = new Date(b.created_at).getTime() || 0;
      return (timeA - timeB) * orderMultiplier;
    });

    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/appliances
 * Create a new appliance for the authenticated user.
 */
async function createAppliance(req, res, next) {
  try {
    const userId = req.session.userId;
    const validation = validateApplianceInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { name, category, room, rated_watts, quantity, daily_hours, days_used_per_month } = validation.cleanData;

    const pool = getPool();

    // Check account appliance limit (Max 100 appliances per user)
    const [countRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM appliances WHERE user_id = ?',
      [userId]
    );
    if (countRows[0] && countRows[0].total >= 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVENTORY_LIMIT_EXCEEDED',
          message: 'Appliance inventory limit reached (maximum 100 appliances per account).'
        }
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO appliances (user_id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month]
    );

    const newId = result.insertId;
    const rate = await getUserRate(userId);

    const appData = {
      id: newId,
      name,
      category,
      room,
      rated_watts,
      quantity,
      daily_hours,
      days_used_per_month
    };

    const computed = calculator.computeApplianceMetrics(appData, rate, { round: true });

    return res.status(201).json({
      success: true,
      data: computed,
      message: 'Appliance added successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/appliances/:id
 * Update an appliance owned by the authenticated user.
 */
async function updateAppliance(req, res, next) {
  try {
    const userId = req.session.userId;
    const applianceId = parseInt(req.params.id, 10);

    if (!Number.isInteger(applianceId) || applianceId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid appliance ID required in URL path', field: 'id' }
      });
    }

    const validation = validateApplianceInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const pool = getPool();

    // Verify ownership and existence
    const [existing] = await pool.execute(
      'SELECT id FROM appliances WHERE id = ? AND user_id = ? LIMIT 1',
      [applianceId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Appliance not found' }
      });
    }

    const { name, category, room, rated_watts, quantity, daily_hours, days_used_per_month } = validation.cleanData;

    await pool.execute(
      'UPDATE appliances SET name = ?, category = ?, room = ?, rated_watts = ?, quantity = ?, daily_hours = ?, days_used_per_month = ? WHERE id = ? AND user_id = ?',
      [name, category, room, rated_watts, quantity, daily_hours, days_used_per_month, applianceId, userId]
    );

    const rate = await getUserRate(userId);

    const appData = {
      id: applianceId,
      name,
      category,
      room,
      rated_watts,
      quantity,
      daily_hours,
      days_used_per_month
    };

    const computed = calculator.computeApplianceMetrics(appData, rate, { round: true });

    return res.status(200).json({
      success: true,
      data: computed,
      message: 'Appliance updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/appliances/:id
 * Delete an appliance owned by the authenticated user.
 */
async function deleteAppliance(req, res, next) {
  try {
    const userId = req.session.userId;
    const applianceId = parseInt(req.params.id, 10);

    if (!Number.isInteger(applianceId) || applianceId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid appliance ID required in URL path', field: 'id' }
      });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'DELETE FROM appliances WHERE id = ? AND user_id = ?',
      [applianceId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Appliance not found' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appliance removed from inventory'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/appliances/preview
 * Stateless calculation preview. Does not modify database records.
 */
async function previewAppliance(req, res, next) {
  try {
    const userId = req.session.userId;
    const body = req.body || {};

    const ratedWatts = Number(body.rated_watts);
    const quantity = body.quantity !== undefined ? Number(body.quantity) : 1;
    const dailyHours = Number(body.daily_hours);
    const daysUsed = body.days_used_per_month !== undefined ? Number(body.days_used_per_month) : 30;

    if (!Number.isFinite(ratedWatts) || ratedWatts < 1.0 || ratedWatts > 10000.0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Rated watts must be between 1.0 and 10000.0', field: 'rated_watts' }
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Quantity must be an integer between 1 and 50', field: 'quantity' }
      });
    }

    if (!Number.isFinite(dailyHours) || dailyHours < 0.1 || dailyHours > 24.0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Daily hours must be between 0.1 and 24.0', field: 'daily_hours' }
      });
    }

    if (!Number.isInteger(daysUsed) || daysUsed < 1 || daysUsed > 31) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Days used per month must be an integer between 1 and 31', field: 'days_used_per_month' }
      });
    }

    const rate = await getUserRate(userId);

    const computed = calculator.computeApplianceMetrics({
      rated_watts: ratedWatts,
      quantity,
      daily_hours: dailyHours,
      days_used_per_month: daysUsed
    }, rate, { round: true });

    return res.status(200).json({
      success: true,
      data: {
        daily_kwh: computed.daily_kwh,
        monthly_kwh: computed.monthly_kwh,
        monthly_cost: computed.monthly_cost
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateApplianceInput,
  listAppliances,
  createAppliance,
  updateAppliance,
  deleteAppliance,
  previewAppliance
};
