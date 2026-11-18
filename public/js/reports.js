/**
 * EnergySaver - Reports, Snapshots & Actual Bill Reconciliation Logic
 * Connects to live MySQL / Express REST API for authenticated users,
 * while preserving local storage fallback for standalone demo visitors.
 */

(function () {
  'use strict';

  let isAuthenticatedMode = false;
  let currentSettings = { electricity_rate: 8.0, currency_symbol: '₹' };
  let currentSnapshots = [];
  let currentActualBills = [];

  document.addEventListener('DOMContentLoaded', async function () {
    setupEventListeners();
    await initializeReportsState();

    window.addEventListener('energysaver:data-updated', async function () {
      await loadReportsData();
    });
  });

  /**
   * Determine session state and load settings
   */
  async function initializeReportsState() {
    clearErrorBanner();
    try {
      if (window.EnergyApi) {
        const userRes = await window.EnergyApi.auth.me();
        if (userRes && userRes.success && userRes.data) {
          isAuthenticatedMode = true;
          window.currentUser = userRes.data;

          try {
            const sRes = await window.EnergyApi.settings.get();
            if (sRes && sRes.success && sRes.data) {
              currentSettings = sRes.data;
            }
          } catch (e) {
            console.warn('Could not fetch user settings, using defaults:', e);
          }
        }
      }
    } catch (e) {
      if (e.status === 401) {
        isAuthenticatedMode = false;
      } else {
        renderErrorBanner('Could not connect to the backend server. Displaying offline demo state.');
      }
    }

    renderModeBadge();
    await loadReportsData();
  }

  function renderModeBadge() {
    const badge = document.getElementById('reportsModeBadge');
    if (badge) {
      if (isAuthenticatedMode) {
        badge.textContent = 'Database Mode (Saved in MySQL)';
        badge.className = 'badge badge-preset';
      } else {
        badge.textContent = 'Demo Storage Mode (Browser LocalStorage)';
        badge.className = 'badge';
      }
    }
  }

  function renderErrorBanner(message) {
    const container = document.getElementById('reportsErrorContainer');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-warning" role="alert" style="display: flex; justify-content: space-between; align-items: center;">
          <span><strong>Connection Notice:</strong> ${window.EnergyFormatters ? window.EnergyFormatters.escapeHtml(message) : message}</span>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.reload()">Retry</button>
        </div>
      `;
      container.style.display = 'block';
    }
  }

  function clearErrorBanner() {
    const container = document.getElementById('reportsErrorContainer');
    if (container) {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  }

  /**
   * Load snapshots and actual bills from API or demo storage
   */
  async function loadReportsData() {
    if (isAuthenticatedMode) {
      try {
        const [snapRes, billRes] = await Promise.all([
          window.EnergyApi.reports.listSnapshots(),
          window.EnergyApi.reports.listActualBills()
        ]);

        currentSnapshots = (snapRes && snapRes.success && Array.isArray(snapRes.data)) ? snapRes.data : [];
        currentActualBills = (billRes && billRes.success && Array.isArray(billRes.data)) ? billRes.data : [];
      } catch (err) {
        console.error('Failed to load reports from MySQL API:', err);
        renderErrorBanner('Failed to load reports from database: ' + (err.message || 'Unknown error'));
        currentSnapshots = [];
        currentActualBills = [];
      }
    } else {
      currentSettings = window.EnergyStorage.getSettings();
      currentSnapshots = window.EnergyStorage.getSnapshots();
      currentActualBills = window.EnergyStorage.getActualBills();
    }

    renderSnapshots();
    renderActualBills();
    populateReconcileDropdowns();
  }

  function setupEventListeners() {
    // Snapshot save button
    const saveSnapshotBtn = document.getElementById('saveSnapshotBtn');
    if (saveSnapshotBtn) {
      saveSnapshotBtn.addEventListener('click', handleSaveSnapshot);
    }

    // CSV export button
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', handleExportCsv);
    }

    // Print button
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
      printReportBtn.addEventListener('click', function () {
        window.print();
      });
    }

    // Actual bill modal
    const logBillBtn = document.getElementById('openLogBillModalBtn');
    if (logBillBtn) {
      logBillBtn.addEventListener('click', openActualBillModal);
    }

    const billForm = document.getElementById('actualBillForm');
    if (billForm) {
      billForm.addEventListener('submit', handleLogActualBill);
    }

    // Reconcile button
    const reconcileBtn = document.getElementById('reconcileTriggerBtn');
    if (reconcileBtn) {
      reconcileBtn.addEventListener('click', handleReconcile);
    }

    // Modal close listeners
    document.querySelectorAll('[data-report-modal-close]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const modal = this.closest('.modal-backdrop');
        if (modal) modal.classList.remove('is-open');
      });
    });

    // Event delegation on snapshots table
    const snapTbody = document.getElementById('snapshotsTableBody');
    if (snapTbody) {
      snapTbody.addEventListener('click', function (e) {
        const btn = e.target.closest('button[data-action="inspect"]');
        if (btn) {
          const id = btn.getAttribute('data-id');
          if (id) viewSnapshotDetails(id);
        }
      });
    }

    // Event delegation on actual bills table
    const billTbody = document.getElementById('actualBillsTableBody');
    if (billTbody) {
      billTbody.addEventListener('click', function (e) {
        const btn = e.target.closest('button[data-action="delete-bill"]');
        if (btn) {
          const id = btn.getAttribute('data-id');
          if (id) deleteActualBill(id);
        }
      });
    }
  }

  // --- 1. Snapshot Management ---
  function renderSnapshots() {
    const tbody = document.getElementById('snapshotsTableBody');
    const emptyState = document.getElementById('snapshotsEmptyState');
    const F = window.EnergyFormatters;
    const symbol = currentSettings.currency_symbol || '₹';

    if (!tbody) return;
    tbody.innerHTML = '';

    if (!currentSnapshots || currentSnapshots.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    currentSnapshots.forEach((snap) => {
      const row = document.createElement('tr');
      const safeId = F.escapeHtml(String(snap.id));
      const totalKwh = typeof snap.total_kwh === 'number' ? snap.total_kwh : parseFloat(snap.total_kwh || 0);
      const totalCost = typeof snap.total_cost === 'number' ? snap.total_cost : parseFloat(snap.total_cost || 0);

      row.innerHTML = `
        <td class="cell-primary">${F.escapeHtml(snap.period_name)}</td>
        <td class="font-mono">${F.escapeHtml(String(snap.period_start))} to ${F.escapeHtml(String(snap.period_end))}</td>
        <td class="font-mono">${F.formatKwh(totalKwh)}</td>
        <td class="font-mono">${F.formatCurrency(totalCost, symbol)}</td>
        <td><span class="badge badge-preset">Frozen Immutable</span></td>
        <td class="text-right no-print">
          <button type="button" class="btn btn-secondary btn-sm" data-action="inspect" data-id="${safeId}">
            Inspect Items
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  async function handleSaveSnapshot() {
    const periodName = prompt('Enter a label for this estimate snapshot:', 'Current Month Estimate');
    if (!periodName || !periodName.trim()) return;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const startDate = `${yyyy}-${mm}-01`;
    // Last day of current month
    const lastDay = new Date(yyyy, today.getMonth() + 1, 0).getDate();
    const endDate = `${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`;

    if (isAuthenticatedMode) {
      const saveBtn = document.getElementById('saveSnapshotBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
      }

      try {
        await window.EnergyApi.reports.saveSnapshot({
          period_name: periodName.trim(),
          period_start: startDate,
          period_end: endDate
        });

        if (window.showToast) {
          window.showToast('Monthly estimate snapshot saved to database');
        }
        await loadReportsData();
      } catch (err) {
        console.error('Failed to save snapshot to database:', err);
        alert('Failed to save snapshot: ' + (err.message || 'Unknown error'));
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Current Snapshot';
        }
      }
    } else {
      const appliances = window.EnergyStorage.getAppliances();
      if (appliances.length === 0) {
        alert('Cannot save an empty estimate. Please add appliances first.');
        return;
      }

      const settings = window.EnergyStorage.getSettings();
      const rate = settings.electricity_rate || 8.0;
      const budget = settings.monthly_budget || 3500.0;
      const totals = window.EnergyCalculator.calculateHouseholdTotals(appliances, rate, budget);

      const snapshotItems = appliances.map((app) => {
        const computed = window.EnergyCalculator.computeApplianceMetrics(app, rate);
        return {
          appliance_name: app.name,
          room: app.room,
          category: app.category,
          rated_watts: app.rated_watts,
          quantity: app.quantity,
          daily_hours: app.daily_hours,
          days_used: app.days_used_per_month || 30,
          monthly_kwh: computed.monthly_kwh,
          monthly_cost: computed.monthly_cost
        };
      });

      const snapshot = {
        period_name: periodName.trim(),
        period_start: startDate,
        period_end: endDate,
        total_kwh: totals.total_monthly_kwh,
        total_cost: totals.total_monthly_cost,
        tariff_rate_used: rate,
        budget_used: budget,
        items: snapshotItems
      };

      window.EnergyStorage.saveSnapshot(snapshot);
      if (window.showToast) {
        window.showToast('Monthly estimate snapshot preserved in demo history');
      }
      await loadReportsData();
    }
  }

  async function viewSnapshotDetails(snapshotId) {
    let snap = null;

    if (isAuthenticatedMode) {
      try {
        const res = await window.EnergyApi.reports.getSnapshot(snapshotId);
        if (res && res.success && res.data) {
          snap = res.data;
        }
      } catch (err) {
        console.error('Failed to fetch snapshot details from API:', err);
        alert('Could not load snapshot details: ' + (err.message || 'Unknown error'));
        return;
      }
    } else {
      snap = currentSnapshots.find((s) => String(s.id) === String(snapshotId));
    }

    if (!snap) return;

    const modal = document.getElementById('snapshotInspectionModal');
    const title = document.getElementById('inspectionModalTitle');
    const meta = document.getElementById('inspectionModalMeta');
    const tbody = document.getElementById('inspectionTableBody');
    const F = window.EnergyFormatters;
    const symbol = currentSettings.currency_symbol || '₹';

    const rateUsed = snap.tariff_rate_used || currentSettings.electricity_rate || 8.0;
    const totalKwh = typeof snap.total_kwh === 'number' ? snap.total_kwh : parseFloat(snap.total_kwh || 0);
    const totalCost = typeof snap.total_cost === 'number' ? snap.total_cost : parseFloat(snap.total_cost || 0);

    if (title) title.textContent = snap.period_name;
    if (meta) meta.textContent = `Period: ${snap.period_start} to ${snap.period_end} • Rate Used: ${F.formatCurrency(rateUsed, symbol)}/kWh • Total: ${F.formatKwh(totalKwh)} (${F.formatCurrency(totalCost, symbol)})`;

    if (tbody) {
      tbody.innerHTML = '';
      (snap.items || []).forEach((item) => {
        const row = document.createElement('tr');
        const itemKwh = typeof item.monthly_kwh === 'number' ? item.monthly_kwh : parseFloat(item.monthly_kwh || 0);
        const itemCost = typeof item.monthly_cost === 'number' ? item.monthly_cost : parseFloat(item.monthly_cost || 0);
        const dailyHours = typeof item.daily_hours === 'number' ? item.daily_hours.toFixed(1) : parseFloat(item.daily_hours || 0).toFixed(1);

        row.innerHTML = `
          <td class="cell-primary">${F.escapeHtml(item.appliance_name)}</td>
          <td>${F.escapeHtml(item.room)}</td>
          <td class="font-mono">${item.rated_watts}W &bull; Qty: ${item.quantity}</td>
          <td class="font-mono">${dailyHours}h/d (${item.days_used}d)</td>
          <td class="font-mono">${F.formatKwh(itemKwh)}</td>
          <td class="font-mono text-right">${F.formatCurrency(itemCost, symbol)}</td>
        `;
        tbody.appendChild(row);
      });
    }

    if (modal) modal.classList.add('is-open');
  }

  // --- 2. Actual Utility Bills ---
  function renderActualBills() {
    const tbody = document.getElementById('actualBillsTableBody');
    const emptyState = document.getElementById('actualBillsEmptyState');
    const F = window.EnergyFormatters;
    const symbol = currentSettings.currency_symbol || '₹';

    if (!tbody) return;
    tbody.innerHTML = '';

    if (!currentActualBills || currentActualBills.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    currentActualBills.forEach((b) => {
      const row = document.createElement('tr');
      const safeId = F.escapeHtml(String(b.id));
      const billedKwh = typeof b.billed_kwh === 'number' ? b.billed_kwh : parseFloat(b.billed_kwh || 0);
      const billedAmount = typeof b.billed_amount === 'number' ? b.billed_amount : parseFloat(b.billed_amount || 0);

      row.innerHTML = `
        <td class="font-mono cell-primary">${F.escapeHtml(String(b.billing_start_date))} to ${F.escapeHtml(String(b.billing_end_date))}</td>
        <td class="font-mono">${F.formatKwh(billedKwh)}</td>
        <td class="font-mono">${F.formatCurrency(billedAmount, symbol)}</td>
        <td>${F.escapeHtml(b.provider_name || 'Utility Provider')}</td>
        <td style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${F.escapeHtml(b.notes || '—')}</td>
        <td class="text-right no-print">
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-bill" data-id="${safeId}">
            Delete
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  function openActualBillModal() {
    const modal = document.getElementById('actualBillModal');
    if (modal) modal.classList.add('is-open');
  }

  async function handleLogActualBill(e) {
    e.preventDefault();

    const startDate = document.getElementById('billStartDateInput').value;
    const endDate = document.getElementById('billEndDateInput').value;
    const kwh = parseFloat(document.getElementById('billKwhInput').value);
    const amount = parseFloat(document.getElementById('billAmountInput').value);
    const provider = document.getElementById('billProviderInput').value.trim();
    const notes = document.getElementById('billNotesInput').value.trim();

    if (!startDate || !endDate || isNaN(kwh) || isNaN(amount)) {
      alert('Please fill all required bill fields');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('Billing end date cannot be earlier than start date');
      return;
    }

    const payload = {
      billing_start_date: startDate,
      billing_end_date: endDate,
      billed_kwh: kwh,
      billed_amount: amount,
      provider_name: provider || 'Electricity Board',
      notes: notes
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
    }

    try {
      if (isAuthenticatedMode) {
        await window.EnergyApi.reports.logActualBill(payload);
        if (window.showToast) {
          window.showToast('Actual utility bill logged in database');
        }
      } else {
        window.EnergyStorage.saveActualBill(payload);
        if (window.showToast) {
          window.showToast('Actual utility bill logged in demo data');
        }
      }

      const modal = document.getElementById('actualBillModal');
      if (modal) modal.classList.remove('is-open');
      document.getElementById('actualBillForm').reset();
      await loadReportsData();
    } catch (err) {
      console.error('Failed to log actual bill:', err);
      alert('Failed to log actual bill: ' + (err.message || 'Unknown error'));
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Actual Bill';
      }
    }
  }

  async function deleteActualBill(id) {
    if (!confirm('Delete this actual bill entry?')) return;

    try {
      if (isAuthenticatedMode) {
        await window.EnergyApi.reports.deleteActualBill(id);
        if (window.showToast) {
          window.showToast('Actual bill removed from database');
        }
      } else {
        window.EnergyStorage.deleteActualBill(id);
        if (window.showToast) {
          window.showToast('Actual bill removed');
        }
      }
      await loadReportsData();
    } catch (err) {
      console.error('Failed to delete actual bill:', err);
      alert('Failed to delete actual bill: ' + (err.message || 'Unknown error'));
    }
  }

  // --- 3. Reconciliation Between Snapshot & Actual Bill ---
  function populateReconcileDropdowns() {
    const snapshotSelect = document.getElementById('reconcileSnapshotSelect');
    const billSelect = document.getElementById('reconcileBillSelect');

    if (!snapshotSelect || !billSelect) return;

    snapshotSelect.innerHTML = '';
    billSelect.innerHTML = '';

    if (!currentSnapshots || currentSnapshots.length === 0 || !currentActualBills || currentActualBills.length === 0) {
      snapshotSelect.innerHTML = '<option value="">No snapshots available</option>';
      billSelect.innerHTML = '<option value="">No actual bills available</option>';
      return;
    }

    currentSnapshots.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.period_name} (${s.period_start} to ${s.period_end})`;
      snapshotSelect.appendChild(opt);
    });

    currentActualBills.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b.id;
      const billedKwh = typeof b.billed_kwh === 'number' ? b.billed_kwh : parseFloat(b.billed_kwh || 0);
      opt.textContent = `Actual: ${b.billing_start_date} to ${b.billing_end_date} (${billedKwh} kWh)`;
      billSelect.appendChild(opt);
    });
  }

  async function handleReconcile() {
    const snapId = document.getElementById('reconcileSnapshotSelect').value;
    const billId = document.getElementById('reconcileBillSelect').value;

    const resultContainer = document.getElementById('reconcileResultContainer');
    if (!resultContainer) return;

    if (!snapId || !billId) {
      resultContainer.style.display = 'none';
      return;
    }

    const F = window.EnergyFormatters;
    const symbol = currentSettings.currency_symbol || '₹';

    if (isAuthenticatedMode) {
      try {
        const res = await window.EnergyApi.reports.reconcile(snapId, billId);
        if (res && res.success && res.data) {
          const snap = currentSnapshots.find((s) => String(s.id) === String(snapId)) || {};
          const bill = currentActualBills.find((b) => String(b.id) === String(billId)) || {};
          const d = res.data;
          const normalizedSnap = {
            total_kwh: d.estimate ? d.estimate.kwh : (snap.total_kwh || 0),
            total_cost: d.estimate ? d.estimate.cost : (snap.total_cost || 0),
            period_start: snap.period_start || (d.period ? d.period.split(' to ')[0] : ''),
            period_end: snap.period_end || (d.period ? d.period.split(' to ')[1] : '')
          };
          const normalizedBill = {
            billed_kwh: d.actual ? d.actual.kwh : (bill.billed_kwh || 0),
            billed_amount: d.actual ? d.actual.cost : (bill.billed_amount || 0),
            billing_start_date: bill.billing_start_date || '',
            billing_end_date: bill.billing_end_date || ''
          };
          const reconciliation = {
            date_match: d.dates_match !== undefined ? d.dates_match : (d.date_match !== undefined ? d.date_match : true),
            variance_kwh: d.variance ? d.variance.kwh_difference : (d.variance_kwh || 0),
            variance_cost: d.variance ? d.variance.cost_difference : (d.variance_cost || 0),
            pct_variance_kwh: d.variance ? d.variance.kwh_percentage : (d.pct_variance_kwh || 0),
            pct_variance_cost: d.variance ? d.variance.cost_percentage : (d.pct_variance_cost || 0)
          };
          renderReconciliationView(normalizedSnap, normalizedBill, reconciliation, symbol);
          resultContainer.style.display = 'block';
        }
      } catch (err) {
        console.error('Failed to run reconciliation via API:', err);
        alert('Reconciliation error: ' + (err.message || 'Unknown error'));
      }
    } else {
      const snap = currentSnapshots.find((s) => String(s.id) === String(snapId));
      const bill = currentActualBills.find((b) => String(b.id) === String(billId));

      if (!snap || !bill) {
        resultContainer.style.display = 'none';
        return;
      }

      const totalKwh = typeof snap.total_kwh === 'number' ? snap.total_kwh : parseFloat(snap.total_kwh || 0);
      const totalCost = typeof snap.total_cost === 'number' ? snap.total_cost : parseFloat(snap.total_cost || 0);
      const billedKwh = typeof bill.billed_kwh === 'number' ? bill.billed_kwh : parseFloat(bill.billed_kwh || 0);
      const billedAmount = typeof bill.billed_amount === 'number' ? bill.billed_amount : parseFloat(bill.billed_amount || 0);

      const kwhDiff = billedKwh - totalKwh;
      const kwhPct = totalKwh > 0 ? (kwhDiff / totalKwh) * 100 : 0;
      const costDiff = billedAmount - totalCost;
      const costPct = totalCost > 0 ? (costDiff / totalCost) * 100 : 0;
      const datesMatch = (snap.period_start === bill.billing_start_date && snap.period_end === bill.billing_end_date);

      const reconciliation = {
        date_match: datesMatch,
        variance_kwh: kwhDiff,
        variance_cost: costDiff,
        pct_variance_kwh: kwhPct,
        pct_variance_cost: costPct
      };

      const normalizedSnap = { total_kwh: totalKwh, total_cost: totalCost, period_start: snap.period_start, period_end: snap.period_end };
      const normalizedBill = { billed_kwh: billedKwh, billed_amount: billedAmount, billing_start_date: bill.billing_start_date, billing_end_date: bill.billing_end_date };

      renderReconciliationView(normalizedSnap, normalizedBill, reconciliation, symbol);
      resultContainer.style.display = 'block';
    }
  }

  function renderReconciliationView(snapshot, bill, reconciliation, symbol) {
    const F = window.EnergyFormatters;
    const dateWarningEl = document.getElementById('reconcileDateWarning');

    if (dateWarningEl) {
      if (!reconciliation.date_match) {
        dateWarningEl.innerHTML = `
          <div class="alert alert-warning" style="margin-bottom: var(--space-3);">
            <strong>Notice: Date Mismatch:</strong> Estimate period (${snapshot.period_start} to ${snapshot.period_end}) does not exactly align with actual bill period (${bill.billing_start_date} to ${bill.billing_end_date}). Variance may reflect differing month lengths.
          </div>
        `;
        dateWarningEl.style.display = 'block';
      } else {
        dateWarningEl.style.display = 'none';
      }
    }

    const snapKwh = typeof snapshot.total_kwh === 'number' ? snapshot.total_kwh : parseFloat(snapshot.total_kwh || 0);
    const snapCost = typeof snapshot.total_cost === 'number' ? snapshot.total_cost : parseFloat(snapshot.total_cost || 0);
    const billKwh = typeof bill.billed_kwh === 'number' ? bill.billed_kwh : parseFloat(bill.billed_kwh || 0);
    const billCost = typeof bill.billed_amount === 'number' ? bill.billed_amount : parseFloat(bill.billed_amount || 0);

    document.getElementById('reconcileEstimateKwh').textContent = F.formatKwh(snapKwh);
    document.getElementById('reconcileEstimateCost').textContent = F.formatCurrency(snapCost, symbol);

    document.getElementById('reconcileActualKwh').textContent = F.formatKwh(billKwh);
    document.getElementById('reconcileActualCost').textContent = F.formatCurrency(billCost, symbol);

    const diffKwhEl = document.getElementById('reconcileDiffKwh');
    const diffCostEl = document.getElementById('reconcileDiffCost');

    const kwhDiff = reconciliation.variance_kwh;
    const kwhPct = reconciliation.pct_variance_kwh;
    const costDiff = reconciliation.variance_cost;
    const costPct = reconciliation.pct_variance_cost;

    if (kwhDiff > 0) {
      diffKwhEl.textContent = `+${kwhDiff.toFixed(2)} kWh (+${kwhPct.toFixed(1)}%) Higher`;
      diffKwhEl.className = 'metric-value font-mono delta-excess';
    } else {
      diffKwhEl.textContent = `${kwhDiff.toFixed(2)} kWh (${kwhPct.toFixed(1)}%) Lower`;
      diffKwhEl.className = 'metric-value font-mono delta-savings';
    }

    if (costDiff > 0) {
      diffCostEl.textContent = `+${F.formatCurrency(costDiff, symbol)} (+${costPct.toFixed(1)}%) Higher`;
      diffCostEl.className = 'metric-value font-mono delta-excess';
    } else {
      diffCostEl.textContent = `${F.formatCurrency(costDiff, symbol)} (${costPct.toFixed(1)}%) Lower`;
      diffCostEl.className = 'metric-value font-mono delta-savings';
    }
  }

  // --- 4. CSV Export with Formula Injection Sanitization ---
  function handleExportCsv() {
    if (isAuthenticatedMode) {
      // Trigger download from authenticated MySQL API
      window.location.href = window.EnergyApi.reports.getCsvExportUrl();
      if (window.showToast) {
        window.showToast('Downloading appliance inventory CSV from database');
      }
    } else {
      const appliances = window.EnergyStorage.getAppliances();
      if (appliances.length === 0) {
        alert('No appliances available to export.');
        return;
      }

      const settings = window.EnergyStorage.getSettings();
      const rate = settings.electricity_rate || 8.0;
      const F = window.EnergyFormatters;

      const headers = [
        'Appliance Name',
        'Room',
        'Category',
        'Rated Power (Watts)',
        'Quantity',
        'Daily Hours',
        'Days per Month',
        'Daily kWh',
        'Monthly kWh',
        'Estimated Cost'
      ];

      const rows = appliances.map((app) => {
        const computed = window.EnergyCalculator.computeApplianceMetrics(app, rate);
        return [
          F.sanitizeCsvCell(app.name),
          F.sanitizeCsvCell(app.room),
          F.sanitizeCsvCell(app.category),
          app.rated_watts,
          app.quantity,
          app.daily_hours,
          app.days_used_per_month || 30,
          computed.daily_kwh.toFixed(3),
          computed.monthly_kwh.toFixed(2),
          computed.monthly_cost.toFixed(2)
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `energysaver_appliances_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (window.showToast) {
        window.showToast('CSV export downloaded from demo storage');
      }
    }
  }

  // Expose methods for backward compatibility
  window.viewSnapshotDetails = viewSnapshotDetails;
  window.deleteActualBill = deleteActualBill;
  window.openActualBillModal = openActualBillModal;
})();
