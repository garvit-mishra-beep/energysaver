/**
 * EnergySaver - Report Controller
 * Manages estimate snapshots, actual utility bills, bill reconciliation,
 * and secure CSV exports with spreadsheet formula injection defense.
 */

'use strict';

const { getPool } = require('../config/database');
const calculator = require('../services/calculator');

/**
 * Validate date in YYYY-MM-DD format.
 * @param {string} dateStr 
 * @returns {boolean}
 */
function isValidDate(dateStr) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateStr;
}

/**
 * Sanitize a CSV cell value against Spreadsheet Formula Injection (CWE-1236).
 * Prepends a single quote if the string begins with =, +, -, @, \t, or \r (including after leading whitespace).
 * @param {*} val 
 * @returns {string} Sanitized and escaped quoted CSV cell
 */
function sanitizeCsvCell(val) {
  if (val === null || val === undefined) {
    return '""';
  }
  let str = String(val);
  const trimmed = str.trimStart();
  if (trimmed.length > 0 && ['=', '+', '-', '@', '\t', '\r'].includes(trimmed.charAt(0))) {
    str = "'" + str;
  }
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * POST /api/reports/snapshots
 * Preserves the current active appliance baseline and totals into an immutable report snapshot.
 */
async function saveSnapshot(req, res, next) {
  let connection;
  try {
    const userId = req.session.userId;
    const { period_name, period_start, period_end } = req.body;

    if (!period_name || typeof period_name !== 'string' || period_name.trim().length === 0 || period_name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Period name is required (max 100 characters).', field: 'period_name' }
      });
    }

    if (!isValidDate(period_start)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid period_start in YYYY-MM-DD format is required.', field: 'period_start' }
      });
    }

    if (!isValidDate(period_end)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid period_end in YYYY-MM-DD format is required.', field: 'period_end' }
      });
    }

    if (period_start > period_end) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Period start date cannot be after period end date.', field: 'period_start' }
      });
    }

    const pool = getPool();
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Fetch user settings
    const [settingsRows] = await connection.execute(
      'SELECT electricity_rate, monthly_budget FROM user_settings WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const settings = settingsRows.length > 0 ? settingsRows[0] : {};
    const rate = settings.electricity_rate ? parseFloat(settings.electricity_rate) : 8.0;
    const budget = settings.monthly_budget !== undefined && settings.monthly_budget !== null ? parseFloat(settings.monthly_budget) : 3500.0;

    // 2. Fetch all user appliances
    const [appliances] = await connection.execute(
      'SELECT id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month FROM appliances WHERE user_id = ?',
      [userId]
    );

    const mappedAppliances = appliances.map((a) => ({
      ...a,
      rated_watts: parseFloat(a.rated_watts),
      quantity: parseInt(a.quantity, 10),
      daily_hours: parseFloat(a.daily_hours),
      days_used_per_month: parseInt(a.days_used_per_month, 10)
    }));

    // 3. Calculate authoritative totals
    const totals = calculator.calculateHouseholdTotals(mappedAppliances, rate, budget, { round: true });

    // 4. Insert into report_snapshots
    const [snapshotResult] = await connection.execute(
      `INSERT INTO report_snapshots 
        (user_id, period_name, period_start, period_end, total_kwh, total_cost, tariff_rate_used, budget_used, calculation_version)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'v1.0')`,
      [
        userId,
        period_name.trim(),
        period_start,
        period_end,
        totals.total_monthly_kwh,
        totals.total_estimated_bill,
        rate,
        budget
      ]
    );

    const snapshotId = snapshotResult.insertId;

    // 5. Insert frozen item records into report_snapshot_items
    for (const item of totals.computed_appliances) {
      await connection.execute(
        `INSERT INTO report_snapshot_items
          (snapshot_id, appliance_name, room, category, rated_watts, quantity, daily_hours, days_used, monthly_kwh, monthly_cost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          snapshotId,
          item.name,
          item.room,
          item.category,
          item.rated_watts,
          item.quantity,
          item.daily_hours,
          item.days_used_per_month,
          item.monthly_kwh,
          item.monthly_cost
        ]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      data: {
        snapshot_id: snapshotId,
        period_name: period_name.trim(),
        total_kwh: totals.total_monthly_kwh,
        total_cost: totals.total_estimated_bill,
        created_at: new Date().toISOString()
      },
      message: 'Estimate snapshot preserved successfully'
    });
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rbErr) {
        // Rollback error ignored
      }
    }
    next(err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * GET /api/reports/snapshots
 * Returns all saved estimate snapshots for the authenticated user.
 */
async function listSnapshots(req, res, next) {
  try {
    const userId = req.session.userId;
    const pool = getPool();

    const [rows] = await pool.execute(
      `SELECT id, period_name, 
              DATE_FORMAT(period_start, '%Y-%m-%d') AS period_start, 
              DATE_FORMAT(period_end, '%Y-%m-%d') AS period_end, 
              total_kwh, total_cost, tariff_rate_used, budget_used, calculation_version, created_at 
       FROM report_snapshots 
       WHERE user_id = ? 
       ORDER BY period_start DESC, created_at DESC`,
      [userId]
    );

    const snapshots = rows.map((r) => ({
      id: r.id,
      period_name: r.period_name,
      period_start: r.period_start,
      period_end: r.period_end,
      total_kwh: parseFloat(r.total_kwh),
      total_cost: parseFloat(r.total_cost),
      tariff_rate_used: parseFloat(r.tariff_rate_used),
      budget_used: parseFloat(r.budget_used),
      calculation_version: r.calculation_version,
      created_at: r.created_at
    }));

    return res.status(200).json({
      success: true,
      data: snapshots
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports/snapshots/:id
 * Returns a specific snapshot with its immutable appliance breakdown.
 */
async function getSnapshotDetails(req, res, next) {
  try {
    const userId = req.session.userId;
    const snapshotId = parseInt(req.params.id, 10);

    if (!Number.isInteger(snapshotId) || snapshotId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Valid positive integer snapshot ID is required.', field: 'id' }
      });
    }

    const pool = getPool();

    const [snapshotRows] = await pool.execute(
      `SELECT id, period_name, 
              DATE_FORMAT(period_start, '%Y-%m-%d') AS period_start, 
              DATE_FORMAT(period_end, '%Y-%m-%d') AS period_end, 
              total_kwh, total_cost, tariff_rate_used, budget_used, calculation_version, created_at 
       FROM report_snapshots 
       WHERE id = ? AND user_id = ? 
       LIMIT 1`,
      [snapshotId, userId]
    );

    if (snapshotRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Snapshot not found.' }
      });
    }

    const snapshot = snapshotRows[0];

    const [itemRows] = await pool.execute(
      `SELECT id, appliance_name, room, category, rated_watts, quantity, daily_hours, days_used, monthly_kwh, monthly_cost 
       FROM report_snapshot_items 
       WHERE snapshot_id = ? 
       ORDER BY monthly_kwh DESC`,
      [snapshotId]
    );

    const items = itemRows.map((item) => ({
      id: item.id,
      appliance_name: item.appliance_name,
      room: item.room,
      category: item.category,
      rated_watts: parseFloat(item.rated_watts),
      quantity: parseInt(item.quantity, 10),
      daily_hours: parseFloat(item.daily_hours),
      days_used: parseInt(item.days_used, 10),
      monthly_kwh: parseFloat(item.monthly_kwh),
      monthly_cost: parseFloat(item.monthly_cost)
    }));

    return res.status(200).json({
      success: true,
      data: {
        id: snapshot.id,
        period_name: snapshot.period_name,
        period_start: snapshot.period_start,
        period_end: snapshot.period_end,
        total_kwh: parseFloat(snapshot.total_kwh),
        total_cost: parseFloat(snapshot.total_cost),
        tariff_rate_used: parseFloat(snapshot.tariff_rate_used),
        budget_used: parseFloat(snapshot.budget_used),
        calculation_version: snapshot.calculation_version,
        created_at: snapshot.created_at,
        items
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actual-bills
 * Logs an actual utility bill for variance comparison.
 */
async function logActualBill(req, res, next) {
  try {
    const userId = req.session.userId;
    const { billing_start_date, billing_end_date, billed_kwh, billed_amount, provider_name, notes } = req.body;

    if (!isValidDate(billing_start_date)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid billing_start_date in YYYY-MM-DD format is required.', field: 'billing_start_date' }
      });
    }

    if (!isValidDate(billing_end_date)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Valid billing_end_date in YYYY-MM-DD format is required.', field: 'billing_end_date' }
      });
    }

    if (billing_start_date > billing_end_date) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Billing start date cannot be after billing end date.', field: 'billing_start_date' }
      });
    }

    const kwh = parseFloat(billed_kwh);
    if (isNaN(kwh) || kwh < 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Billed kWh must be a non-negative number.', field: 'billed_kwh' }
      });
    }

    const amount = parseFloat(billed_amount);
    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Billed amount must be a non-negative number.', field: 'billed_amount' }
      });
    }

    const provider = provider_name && typeof provider_name === 'string' ? provider_name.trim().slice(0, 100) : null;
    const cleanNotes = notes && typeof notes === 'string' ? notes.trim().slice(0, 1000) : null;

    const pool = getPool();
    const [result] = await pool.execute(
      `INSERT INTO actual_bills 
        (user_id, billing_start_date, billing_end_date, billed_kwh, billed_amount, provider_name, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, billing_start_date, billing_end_date, kwh, amount, provider, cleanNotes]
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        billed_kwh: calculator.roundTo(kwh, 2),
        billed_amount: calculator.roundTo(amount, 2)
      },
      message: 'Actual bill recorded successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/actual-bills
 * Returns all logged actual utility bills for the user.
 */
async function listActualBills(req, res, next) {
  try {
    const userId = req.session.userId;
    const pool = getPool();

    const [rows] = await pool.execute(
      `SELECT id, 
              DATE_FORMAT(billing_start_date, '%Y-%m-%d') AS billing_start_date, 
              DATE_FORMAT(billing_end_date, '%Y-%m-%d') AS billing_end_date, 
              billed_kwh, billed_amount, provider_name, notes, created_at 
       FROM actual_bills 
       WHERE user_id = ? 
       ORDER BY billing_start_date DESC`,
      [userId]
    );

    const bills = rows.map((b) => ({
      id: b.id,
      billing_start_date: b.billing_start_date,
      billing_end_date: b.billing_end_date,
      billed_kwh: parseFloat(b.billed_kwh),
      billed_amount: parseFloat(b.billed_amount),
      provider_name: b.provider_name,
      notes: b.notes,
      created_at: b.created_at
    }));

    return res.status(200).json({
      success: true,
      data: bills
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/actual-bills/:id
 * Deletes an actual utility bill owned by the authenticated user.
 */
async function deleteActualBill(req, res, next) {
  try {
    const userId = req.session.userId;
    const billId = parseInt(req.params.id, 10);

    if (!Number.isInteger(billId) || billId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Valid positive integer bill ID is required.', field: 'id' }
      });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      'DELETE FROM actual_bills WHERE id = ? AND user_id = ?',
      [billId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Actual bill not found in your records.' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Actual bill deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports/reconcile?snapshot_id=X&bill_id=Y
 * Reconciles an estimated snapshot against an actual utility bill.
 */
async function reconcileBill(req, res, next) {
  try {
    const userId = req.session.userId;
    const snapshotId = parseInt(req.query.snapshot_id, 10);
    const billId = parseInt(req.query.bill_id, 10);

    if (!Number.isInteger(snapshotId) || snapshotId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PARAM', message: 'Valid snapshot_id query parameter is required.', field: 'snapshot_id' }
      });
    }

    if (!Number.isInteger(billId) || billId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PARAM', message: 'Valid bill_id query parameter is required.', field: 'bill_id' }
      });
    }

    const pool = getPool();

    // 1. Fetch snapshot with ownership check
    const [snapshots] = await pool.execute(
      `SELECT id, period_name, 
              DATE_FORMAT(period_start, '%Y-%m-%d') AS period_start, 
              DATE_FORMAT(period_end, '%Y-%m-%d') AS period_end, 
              total_kwh, total_cost 
       FROM report_snapshots 
       WHERE id = ? AND user_id = ? LIMIT 1`,
      [snapshotId, userId]
    );

    if (snapshots.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Snapshot not found in your records.' }
      });
    }
    const snapshot = snapshots[0];

    // 2. Fetch actual bill with ownership check
    const [bills] = await pool.execute(
      `SELECT id, 
              DATE_FORMAT(billing_start_date, '%Y-%m-%d') AS billing_start_date, 
              DATE_FORMAT(billing_end_date, '%Y-%m-%d') AS billing_end_date, 
              billed_kwh, billed_amount, provider_name, notes 
       FROM actual_bills 
       WHERE id = ? AND user_id = ? LIMIT 1`,
      [billId, userId]
    );

    if (bills.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Actual bill not found in your records.' }
      });
    }
    const bill = bills[0];

    // 3. Compare dates
    const datesMatch = snapshot.period_start === bill.billing_start_date && snapshot.period_end === bill.billing_end_date;

    // 4. Calculate variance
    const estKwh = parseFloat(snapshot.total_kwh);
    const estCost = parseFloat(snapshot.total_cost);
    const actKwh = parseFloat(bill.billed_kwh);
    const actCost = parseFloat(bill.billed_amount);

    const kwhDiff = calculator.roundTo(actKwh - estKwh, 2);
    const kwhPct = estKwh > 0 ? calculator.roundTo((Math.abs(kwhDiff) / estKwh) * 100, 2) : 0;

    const costDiff = calculator.roundTo(actCost - estCost, 2);
    const costPct = estCost > 0 ? calculator.roundTo((Math.abs(costDiff) / estCost) * 100, 2) : 0;

    const educationalChecklist = [
      'Unlisted temporary appliances (e.g. festive lights, room heaters)',
      'Thermostat or compressor duty cycle differences during temperature shifts',
      'Utility provider fixed charges or meter rental fees not included in flat kWh rate'
    ];

    return res.status(200).json({
      success: true,
      data: {
        dates_match: datesMatch,
        period: `${snapshot.period_start} to ${snapshot.period_end}`,
        estimate: {
          kwh: estKwh,
          cost: estCost
        },
        actual: {
          kwh: actKwh,
          cost: actCost
        },
        variance: {
          kwh_difference: kwhDiff,
          kwh_percentage: kwhPct,
          cost_difference: costDiff,
          cost_percentage: costPct
        },
        educational_checklist: educationalChecklist
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reports/export-csv
 * Exports active appliance inventory to CSV with formula injection defense.
 */
async function exportCsv(req, res, next) {
  try {
    const userId = req.session.userId;
    const pool = getPool();

    // 1. Fetch user settings
    const [settingsRows] = await pool.execute(
      'SELECT electricity_rate, currency_symbol FROM user_settings WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const settings = settingsRows.length > 0 ? settingsRows[0] : {};
    const rate = settings.electricity_rate ? parseFloat(settings.electricity_rate) : 8.0;
    const currency = settings.currency_symbol || 'INR';

    // 2. Fetch appliances
    const [appliances] = await pool.execute(
      'SELECT id, name, room, category, rated_watts, quantity, daily_hours, days_used_per_month FROM appliances WHERE user_id = ? ORDER BY room, name',
      [userId]
    );

    // 3. Build CSV Header
    const headers = [
      'Appliance',
      'Room',
      'Category',
      'Rated Watts',
      'Quantity',
      'Daily Hours',
      'Days/Month',
      'Daily kWh',
      'Monthly kWh',
      `Monthly Cost (${currency})`
    ];

    const csvLines = [];
    csvLines.push(headers.map(sanitizeCsvCell).join(','));

    // 4. Build CSV Data Rows
    for (const app of appliances) {
      const watts = parseFloat(app.rated_watts);
      const qty = parseInt(app.quantity, 10);
      const hours = parseFloat(app.daily_hours);
      const days = parseInt(app.days_used_per_month, 10);

      const dailyKwh = calculator.roundTo(calculator.calculateDailyKwh(watts, qty, hours), 2);
      const monthlyKwh = calculator.roundTo(calculator.calculateMonthlyKwh(dailyKwh, days), 2);
      const monthlyCost = calculator.roundTo(calculator.calculateFlatCost(monthlyKwh, rate), 2);

      const row = [
        sanitizeCsvCell(app.name),
        sanitizeCsvCell(app.room),
        sanitizeCsvCell(app.category),
        sanitizeCsvCell(watts),
        sanitizeCsvCell(qty),
        sanitizeCsvCell(hours),
        sanitizeCsvCell(days),
        sanitizeCsvCell(dailyKwh),
        sanitizeCsvCell(monthlyKwh),
        sanitizeCsvCell(monthlyCost)
      ];

      csvLines.push(row.join(','));
    }

    const csvContent = csvLines.join('\r\n');
    const today = new Date().toISOString().slice(0, 10);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="energysaver_appliances_${today}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  saveSnapshot,
  listSnapshots,
  getSnapshotDetails,
  logActualBill,
  listActualBills,
  deleteActualBill,
  reconcileBill,
  exportCsv,
  sanitizeCsvCell
};
