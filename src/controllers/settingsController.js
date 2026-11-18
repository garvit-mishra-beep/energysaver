/**
 * EnergySaver - User Settings Controller
 * Manages user-specific electricity tariff rate, budget, currency symbol, and custom rooms.
 * Strictly enforces user ownership: WHERE user_id = req.session.userId.
 */

const { getPool } = require('../config/database');

/**
 * GET /api/settings
 * Retrieves authenticated user's settings.
 */
async function getSettings(req, res, next) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT electricity_rate, monthly_budget, currency_symbol, tariff_type, custom_rooms, updated_at
       FROM user_settings
       WHERE user_id = ?
       LIMIT 1`,
      [req.session.userId]
    );

    if (rows.length === 0) {
      // Auto-initialize if missing
      await pool.execute(
        'INSERT IGNORE INTO user_settings (user_id, electricity_rate, monthly_budget, currency_symbol, tariff_type) VALUES (?, 8.0000, 3500.00, ?, "flat")',
        [req.session.userId, '₹']
      );
      return res.status(200).json({
        success: true,
        data: {
          electricity_rate: 8.0,
          monthly_budget: 3500.0,
          currency_symbol: '₹',
          tariff_type: 'flat',
          custom_rooms: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Other']
        }
      });
    }

    const s = rows[0];
    let customRooms = s.custom_rooms;
    if (typeof customRooms === 'string') {
      try { customRooms = JSON.parse(customRooms); } catch (e) { customRooms = null; }
    }
    if (!customRooms || !Array.isArray(customRooms)) {
      customRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Other'];
    }

    return res.status(200).json({
      success: true,
      data: {
        electricity_rate: parseFloat(s.electricity_rate),
        monthly_budget: parseFloat(s.monthly_budget),
        currency_symbol: s.currency_symbol,
        tariff_type: s.tariff_type,
        custom_rooms: customRooms,
        updated_at: s.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/settings
 * Updates authenticated user's settings with server-side validation.
 */
async function updateSettings(req, res, next) {
  try {
    const { electricity_rate, monthly_budget, currency_symbol, custom_rooms } = req.body;

    const rate = parseFloat(electricity_rate);
    const budget = parseFloat(monthly_budget);
    const currency = typeof currency_symbol === 'string' ? currency_symbol.trim() : '₹';

    if (isNaN(rate) || rate <= 0 || rate > 1000) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_RATE', message: 'Electricity rate must be a positive number between 0.0001 and 1000.0', field: 'electricity_rate' }
      });
    }

    if (isNaN(budget) || budget < 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BUDGET', message: 'Monthly budget must be 0 or a positive number', field: 'monthly_budget' }
      });
    }

    if (!currency || currency.length > 10) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CURRENCY', message: 'Currency symbol is required (max 10 characters)', field: 'currency_symbol' }
      });
    }

    let validRoomsJson = null;
    if (Array.isArray(custom_rooms)) {
      const sanitized = custom_rooms
        .filter((r) => typeof r === 'string' && r.trim().length > 0)
        .map((r) => r.trim().slice(0, 50));
      validRoomsJson = JSON.stringify(sanitized);
    }

    const pool = getPool();
    await pool.execute(
      `UPDATE user_settings
       SET electricity_rate = ?, monthly_budget = ?, currency_symbol = ?, custom_rooms = COALESCE(?, custom_rooms)
       WHERE user_id = ?`,
      [rate, budget, currency, validRoomsJson, req.session.userId]
    );

    return res.status(200).json({
      success: true,
      data: {
        electricity_rate: rate,
        monthly_budget: budget,
        currency_symbol: currency
      },
      message: 'Settings updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSettings,
  updateSettings
};
