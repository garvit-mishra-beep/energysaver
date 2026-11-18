/**
 * EnergySaver - Authoritative Server Calculation Service
 * Implements certified mathematical calculations defined in docs/CALCULATIONS.md.
 * 
 * Rules:
 * 1. Daily kWh = (rated_watts * quantity * daily_hours) / 1000
 * 2. Monthly kWh = Daily kWh * days_used_per_month
 * 3. Flat Cost = Monthly kWh * electricity_rate
 * 4. Intermediate calculations retain full 64-bit IEEE-754 precision without premature rounding.
 * 5. Display / API rounding is applied strictly at presentation or serialization boundaries via roundTo().
 */

'use strict';

/**
 * Robust arithmetic half-up rounding avoiding binary floating-point representation anomalies.
 * @param {number} val - Input numerical value
 * @param {number} decimals - Target decimal places (default 2)
 * @returns {number} Rounded numerical value
 */
function roundTo(val, decimals = 2) {
  if (typeof val !== 'number' || !Number.isFinite(val)) return 0;
  return Number(Math.round(Number(val + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * Calculate daily electricity consumption in kWh.
 * Formula: (Watts * Quantity * Hours) / 1000
 * @param {number|string} watts - Rated wattage (1 to 10000)
 * @param {number|string} quantity - Quantity of appliances (1 to 50)
 * @param {number|string} hours - Daily operating hours (0.1 to 24.0)
 * @returns {number} Unrounded daily kWh
 */
function calculateDailyKwh(watts, quantity, hours) {
  const w = Number(watts);
  const q = Number(quantity);
  const h = Number(hours);

  if (!Number.isFinite(w) || !Number.isFinite(q) || !Number.isFinite(h)) return 0;
  if (w <= 0 || q <= 0 || h <= 0) return 0;

  return (w * q * h) / 1000;
}

/**
 * Calculate monthly electricity consumption in kWh.
 * Formula: Daily kWh * Days
 * Note: Uses unrounded daily kWh to avoid compounding rounding errors.
 * @param {number|string} dailyKwh - Daily consumption in kWh
 * @param {number|string} days - Days used per month (1 to 31)
 * @returns {number} Unrounded monthly kWh
 */
function calculateMonthlyKwh(dailyKwh, days) {
  const dKwh = Number(dailyKwh);
  const d = Number(days);

  if (!Number.isFinite(dKwh) || !Number.isFinite(d)) return 0;
  if (dKwh <= 0 || d <= 0) return 0;

  return dKwh * d;
}

/**
 * Calculate flat-rate monthly electricity cost.
 * Formula: Monthly kWh * Rate per kWh
 * @param {number|string} monthlyKwh - Monthly consumption in kWh
 * @param {number|string} ratePerKwh - Cost per kWh (utility tariff rate)
 * @returns {number} Unrounded monthly cost
 */
function calculateFlatCost(monthlyKwh, ratePerKwh) {
  const kwh = Number(monthlyKwh);
  const rate = Number(ratePerKwh);

  if (!Number.isFinite(kwh) || !Number.isFinite(rate)) return 0;
  if (kwh <= 0 || rate <= 0) return 0;

  return kwh * rate;
}

/**
 * Compute calculated metrics for an individual appliance.
 * @param {Object} appliance - Appliance raw data { rated_watts, quantity, daily_hours, days_used_per_month }
 * @param {number|string} ratePerKwh - Tariff rate per kWh
 * @param {Object} [options] - Configuration options { round: boolean }
 * @returns {Object} Appliance object augmented with daily_kwh, monthly_kwh, and monthly_cost
 */
function computeApplianceMetrics(appliance, ratePerKwh, options = {}) {
  if (!appliance || typeof appliance !== 'object') {
    return { daily_kwh: 0, monthly_kwh: 0, monthly_cost: 0 };
  }

  const dailyKwh = calculateDailyKwh(
    appliance.rated_watts,
    appliance.quantity !== undefined ? appliance.quantity : 1,
    appliance.daily_hours
  );

  const days = appliance.days_used_per_month !== undefined ? appliance.days_used_per_month : 30;
  const monthlyKwh = calculateMonthlyKwh(dailyKwh, days);
  const monthlyCost = calculateFlatCost(monthlyKwh, ratePerKwh);

  const shouldRound = options.round === true;

  return {
    ...appliance,
    daily_kwh: shouldRound ? roundTo(dailyKwh, 2) : dailyKwh,
    monthly_kwh: shouldRound ? roundTo(monthlyKwh, 2) : monthlyKwh,
    monthly_cost: shouldRound ? roundTo(monthlyCost, 2) : monthlyCost
  };
}

/**
 * Compute aggregate household overview metrics across an appliance inventory.
 * @param {Array} appliances - Array of appliance records
 * @param {number|string} ratePerKwh - Tariff rate per kWh
 * @param {number|string} monthlyBudget - Target monthly budget
 * @param {Object} [options] - Configuration options { round: boolean }
 * @returns {Object} Summary totals, room breakdown, top consumer, and budget status
 */
function calculateHouseholdTotals(appliances, ratePerKwh, monthlyBudget, options = {}) {
  const items = Array.isArray(appliances) ? appliances : [];
  const rate = Number(ratePerKwh) || 0;
  const budget = Number(monthlyBudget) || 0;
  const shouldRound = options.round === true;

  let totalMonthlyKwh = 0;
  let totalMonthlyCost = 0;
  const roomMap = {};
  const computedItems = [];

  items.forEach((app) => {
    // Keep unrounded during aggregation
    const computed = computeApplianceMetrics(app, rate, { round: false });
    computedItems.push(computed);

    totalMonthlyKwh += computed.monthly_kwh;
    totalMonthlyCost += computed.monthly_cost;

    const room = computed.room || 'Other';
    if (!roomMap[room]) {
      roomMap[room] = { room, appliance_count: 0, monthly_kwh: 0, cost: 0 };
    }
    roomMap[room].appliance_count += 1;
    roomMap[room].monthly_kwh += computed.monthly_kwh;
    roomMap[room].cost += computed.monthly_cost;
  });

  // Room breakdown with percentage calculation
  const roomBreakdown = Object.values(roomMap).map((r) => {
    const pct = totalMonthlyKwh > 0 ? (r.monthly_kwh / totalMonthlyKwh) * 100 : 0;
    return {
      room: r.room,
      appliance_count: r.appliance_count,
      monthly_kwh: shouldRound ? roundTo(r.monthly_kwh, 2) : r.monthly_kwh,
      cost: shouldRound ? roundTo(r.cost, 2) : r.cost,
      percentage: shouldRound ? roundTo(pct, 2) : pct
    };
  });

  // Sort rooms descending by monthly kWh
  roomBreakdown.sort((a, b) => b.monthly_kwh - a.monthly_kwh);

  // Identify highest consumer
  const sortedAppliances = [...computedItems].sort((a, b) => b.monthly_kwh - a.monthly_kwh);
  let highestConsumer = null;
  if (sortedAppliances.length > 0 && totalMonthlyKwh > 0) {
    const top = sortedAppliances[0];
    const topPct = (top.monthly_kwh / totalMonthlyKwh) * 100;
    highestConsumer = {
      id: top.id,
      name: top.name,
      room: top.room,
      monthly_kwh: shouldRound ? roundTo(top.monthly_kwh, 2) : top.monthly_kwh,
      monthly_cost: shouldRound ? roundTo(top.monthly_cost, 2) : top.monthly_cost,
      percentage: shouldRound ? roundTo(topPct, 2) : topPct,
      percentage_of_total: shouldRound ? roundTo(topPct, 2) : topPct
    };
  }

  // Budget Analysis
  const budgetDifference = budget > 0 ? budget - totalMonthlyCost : 0;
  const budgetUtilization = budget > 0 ? (totalMonthlyCost / budget) * 100 : 0;

  let budgetStatus = 'NORMAL';
  if (budget > 0) {
    if (budgetUtilization > 100) {
      budgetStatus = 'OVER_BUDGET';
    } else if (budgetUtilization >= 80) {
      budgetStatus = 'APPROACHING_BUDGET';
    }
  } else {
    budgetStatus = 'NO_BUDGET_SET';
  }

  // Prepared computed appliances for display if round is requested
  const outputAppliances = shouldRound
    ? computedItems.map((item) => ({
      ...item,
      daily_kwh: roundTo(item.daily_kwh, 2),
      monthly_kwh: roundTo(item.monthly_kwh, 2),
      monthly_cost: roundTo(item.monthly_cost, 2)
    }))
    : computedItems;

  const sortedOutputAppliances = [...outputAppliances].sort((a, b) => b.monthly_kwh - a.monthly_kwh);

  return {
    total_appliances: items.length,
    total_monthly_kwh: shouldRound ? roundTo(totalMonthlyKwh, 2) : totalMonthlyKwh,
    total_monthly_cost: shouldRound ? roundTo(totalMonthlyCost, 2) : totalMonthlyCost,
    total_estimated_bill: shouldRound ? roundTo(totalMonthlyCost, 2) : totalMonthlyCost,
    monthly_budget: shouldRound ? roundTo(budget, 2) : budget,
    budget_variance: shouldRound ? roundTo(budgetDifference, 2) : budgetDifference,
    budget_difference: shouldRound ? roundTo(budgetDifference, 2) : budgetDifference,
    budget_percentage: shouldRound ? roundTo(budgetUtilization, 2) : budgetUtilization,
    budget_utilization: shouldRound ? roundTo(budgetUtilization, 2) : budgetUtilization,
    budget_status: budgetStatus,
    highest_consumer: highestConsumer,
    room_breakdown: roomBreakdown,
    top_appliances: sortedOutputAppliances.slice(0, 5),
    computed_appliances: outputAppliances
  };
}

/**
 * Compare baseline appliances against proposed temporary modifications.
 * @param {Array} baselineAppliances
 * @param {Array} proposedAppliances
 * @param {number|string} ratePerKwh
 * @param {number|string} monthlyBudget
 * @param {Object} [options]
 * @returns {Object} Baseline totals, Proposed totals, and Delta savings
 */
function calculateScenarioDelta(baselineAppliances, proposedAppliances, ratePerKwh, monthlyBudget, options = {}) {
  const shouldRound = options.round === true;
  const baseline = calculateHouseholdTotals(baselineAppliances, ratePerKwh, monthlyBudget, options);
  const proposed = calculateHouseholdTotals(proposedAppliances, ratePerKwh, monthlyBudget, options);

  // Compute unrounded totals for delta precision to eliminate compounding rounding errors
  const unroundedBaseline = calculateHouseholdTotals(baselineAppliances, ratePerKwh, monthlyBudget, { round: false });
  const unroundedProposed = calculateHouseholdTotals(proposedAppliances, ratePerKwh, monthlyBudget, { round: false });

  const rawSavedKwh = unroundedBaseline.total_monthly_kwh - unroundedProposed.total_monthly_kwh;
  const rawSavedCost = unroundedBaseline.total_monthly_cost - unroundedProposed.total_monthly_cost;

  return {
    baseline,
    proposed,
    saved_kwh: shouldRound ? roundTo(rawSavedKwh, 2) : rawSavedKwh,
    saved_cost: shouldRound ? roundTo(rawSavedCost, 2) : rawSavedCost,
    is_savings: rawSavedCost > 0
  };
}

module.exports = {
  roundTo,
  calculateDailyKwh,
  calculateMonthlyKwh,
  calculateFlatCost,
  computeApplianceMetrics,
  calculateHouseholdTotals,
  calculateScenarioDelta
};
