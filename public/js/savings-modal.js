/**
 * EnergySaver - What-If Savings Experiment Modal Component
 * Runs savings experiments in an isolated modal sandbox without creating a 5th navigation item.
 * Can be opened from My Home or from any appliance in the Appliances table.
 */

(function () {
  'use strict';

  let currentApplianceId = null;
  let baselineAppliances = [];
  let sandboxAppliances = [];
  let modalBackdrop = null;
  let isAuthenticatedMode = false;
  let currentSettings = { electricity_rate: 8.0, monthly_budget: 3500, currency_symbol: '₹' };

  document.addEventListener('DOMContentLoaded', function () {
    buildModalDom();
    setupEventListeners();
  });

  /**
   * Dynamically constructs the Savings Experiment modal in the DOM if not already present
   */
  function buildModalDom() {
    if (document.getElementById('savingsExperimentModal')) return;

    const modalHtml = `
      <div id="savingsExperimentModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="savingsModalTitle">
        <div class="modal-dialog">
          <div class="modal-header">
            <div>
              <h2 id="savingsModalTitle">Savings Experiment (What-If Sandbox)</h2>
              <p class="metric-subtext" style="margin: 0;">Test reducing operating hours. Changes do NOT affect saved records until applied.</p>
            </div>
            <button type="button" class="modal-close-btn" data-modal-close aria-label="Close modal">&times;</button>
          </div>

          <div class="modal-body">
            <div class="alert alert-info" style="margin-bottom: var(--space-4);">
              <div>
                <strong>Educational Simulation:</strong> Modifying hours below recalculates your household consumption in real-time. Notice how high-wattage heating or cooling appliances offer the fastest payback.
              </div>
            </div>

            <div class="form-group">
              <label for="savingsApplianceSelect" class="form-label">Select Appliance to Adjust</label>
              <select id="savingsApplianceSelect" class="form-control"></select>
            </div>

            <div id="savingsApplianceDetails" style="display: none;">
              <div class="form-group">
                <label for="savingsHoursInput" class="form-label">
                  Proposed Daily Operating Hours: <span id="savingsHoursDisplay" class="font-mono cell-primary"></span>
                </label>
                <input type="range" id="savingsHoursInput" class="form-control" min="0.1" max="24.0" step="0.25" style="padding: 0;">
                <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 4px;">
                  <span>0.1 hr (6 mins)</span>
                  <span id="savingsBaselineIndicator">Baseline: 3.0 hrs</span>
                  <span>24.0 hrs</span>
                </div>
              </div>

              <!-- Side-by-side comparison -->
              <div class="comparison-grid">
                <div class="comparison-card">
                  <div class="metric-label">Current Baseline</div>
                  <div class="metric-value" id="savingsBaselineKwh">0.00 kWh</div>
                  <div class="metric-subtext" id="savingsBaselineCost">₹0.00 / month</div>
                  <div style="margin-top: var(--space-2); font-size: var(--font-size-xs); color: var(--color-text-secondary);" id="savingsBaselineHoursText"></div>
                </div>

                <div class="comparison-card proposed">
                  <div class="metric-label" style="color: var(--color-primary);">Proposed Scenario</div>
                  <div class="metric-value" id="savingsProposedKwh" style="color: var(--color-primary);">0.00 kWh</div>
                  <div class="metric-subtext" id="savingsProposedCost">₹0.00 / month</div>
                  <div style="margin-top: var(--space-2); font-size: var(--font-size-xs); color: var(--color-primary);" id="savingsProposedHoursText"></div>
                </div>
              </div>

              <!-- Difference / Savings Delta Card -->
              <div class="card" style="margin-bottom: 0; background-color: var(--color-bg-subtle);">
                <div class="card-body" style="padding: var(--space-3) var(--space-4);">
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-2);">
                    <div>
                      <span class="metric-label" style="margin: 0;">Estimated Monthly Savings</span>
                      <div id="savingsDeltaKwh" style="font-size: var(--font-size-md); font-weight: 700;">0.00 kWh saved</div>
                    </div>
                    <span id="savingsDeltaPill" class="delta-pill delta-savings">Save ₹0.00 / month</span>
                  </div>
                  <p id="savingsExplanationText" style="font-size: var(--font-size-xs); margin: var(--space-2) 0 0; color: var(--color-text-secondary);"></p>
                </div>
              </div>
            </div>

            <div id="savingsEmptyState" class="empty-state" style="display: none; padding: var(--space-4);">
              <p class="empty-state-text">No appliances available in demo inventory to simulate savings.</p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-modal-close>Cancel</button>
            <button type="button" id="applySavingsBtn" class="btn btn-primary" disabled>
              Apply Changes to Demo Data
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    modalBackdrop = document.getElementById('savingsExperimentModal');
  }

  function setupEventListeners() {
    if (!modalBackdrop) return;

    // Close buttons
    modalBackdrop.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', closeSavingsModal);
    });

    // Close on backdrop click
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeSavingsModal();
    });

    // Appliance dropdown change
    const select = document.getElementById('savingsApplianceSelect');
    if (select) {
      select.addEventListener('change', function () {
        selectAppliance(this.value);
      });
    }

    // Slider input change
    const slider = document.getElementById('savingsHoursInput');
    if (slider) {
      slider.addEventListener('input', function () {
        updateProposedHours(parseFloat(this.value));
      });
    }

    // Apply button
    const applyBtn = document.getElementById('applySavingsBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', applyScenarioChanges);
    }
  }

  /**
   * Public API to open the modal
   * @param {string|number} [preselectedId] - Optional appliance ID to focus on immediately
   */
  window.openSavingsModal = async function (preselectedId) {
    if (!modalBackdrop) buildModalDom();

    const applyBtn = document.getElementById('applySavingsBtn');
    const select = document.getElementById('savingsApplianceSelect');
    const detailsContainer = document.getElementById('savingsApplianceDetails');
    const emptyState = document.getElementById('savingsEmptyState');

    // Detect authentication state
    isAuthenticatedMode = false;
    try {
      if (window.EnergyApi) {
        const userRes = await window.EnergyApi.auth.me();
        if (userRes && userRes.success && userRes.data) {
          isAuthenticatedMode = true;
          window.currentUser = userRes.data;
        }
      }
    } catch (e) {
      isAuthenticatedMode = false;
    }

    if (isAuthenticatedMode) {
      try {
        const [appRes, setRes] = await Promise.all([
          window.EnergyApi.appliances.list(),
          window.EnergyApi.settings.get().catch(() => null)
        ]);

        baselineAppliances = (appRes && appRes.success && Array.isArray(appRes.data)) ? appRes.data : [];
        if (setRes && setRes.success && setRes.data) {
          currentSettings = setRes.data;
        }
      } catch (err) {
        console.error('Failed to load baseline appliances from API:', err);
        baselineAppliances = [];
      }

      if (applyBtn) {
        applyBtn.textContent = 'Apply Changes to Database';
      }
    } else {
      baselineAppliances = window.EnergyStorage ? window.EnergyStorage.getAppliances() : [];
      currentSettings = window.EnergyStorage ? window.EnergyStorage.getSettings() : { electricity_rate: 8.0, monthly_budget: 3500, currency_symbol: '₹' };
      if (applyBtn) {
        applyBtn.textContent = 'Apply Changes to Demo Data';
      }
    }

    // Deep clone for sandbox manipulation
    sandboxAppliances = JSON.parse(JSON.stringify(baselineAppliances));

    select.innerHTML = '';

    if (baselineAppliances.length === 0) {
      detailsContainer.style.display = 'none';
      emptyState.style.display = 'block';
      const emptyText = emptyState.querySelector('.empty-state-text');
      if (emptyText) {
        emptyText.textContent = isAuthenticatedMode
          ? 'No appliances found in your account inventory. Add appliances first to run savings experiments.'
          : 'No appliances available in demo inventory to simulate savings.';
      }
      modalBackdrop.classList.add('is-open');
      return;
    }

    emptyState.style.display = 'none';
    detailsContainer.style.display = 'block';

    // Populate dropdown
    baselineAppliances.forEach((app) => {
      const option = document.createElement('option');
      option.value = app.id;
      option.textContent = `${app.name} (${app.room} - ${app.rated_watts}W)`;
      select.appendChild(option);
    });

    const targetId = preselectedId || baselineAppliances[0].id;
    select.value = String(targetId);
    selectAppliance(targetId);

    modalBackdrop.classList.add('is-open');
  };

  function closeSavingsModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-open');
    }
  }

  function selectAppliance(id) {
    currentApplianceId = id;
    const baseApp = baselineAppliances.find((a) => String(a.id) === String(id));
    if (!baseApp) return;

    const slider = document.getElementById('savingsHoursInput');
    const baselineIndicator = document.getElementById('savingsBaselineIndicator');

    const dailyHours = typeof baseApp.daily_hours === 'number' ? baseApp.daily_hours : parseFloat(baseApp.daily_hours);
    slider.value = dailyHours;
    baselineIndicator.textContent = `Baseline: ${dailyHours.toFixed(1)} hrs`;

    updateProposedHours(dailyHours);
  }

  function updateProposedHours(newHours) {
    const baseApp = baselineAppliances.find((a) => String(a.id) === String(currentApplianceId));
    if (!baseApp) return;

    const hoursDisplay = document.getElementById('savingsHoursDisplay');
    hoursDisplay.textContent = `${newHours.toFixed(1)} hrs/day`;

    // Update sandbox copy
    const target = sandboxAppliances.find((a) => String(a.id) === String(currentApplianceId));
    if (target) {
      target.daily_hours = newHours;
    }

    // Run calculation with active settings
    const rate = currentSettings.electricity_rate || 8.0;
    const budget = currentSettings.monthly_budget || 3500;
    const symbol = currentSettings.currency_symbol || '₹';

    const deltaResult = window.EnergyCalculator.calculateScenarioDelta(
      baselineAppliances,
      sandboxAppliances,
      rate,
      budget
    );

    renderScenarioResults(baseApp, newHours, deltaResult, symbol);
  }

  function renderScenarioResults(baseApp, proposedHours, deltaResult, symbol) {
    const F = window.EnergyFormatters;
    const rate = deltaResult.baseline.rate || currentSettings.electricity_rate || 8.0;

    const baseDailyHours = typeof baseApp.daily_hours === 'number' ? baseApp.daily_hours : parseFloat(baseApp.daily_hours);

    // Baseline stats for single appliance
    const baseDailyKwh = window.EnergyCalculator.calculateDailyKwh(baseApp.rated_watts, baseApp.quantity, baseDailyHours);
    const baseMonthlyKwh = window.EnergyCalculator.calculateMonthlyKwh(baseDailyKwh, baseApp.days_used_per_month || 30);
    const baseCost = window.EnergyCalculator.calculateFlatCost(baseMonthlyKwh, rate);

    // Proposed stats for single appliance
    const propDailyKwh = window.EnergyCalculator.calculateDailyKwh(baseApp.rated_watts, baseApp.quantity, proposedHours);
    const propMonthlyKwh = window.EnergyCalculator.calculateMonthlyKwh(propDailyKwh, baseApp.days_used_per_month || 30);
    const propCost = window.EnergyCalculator.calculateFlatCost(propMonthlyKwh, rate);

    document.getElementById('savingsBaselineKwh').textContent = F.formatKwh(baseMonthlyKwh);
    document.getElementById('savingsBaselineCost').textContent = F.formatCurrency(baseCost, symbol) + ' / mo';
    document.getElementById('savingsBaselineHoursText').textContent = `Runtime: ${baseDailyHours.toFixed(1)} hrs/day (${baseApp.days_used_per_month || 30} days)`;

    document.getElementById('savingsProposedKwh').textContent = F.formatKwh(propMonthlyKwh);
    document.getElementById('savingsProposedCost').textContent = F.formatCurrency(propCost, symbol) + ' / mo';
    document.getElementById('savingsProposedHoursText').textContent = `Runtime: ${proposedHours.toFixed(1)} hrs/day (${baseApp.days_used_per_month || 30} days)`;

    // Delta differences
    const savedKwh = baseMonthlyKwh - propMonthlyKwh;
    const savedCost = baseCost - propCost;

    const deltaKwhEl = document.getElementById('savingsDeltaKwh');
    const deltaPillEl = document.getElementById('savingsDeltaPill');
    const explainEl = document.getElementById('savingsExplanationText');
    const applyBtn = document.getElementById('applySavingsBtn');

    if (savedCost > 0.001) {
      deltaKwhEl.textContent = `${savedKwh.toFixed(2)} kWh saved`;
      deltaKwhEl.style.color = 'var(--color-primary)';
      deltaPillEl.className = 'delta-pill delta-savings';
      deltaPillEl.textContent = `Save ${F.formatCurrency(savedCost, symbol)} / month`;
      explainEl.textContent = `Reducing ${baseApp.name} daily runtime by ${(baseDailyHours - proposedHours).toFixed(1)} hours cuts total household bill from ${F.formatCurrency(deltaResult.baseline.total_monthly_cost, symbol)} to ${F.formatCurrency(deltaResult.proposed.total_monthly_cost, symbol)}.`;
      applyBtn.disabled = false;
    } else if (savedCost < -0.001) {
      const addedKwh = Math.abs(savedKwh);
      const addedCost = Math.abs(savedCost);
      deltaKwhEl.textContent = `${addedKwh.toFixed(2)} kWh increased`;
      deltaKwhEl.style.color = 'var(--color-danger-text)';
      deltaPillEl.className = 'delta-pill delta-excess';
      deltaPillEl.textContent = `+${F.formatCurrency(addedCost, symbol)} / month`;
      explainEl.textContent = `Increasing operating hours raises your estimated monthly bill.`;
      applyBtn.disabled = false;
    } else {
      deltaKwhEl.textContent = '0.00 kWh (No change)';
      deltaKwhEl.style.color = 'var(--color-text-secondary)';
      deltaPillEl.className = 'delta-pill';
      deltaPillEl.textContent = 'No change';
      explainEl.textContent = 'Adjust the slider to simulate reducing daily operating hours.';
      applyBtn.disabled = true;
    }
  }

  async function applyScenarioChanges() {
    const target = sandboxAppliances.find((a) => String(a.id) === String(currentApplianceId));
    if (!target) return;

    const applyBtn = document.getElementById('applySavingsBtn');

    if (isAuthenticatedMode) {
      if (confirm(`Apply proposed runtime (${target.daily_hours.toFixed(1)} hrs/day) for ${target.name} to your database records?`)) {
        if (applyBtn) {
          applyBtn.disabled = true;
          applyBtn.textContent = 'Applying...';
        }

        try {
          await window.EnergyApi.savings.apply([{
            appliance_id: target.id,
            daily_hours: target.daily_hours
          }]);

          if (window.showToast) {
            window.showToast(`Updated ${target.name} runtime in database`);
          }
          closeSavingsModal();

          // Refresh page or listeners
          window.dispatchEvent(new CustomEvent('energysaver:data-updated'));
          if (typeof window.onDataUpdated === 'function') {
            window.onDataUpdated();
          }
          if (typeof window.onDemoDataUpdated === 'function') {
            window.onDemoDataUpdated();
          }
        } catch (err) {
          console.error('Failed to apply savings scenario to API:', err);
          alert('Failed to apply savings: ' + (err.message || 'Unknown error'));
        } finally {
          if (applyBtn) {
            applyBtn.disabled = false;
            applyBtn.textContent = 'Apply Changes to Database';
          }
        }
      }
    } else {
      if (confirm(`Apply proposed runtime (${target.daily_hours.toFixed(1)} hrs/day) to your demo appliance records?`)) {
        window.EnergyStorage.saveAppliance(target);
        if (window.showToast) {
          window.showToast(`Updated ${target.name} runtime in demo data`);
        }
        closeSavingsModal();

        // Trigger page refresh or custom event
        window.dispatchEvent(new CustomEvent('energysaver:data-updated'));
        if (typeof window.onDemoDataUpdated === 'function') {
          window.onDemoDataUpdated();
        } else if (typeof window.onDataUpdated === 'function') {
          window.onDataUpdated();
        } else {
          window.location.reload();
        }
      }
    }
  }
})();
