/**
 * EnergySaver - Dashboard Controller
 * Computes household monthly totals, estimated bill, budget status, room breakdown,
 * and top consumers for the authenticated user using the authoritative calculation service.
 */

'use strict';

const { getPool } = require('../config/database');
const calculator = require('../services/calculator');

/**
 * GET /api/dashboard/summary
 * Returns aggregated household electricity metrics and visualization datasets.
 */
async function getSummary(req, res, next) {
  try {
    const userId = req.session.userId;
    const pool = getPool();

    // 1. Fetch user settings
    const [settingsRows] = await pool.execute(
      'SELECT electricity_rate, monthly_budget, currency_symbol FROM user_settings WHERE user_id = ? LIMIT 1',
      [userId]
    );

    const settings = settingsRows.length > 0 ? settingsRows[0] : {};
    const rate = settings.electricity_rate ? parseFloat(settings.electricity_rate) : 8.0000;
    const budget = settings.monthly_budget !== undefined && settings.monthly_budget !== null ? parseFloat(settings.monthly_budget) : 3500.00;
    const currencySymbol = settings.currency_symbol || '₹';

    // 2. Fetch active appliances owned by user
    const [applianceRows] = await pool.execute(
      'SELECT id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month, created_at FROM appliances WHERE user_id = ?',
      [userId]
    );

    const appliances = applianceRows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      room: r.room,
      rated_watts: parseFloat(r.rated_watts),
      quantity: parseInt(r.quantity, 10),
      daily_hours: parseFloat(r.daily_hours),
      days_used_per_month: parseInt(r.days_used_per_month, 10),
      created_at: r.created_at
    }));

    // 3. Compute authoritative household totals with deterministic tie-breaking
    const totals = calculator.calculateHouseholdTotals(appliances, rate, budget, { round: true });

    // Format top appliances for dashboard visualization
    const topAppliances = totals.top_appliances.map((app) => ({
      id: app.id,
      name: app.name,
      room: app.room,
      category: app.category,
      monthly_kwh: app.monthly_kwh,
      monthly_cost: app.monthly_cost
    }));

    return res.status(200).json({
      success: true,
      data: {
        period: 'Current Period',
        currency_symbol: currencySymbol,
        tariff_rate: rate,
        total_appliances: totals.total_appliances,
        total_monthly_kwh: totals.total_monthly_kwh,
        total_estimated_bill: totals.total_estimated_bill,
        monthly_budget: totals.monthly_budget,
        budget_variance: totals.budget_variance,
        budget_percentage: totals.budget_percentage,
        budget_status: totals.budget_status,
        highest_consumer: totals.highest_consumer,
        room_breakdown: totals.room_breakdown,
        top_appliances: topAppliances
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSummary
};
