/**
 * EnergySaver - My Home (Dashboard) Logic & Visualizations
 * Option B Warm Minimalist Editorial Theme
 *
 * Dual-Mode Architecture:
 * - Authenticated: Queries MySQL backend via window.EnergyApi.dashboard.getSummary() & appliances.list()
 * - Guest Demo: Queries browser localStorage via window.EnergyStorage
 */

(function () {
  'use strict';

  let roomChartInstance = null;
  let topAppliancesChartInstance = null;
  let isAuthenticatedMode = false;
  let currentAppliancesList = [];
  let currentSummaryData = null;
  let activeRoomFilter = 'all';

  // Editorial Room Palette Mapping
  const ROOM_PALETTE = ['#2D5A40', '#C86D51', '#E2A856', '#6B8E9B', '#8C6D87', '#4A7C59', '#7D827D'];
  const ROOM_COLOR_MAP = {
    'living room': '#2D5A40',
    'kitchen': '#C86D51',
    'bedrooms': '#E2A856',
    'bedroom': '#E2A856',
    'master bedroom': '#E2A856',
    'study & outdoor': '#6B8E9B',
    'study': '#6B8E9B',
    'outdoor': '#6B8E9B',
    'balcony': '#6B8E9B',
    'bathroom': '#8C6D87',
    'utility': '#4A7C59',
    'other': '#7D827D'
  };

  function getRoomColor(roomName, index) {
    const key = (roomName || '').toLowerCase().trim();
    if (ROOM_COLOR_MAP[key]) return ROOM_COLOR_MAP[key];
    return ROOM_PALETTE[index % ROOM_PALETTE.length];
  }

  document.addEventListener('DOMContentLoaded', async function () {
    setupDashboardActions();
    await initializeDashboard();

    // Hook data update listener from savings modal or navigation
    window.onDataUpdated = function () {
      loadDashboardData();
    };
    window.onDemoDataUpdated = function () {
      loadDashboardData();
    };
  });

  function setupDashboardActions() {
    const savingsBtn = document.getElementById('dashboardOpenSavingsBtn');
    if (savingsBtn) {
      savingsBtn.addEventListener('click', function () {
        if (typeof window.openSavingsModal === 'function') {
          window.openSavingsModal();
        }
      });
    }

    const loadSampleBtn = document.getElementById('dashboardLoadSampleBtn');
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener('click', function () {
        if (window.EnergyStorage && typeof window.EnergyStorage.resetToSampleData === 'function') {
          window.EnergyStorage.resetToSampleData();
          window.location.reload();
        }
      });
    }
  }

  /**
   * Determine session state and initialize dashboard
   */
  async function initializeDashboard() {
    try {
      if (window.EnergyApi) {
        const userRes = await window.EnergyApi.auth.me();
        if (userRes && userRes.success && userRes.data) {
          isAuthenticatedMode = true;
          window.currentUser = userRes.data;
        } else {
          isAuthenticatedMode = false;
          window.currentUser = null;
        }
      }
    } catch (err) {
      // 401 indicates genuine guest/unauthenticated visitor
      if (err.status === 401 || err.code === 'UNAUTHORIZED') {
        isAuthenticatedMode = false;
        window.currentUser = null;
      } else {
        // Network or server error: do not silently switch to demo mode
        showDashboardError('Unable to connect to the EnergySaver server. Please ensure the backend is running.', err);
        renderModeBadge('Connection Error', 'badge badge-danger');
        return;
      }
    }

    renderModeBadge(
      isAuthenticatedMode ? 'Database Mode (MySQL)' : 'Demo Storage Mode (Browser LocalStorage)',
      isAuthenticatedMode ? 'badge badge-preset' : 'badge'
    );

    await loadDashboardData();
  }

  function renderModeBadge(text, className) {
    const badge = document.getElementById('dashboardModeBadge');
    if (badge) {
      badge.textContent = text;
      badge.className = className;
    }
  }

  function showDashboardError(message, detail) {
    const errorContainer = document.getElementById('dashboardErrorContainer');
    if (errorContainer) {
      errorContainer.style.display = 'block';
      errorContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <div>
            <div class="alert-title">${window.EnergyFormatters.escapeHtml(message)}</div>
            ${detail ? `<div style="font-size: var(--font-size-xs); margin-top: 4px;">${window.EnergyFormatters.escapeHtml(detail.message || String(detail))}</div>` : ''}
            <div style="margin-top: var(--space-2);">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.reload()">Retry Connection</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  function clearDashboardError() {
    const errorContainer = document.getElementById('dashboardErrorContainer');
    if (errorContainer) {
      errorContainer.style.display = 'none';
      errorContainer.innerHTML = '';
    }
  }

  /**
   * Fetches summary data and appliance inventory
   */
  async function loadDashboardData() {
    clearDashboardError();

    if (isAuthenticatedMode) {
      try {
        const [summaryRes, appliancesRes] = await Promise.all([
          window.EnergyApi.dashboard.getSummary(),
          window.EnergyApi.appliances.list()
        ]);

        if (summaryRes && summaryRes.success && summaryRes.data) {
          const appliances = (appliancesRes && appliancesRes.success && appliancesRes.data) ? appliancesRes.data : [];
          currentAppliancesList = appliances;
          currentSummaryData = summaryRes.data;
          renderDashboardSummary(summaryRes.data, appliances);
        } else {
          showDashboardError('Received invalid data from dashboard API.');
        }
      } catch (err) {
        console.error('[DASHBOARD API ERROR]', err);
        showDashboardError('Failed to load dashboard summary from database.', err);
      }
    } else {
      // Guest demo mode via localStorage
      const appliances = (window.EnergyStorage && window.EnergyStorage.getAppliances()) || [];
      const settings = (window.EnergyStorage && window.EnergyStorage.getSettings()) || {};

      const rate = settings.electricity_rate || 8.0;
      const budget = settings.monthly_budget !== undefined ? settings.monthly_budget : 3500.0;
      const symbol = settings.currency_symbol || '₹';
      const period = settings.period_name || 'October 2026';

      currentAppliancesList = appliances;

      if (!appliances || appliances.length === 0) {
        renderEmptyState(false);
        return;
      }

      const totals = window.EnergyCalculator.calculateHouseholdTotals(appliances, rate, budget);
      const demoSummary = {
        period: `Estimated Period: ${period}`,
        currency_symbol: symbol,
        tariff_rate: rate,
        total_appliances: totals.total_appliances,
        total_monthly_kwh: totals.total_monthly_kwh,
        total_estimated_bill: totals.total_estimated_bill,
        monthly_budget: totals.monthly_budget,
        budget_variance: totals.budget_variance,
        budget_difference: totals.budget_difference,
        budget_percentage: totals.budget_percentage,
        budget_utilization: totals.budget_utilization,
        budget_status: totals.budget_status,
        highest_consumer: totals.highest_consumer,
        room_breakdown: totals.room_breakdown,
        top_appliances: totals.top_appliances,
        is_demo: true
      };

      currentSummaryData = demoSummary;
      renderDashboardSummary(demoSummary, appliances);
    }
  }

  function renderEmptyState(isAuthenticated) {
    const emptyContainer = document.getElementById('dashboardEmptyState');
    const contentContainer = document.getElementById('dashboardContent');

    if (emptyContainer) {
      emptyContainer.style.display = 'block';
      const sampleBtn = document.getElementById('dashboardLoadSampleBtn');
      if (sampleBtn) {
        sampleBtn.style.display = isAuthenticated ? 'none' : 'inline-block';
      }
    }
    if (contentContainer) {
      contentContainer.style.display = 'none';
    }

    if (roomChartInstance) {
      roomChartInstance.destroy();
      roomChartInstance = null;
    }
    if (topAppliancesChartInstance) {
      topAppliancesChartInstance.destroy();
      topAppliancesChartInstance = null;
    }
  }

  /**
   * Main render function accepting normalized summary data and appliance list
   */
  function renderDashboardSummary(summary, appliances) {
    const emptyContainer = document.getElementById('dashboardEmptyState');
    const contentContainer = document.getElementById('dashboardContent');

    if (!summary || summary.total_appliances === 0) {
      renderEmptyState(isAuthenticatedMode);
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';
    if (contentContainer) contentContainer.style.display = 'block';

    const F = window.EnergyFormatters;
    const symbol = summary.currency_symbol || '₹';
    const rate = Number(summary.tariff_rate) || 8.0;

    // 1. Header Meta
    const periodEl = document.getElementById('dashboardPeriodName');
    if (periodEl) {
      periodEl.textContent = summary.period ? (summary.period.startsWith('Estimated') ? summary.period : `Estimated Period: ${summary.period}`) : 'Estimated Period: Current';
    }

    const tariffEl = document.getElementById('dashboardTariffRate');
    if (tariffEl) {
      tariffEl.textContent = `Electricity Rate: ${F.formatCurrency(rate, symbol)} / kWh (${summary.is_demo ? 'Hypothetical' : 'Configured in Settings'})`;
    }

    // 2. Conversational Editorial Hero
    renderConversationalHero(summary, symbol);

    // 3. Segmented Room Breakdown Progress Track & Legend
    renderRoomBreakdownTrackAndLegend(summary);

    // 4. Room Filter Pills
    renderRoomFilterPills(summary);

    // 5. Illustrated Appliance Grid
    renderApplianceGrid(currentAppliancesList, rate, symbol);

    // 6. Summary Metric Cards
    document.getElementById('metricMonthlyKwh').textContent = F.formatKwh(summary.total_monthly_kwh);
    const dailyAvg = summary.total_monthly_kwh / 30;
    document.getElementById('metricDailyAvgKwh').textContent = `~${dailyAvg.toFixed(2)} kWh / day`;

    document.getElementById('metricMonthlyCost').textContent = F.formatCurrency(summary.total_estimated_bill, symbol);
    document.getElementById('metricCostSubtext').textContent = `Calculated at ${F.formatCurrency(rate, symbol)}/kWh`;

    // 7. Budget Status Card and Alert Banner
    renderBudgetCardAndAlert(summary, symbol);

    // 8. Top Consumer Card
    renderTopConsumerCard(summary, symbol);

    // 9. Room-wise Breakdown Table
    renderRoomTable(summary, symbol);

    // 10. Educational Contextual Tip
    renderEducationalTip(summary, symbol);

    // 11. Chart.js Visualizations
    renderCharts(summary);
  }

  /**
   * Conversational Editorial Hero
   */
  function renderConversationalHero(summary, symbol) {
    const F = window.EnergyFormatters;
    const heroHeadline = document.getElementById('heroHeadline');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroBudgetTag = document.getElementById('heroBudgetTag');

    if (heroHeadline) {
      const roundedBill = Math.round(summary.total_estimated_bill);
      let currencyWord = 'rupees';
      if (symbol === '$') currencyWord = 'dollars';
      else if (symbol === '€') currencyWord = 'euros';
      else if (symbol === '£') currencyWord = 'pounds';
      heroHeadline.textContent = `Your home is on track for ${roundedBill.toLocaleString()} ${currencyWord} this month`;
    }

    if (heroSubtitle) {
      const budget = Number(summary.monthly_budget) || 0;
      let budgetText = '';
      if (budget > 0) {
        const utilization = summary.budget_percentage !== undefined ? summary.budget_percentage : summary.budget_utilization;
        if (summary.budget_status === 'OVER_BUDGET') {
          budgetText = ` Your estimated bill exceeds your target budget of ${F.formatCurrency(budget, symbol)}.`;
        } else if (summary.budget_status === 'APPROACHING_BUDGET') {
          budgetText = ` You are utilizing ${(utilization || 0).toFixed(0)}% of your monthly budget.`;
        } else {
          budgetText = ` You're within your ${F.formatCurrency(budget, symbol)} budget.`;
        }
      }
      heroSubtitle.innerHTML = `Based on your daily usage across all rooms.${budgetText ? ` <strong>${budgetText}</strong>` : " You're on track with your projected schedule."}`;
    }

    if (heroBudgetTag) {
      const budget = Number(summary.monthly_budget) || 0;
      if (budget > 0) {
        heroBudgetTag.style.display = 'inline-flex';
        if (summary.budget_status === 'OVER_BUDGET') {
          heroBudgetTag.className = 'budget-status-pill status-over';
          heroBudgetTag.textContent = `Over Budget by ${F.formatCurrency(Math.abs(summary.budget_variance || summary.budget_difference), symbol)}`;
        } else if (summary.budget_status === 'APPROACHING_BUDGET') {
          heroBudgetTag.className = 'budget-status-pill status-approaching';
          heroBudgetTag.textContent = `Approaching Budget (${(summary.budget_percentage || 0).toFixed(0)}% used)`;
        } else {
          heroBudgetTag.className = 'budget-status-pill status-healthy';
          heroBudgetTag.textContent = `On Budget (${F.formatCurrency(summary.budget_variance || summary.budget_difference, symbol)} remaining)`;
        }
      } else {
        heroBudgetTag.style.display = 'none';
      }
    }
  }

  /**
   * Continuous Segmented Room Breakdown Progress Track & Legend
   */
  function renderRoomBreakdownTrackAndLegend(summary) {
    const F = window.EnergyFormatters;
    const track = document.getElementById('roomBreakdownTrack');
    const legend = document.getElementById('roomLegend');
    if (!track || !legend) return;

    track.innerHTML = '';
    legend.innerHTML = '';

    const rooms = summary.room_breakdown || [];
    const totalKwh = summary.total_monthly_kwh || 1;

    rooms.forEach((r, idx) => {
      const pct = r.percentage !== undefined ? Number(r.percentage) : ((r.monthly_kwh / totalKwh) * 100);
      const color = getRoomColor(r.room, idx);

      // Track segment
      const seg = document.createElement('div');
      seg.className = 'room-progress-segment';
      seg.style.width = `${Math.max(pct, 2)}%`;
      seg.style.backgroundColor = color;
      seg.title = `${r.room}: ${pct.toFixed(1)}% (${F.formatKwh(r.monthly_kwh)})`;
      seg.dataset.room = (r.room || '').toLowerCase();
      seg.addEventListener('click', () => filterApplianceGrid(r.room));
      track.appendChild(seg);

      // Legend item
      const legItem = document.createElement('div');
      legItem.className = 'room-legend-item';
      legItem.dataset.room = (r.room || '').toLowerCase();
      legItem.innerHTML = `
        <span class="room-legend-dot" style="background-color: ${color};"></span>
        <span>${F.escapeHtml(r.room)} (${Math.round(pct)}%)</span>
      `;
      legItem.addEventListener('click', () => filterApplianceGrid(r.room));
      legend.appendChild(legItem);
    });
  }

  /**
   * Room Filter Pills
   */
  function renderRoomFilterPills(summary) {
    const filterContainer = document.getElementById('roomFilterPills');
    if (!filterContainer) return;

    filterContainer.innerHTML = '';

    // "All Rooms" Pill
    const allPill = document.createElement('button');
    allPill.type = 'button';
    allPill.className = `room-filter-pill ${activeRoomFilter === 'all' ? 'is-active' : ''}`;
    allPill.dataset.room = 'all';
    allPill.setAttribute('role', 'tab');
    allPill.setAttribute('aria-selected', activeRoomFilter === 'all' ? 'true' : 'false');
    allPill.textContent = 'All Rooms';
    allPill.addEventListener('click', () => filterApplianceGrid('all'));
    filterContainer.appendChild(allPill);

    const rooms = summary.room_breakdown || [];
    rooms.forEach((r) => {
      const roomKey = (r.room || '').toLowerCase();
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `room-filter-pill ${activeRoomFilter === roomKey ? 'is-active' : ''}`;
      pill.dataset.room = roomKey;
      pill.setAttribute('role', 'tab');
      pill.setAttribute('aria-selected', activeRoomFilter === roomKey ? 'true' : 'false');
      pill.textContent = r.room;
      pill.addEventListener('click', () => filterApplianceGrid(r.room));
      filterContainer.appendChild(pill);
    });

    // "+ Add Appliance" / "Appliances" action pill
    const actionPill = document.createElement('a');
    actionPill.href = 'appliances.html';
    actionPill.className = 'room-filter-pill is-action';
    actionPill.textContent = '+ Add Appliance';
    filterContainer.appendChild(actionPill);
  }

  /**
   * Filter Appliance Grid by Room
   */
  function filterApplianceGrid(targetRoom) {
    const roomKey = (targetRoom || 'all').toLowerCase();
    activeRoomFilter = roomKey;

    const filterContainer = document.getElementById('roomFilterPills');
    if (filterContainer) {
      const pills = filterContainer.querySelectorAll('.room-filter-pill');
      pills.forEach((p) => {
        if (p.dataset.room === roomKey) {
          p.classList.add('is-active');
          p.setAttribute('aria-selected', 'true');
        } else {
          p.classList.remove('is-active');
          p.setAttribute('aria-selected', 'false');
        }
      });
    }

    const rate = currentSummaryData ? Number(currentSummaryData.tariff_rate) || 8.0 : 8.0;
    const symbol = currentSummaryData ? currentSummaryData.currency_symbol || '₹' : '₹';

    if (roomKey === 'all') {
      renderApplianceGrid(currentAppliancesList, rate, symbol);
    } else {
      const filtered = currentAppliancesList.filter(
        (a) => (a.room || '').toLowerCase() === roomKey
      );
      renderApplianceGrid(filtered, rate, symbol);
    }
  }

  /**
   * Illustrated Appliance Grid Rendering (6-across layout matching reference screenshot)
   */
  function renderApplianceGrid(items, rate, symbol) {
    const F = window.EnergyFormatters;
    const grid = document.getElementById('dashboardApplianceGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!items || items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 32px 16px; text-align: center; color: var(--color-lead); background: var(--color-surface); border-radius: var(--radius-card); border: 1px dashed var(--color-border);">
          <p style="margin-bottom: 8px;">No appliances found for this room.</p>
          <a href="appliances.html" class="btn btn-secondary btn-sm">+ Add Appliance to this room</a>
        </div>
      `;
      return;
    }

    items.forEach((app) => {
      const card = document.createElement('div');
      card.className = 'appliance-card';
      card.dataset.applianceId = app.id;
      card.dataset.room = (app.room || 'Other').toLowerCase();

      const svg = window.EnergyIllustrations ? window.EnergyIllustrations.getApplianceSvg(app.name, app.room || app.category) : '';
      const dailyHours = Number(app.daily_hours) || 0;
      const ratedWatts = Number(app.rated_watts) || 0;
      const quantity = Number(app.quantity) || 1;
      const totalWatts = ratedWatts * quantity;
      const dailyKwh = (totalWatts * dailyHours) / 1000;
      const dailyCost = dailyKwh * rate;

      card.innerHTML = `
        <div class="appliance-quick-action">
          <a href="appliances.html" class="btn btn-sm btn-secondary" style="padding: 2px 8px; font-size: 11px;" title="Edit in inventory">Edit</a>
        </div>
        <div class="appliance-illustration-wrap">
          ${svg}
        </div>
        <h3 class="appliance-name" title="${F.escapeHtml(app.name)}">${F.escapeHtml(app.name)}</h3>
        <div class="appliance-wattage">${totalWatts}W${quantity > 1 ? ` (${quantity}×${ratedWatts}W)` : ''}</div>
        <div class="appliance-slider-row">
          <input type="range" class="appliance-slider" min="0" max="24" step="0.5" value="${dailyHours}" aria-label="${F.escapeHtml(app.name)} daily hours">
          <span class="appliance-slider-label font-mono">${dailyHours} hrs/day</span>
        </div>
        <div class="appliance-cost-footer font-mono">${F.formatCurrency(dailyCost, symbol)} est. daily</div>
      `;

      // Tactile Range Slider Interaction with Zero-Latency Visual Preview
      const slider = card.querySelector('.appliance-slider');
      const sliderLabel = card.querySelector('.appliance-slider-label');
      const costFooter = card.querySelector('.appliance-cost-footer');

      const updateSliderTrack = (val) => {
        const pct = (val / 24) * 100;
        slider.style.background = `linear-gradient(to right, var(--color-botanical) 0%, var(--color-botanical) ${pct}%, var(--color-stone) ${pct}%, var(--color-stone) 100%)`;
      };
      updateSliderTrack(dailyHours);

      slider.addEventListener('input', function (e) {
        const newHours = parseFloat(e.target.value);
        sliderLabel.textContent = `${newHours} hrs/day`;
        const newDailyKwh = (totalWatts * newHours) / 1000;
        const newDailyCost = newDailyKwh * rate;
        costFooter.textContent = `${F.formatCurrency(newDailyCost, symbol)} est. daily`;
        updateSliderTrack(newHours);
      });

      grid.appendChild(card);
    });
  }

  function renderBudgetCardAndAlert(summary, symbol) {
    const F = window.EnergyFormatters;
    const budgetAlertContainer = document.getElementById('budgetAlertBanner');
    const budgetValEl = document.getElementById('metricBudgetStatus');
    const budgetSubtextEl = document.getElementById('metricBudgetSubtext');

    const budget = Number(summary.monthly_budget) || 0;
    const variance = summary.budget_variance !== undefined ? summary.budget_variance : summary.budget_difference;
    const utilization = summary.budget_percentage !== undefined ? summary.budget_percentage : summary.budget_utilization;
    const status = summary.budget_status;

    if (status === 'OVER_BUDGET') {
      const overAmount = Math.abs(variance);
      budgetValEl.textContent = `${F.formatCurrency(overAmount, symbol)} Over`;
      budgetValEl.style.color = 'var(--color-danger)';
      budgetSubtextEl.textContent = `${utilization.toFixed(1)}% of limit`;

      if (budgetAlertContainer) {
        budgetAlertContainer.innerHTML = `
          <div class="alert alert-danger" role="alert">
            <div>
              <div class="alert-title">You're ${F.formatCurrency(overAmount, symbol)} over your budget</div>
              <div>Your estimated monthly bill of ${F.formatCurrency(summary.total_estimated_bill, symbol)} exceeds your target budget of ${F.formatCurrency(budget, symbol)} (${utilization.toFixed(1)}% utilized). Try experimenting in the Savings Planner to bring usage down.</div>
            </div>
          </div>
        `;
        budgetAlertContainer.style.display = 'block';
      }
    } else if (status === 'APPROACHING_BUDGET') {
      budgetValEl.textContent = `${F.formatCurrency(variance, symbol)} Left`;
      budgetValEl.style.color = 'var(--color-ochre)';
      budgetSubtextEl.textContent = `${utilization.toFixed(1)}% of limit (Caution)`;

      if (budgetAlertContainer) {
        budgetAlertContainer.innerHTML = `
          <div class="alert alert-warning" role="alert">
            <div>
              <div class="alert-title">Approaching monthly budget</div>
              <div>Your estimated monthly bill of ${F.formatCurrency(summary.total_estimated_bill, symbol)} is near your target budget of ${F.formatCurrency(budget, symbol)} (${utilization.toFixed(1)}% utilized).</div>
            </div>
          </div>
        `;
        budgetAlertContainer.style.display = 'block';
      }
    } else if (status === 'NORMAL') {
      budgetValEl.textContent = `${F.formatCurrency(variance, symbol)} Left`;
      budgetValEl.style.color = 'var(--color-botanical)';
      budgetSubtextEl.textContent = `${utilization.toFixed(1)}% of ${F.formatCurrency(budget, symbol)} budget`;

      if (budgetAlertContainer) {
        budgetAlertContainer.style.display = 'none';
        budgetAlertContainer.innerHTML = '';
      }
    } else {
      budgetValEl.textContent = 'No budget set';
      budgetValEl.style.color = 'var(--color-muted)';
      budgetSubtextEl.innerHTML = '<a href="settings.html">Set budget in Settings</a>';
      if (budgetAlertContainer) {
        budgetAlertContainer.style.display = 'none';
        budgetAlertContainer.innerHTML = '';
      }
    }
  }

  function renderTopConsumerCard(summary, symbol) {
    const F = window.EnergyFormatters;
    const topApp = summary.highest_consumer;
    const topNameEl = document.getElementById('metricTopConsumerName');
    const topShareEl = document.getElementById('metricTopConsumerShare');

    if (topApp && topApp.name) {
      topNameEl.textContent = topApp.name;
      const pct = topApp.percentage !== undefined ? topApp.percentage : topApp.percentage_of_total;
      topShareEl.textContent = `${F.formatKwh(topApp.monthly_kwh)} (${(Number(pct) || 0).toFixed(1)}% of home)`;
    } else {
      topNameEl.textContent = 'None';
      topShareEl.textContent = '0 kWh';
    }
  }

  function renderRoomTable(summary, symbol) {
    const F = window.EnergyFormatters;
    const roomTableBody = document.getElementById('roomBreakdownTableBody');
    if (!roomTableBody) return;

    roomTableBody.innerHTML = '';
    const rooms = summary.room_breakdown || [];
    rooms.forEach((r) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="cell-primary" style="font-weight: 500;">${F.escapeHtml(r.room)}</td>
        <td>${r.appliance_count} item${r.appliance_count > 1 ? 's' : ''}</td>
        <td class="font-mono">${F.formatKwh(r.monthly_kwh)}</td>
        <td class="font-mono">${(Number(r.percentage) || 0).toFixed(1)}%</td>
        <td class="text-right font-mono">${F.formatCurrency(r.cost, symbol)}</td>
      `;
      roomTableBody.appendChild(row);
    });
  }

  function renderEducationalTip(summary, symbol) {
    const tipContainer = document.getElementById('contextualTipContainer');
    if (!tipContainer) return;

    const topApp = summary.highest_consumer;
    const F = window.EnergyFormatters;
    const topPct = topApp ? (Number(topApp.percentage !== undefined ? topApp.percentage : topApp.percentage_of_total) || 0) : 0;

    if (topApp && topPct >= 25 && summary.total_monthly_kwh > 0) {
      const potentialSavedKwh = topApp.monthly_kwh * 0.25;
      const potentialSavedCost = potentialSavedKwh * (summary.total_estimated_bill / summary.total_monthly_kwh);

      tipContainer.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-6); background-color: var(--color-stone); border-color: var(--color-border);">
          <div class="card-body" style="padding: var(--space-4) var(--space-5);">
            <span class="badge badge-preset" style="margin-bottom: var(--space-2);">Contextual Insight</span>
            <h3 style="font-size: var(--font-size-md); margin-bottom: var(--space-1); font-family: var(--font-serif);">
              Your ${F.escapeHtml(topApp.name)} represents ${topPct.toFixed(1)}% of your estimated electricity bill.
            </h3>
            <p style="font-size: var(--font-size-sm); margin-bottom: var(--space-3); color: var(--color-lead);">
              Because heating and cooling appliances draw high continuous wattage, small habit changes yield significant savings. Reducing daily runtime by 15-30 minutes could save approximately <strong>${F.formatCurrency(potentialSavedCost, symbol)} / month</strong>.
            </p>
            <button type="button" class="btn btn-secondary btn-sm" id="tipExploreSavingsBtn">
              Explore in Savings Experiment
            </button>
          </div>
        </div>
      `;

      const tipBtn = document.getElementById('tipExploreSavingsBtn');
      if (tipBtn) {
        tipBtn.addEventListener('click', function () {
          if (typeof window.openSavingsModal === 'function') {
            window.openSavingsModal(topApp.id);
          }
        });
      }
    } else {
      tipContainer.innerHTML = `
        <div class="card" style="margin-bottom: var(--space-6); background-color: var(--color-stone); border-color: var(--color-border);">
          <div class="card-body" style="padding: var(--space-4) var(--space-5);">
            <span class="badge badge-preset" style="margin-bottom: var(--space-2);">Electricity Basics & Duty Cycles</span>
            <h3 style="font-size: var(--font-size-md); margin-bottom: var(--space-1); font-family: var(--font-serif);">
              Watts describe power. Kilowatt-hours (kWh) describe energy over time.
            </h3>
            <p style="font-size: var(--font-size-sm); margin-bottom: 0; color: var(--color-lead);">
              One unit on your electricity bill equals 1 kWh (1,000 Watts running for 1 hour). Note on cycling appliances: Thermostats cycle compressors on and off dynamically based on temperature, so a 24-hr refrigerator typically runs active compressor duty for 10–14 hours per day.
            </p>
          </div>
        </div>
      `;
    }
  }

  function renderCharts(summary) {
    if (typeof Chart === 'undefined') {
      console.warn('[DASHBOARD] Chart.js is not loaded yet');
      return;
    }

    // Chart 1: Room Distribution Donut Chart
    const roomCanvas = document.getElementById('roomChartCanvas');
    if (roomCanvas) {
      if (roomChartInstance) {
        roomChartInstance.destroy();
        roomChartInstance = null;
      }

      const rooms = summary.room_breakdown || [];
      const labels = rooms.map((r) => r.room);
      const data = rooms.map((r) => r.monthly_kwh);
      const backgroundColors = rooms.map((r, i) => getRoomColor(r.room, i));

      roomChartInstance = new Chart(roomCanvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 1.5,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 12,
                font: { family: 'Plus Jakarta Sans, sans-serif', size: 12 }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const val = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                  return ` ${context.label}: ${val.toFixed(2)} kWh (${pct}%)`;
                }
              }
            }
          },
          cutout: '62%'
        }
      });
    }

    // Chart 2: Top Appliances Bar Chart
    const barCanvas = document.getElementById('topAppliancesChartCanvas');
    if (barCanvas) {
      if (topAppliancesChartInstance) {
        topAppliancesChartInstance.destroy();
        topAppliancesChartInstance = null;
      }

      const topItems = summary.top_appliances || [];
      const labels = topItems.map((a) => a.name);
      const data = topItems.map((a) => a.monthly_kwh);

      topAppliancesChartInstance = new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly kWh',
            data: data,
            backgroundColor: '#2D5A40',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return ` ${context.raw.toFixed(2)} kWh / month`;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: '#E8E2D5' },
              ticks: { font: { family: 'JetBrains Mono, monospace', size: 11 } }
            },
            y: {
              grid: { display: false },
              ticks: { font: { family: 'Plus Jakarta Sans, sans-serif', size: 12 } }
            }
          }
        }
      });
    }
  }
})();
