/**
 * EnergySaver - Appliance Inventory Management Logic
 * Connects to live MySQL / Express REST API for authenticated users,
 * while preserving local storage fallback for standalone demo visitors.
 */

(function () {
  'use strict';

  let isAuthenticatedMode = false;
  let currentEditingId = null;
  let deleteTargetId = null;
  let allAppliances = [];
  let currentSettings = { electricity_rate: 8.0, currency_symbol: '₹' };

  document.addEventListener('DOMContentLoaded', async function () {
    setupFiltersAndSearch();
    setupPresetSelect();
    setupFormValidationAndPreview();
    setupModals();
    setupTableActions();
    await initializeApplianceState();

    // Custom hook from savings modal or other pages
    window.onDemoDataUpdated = function () {
      loadAppliances();
    };
    window.onDataUpdated = function () {
      loadAppliances();
    };
    window.addEventListener('energysaver:data-updated', function () {
      loadAppliances();
    });
  });

  /**
   * Determine session state and load settings
   */
  async function initializeApplianceState() {
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
      isAuthenticatedMode = false;
    }

    renderModeBadge();
    await loadAppliances();
  }

  function renderModeBadge() {
    const badge = document.getElementById('appliancesModeBadge');
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

  /**
   * Loads appliances from live backend (authenticated) or demo storage (unauthenticated)
   */
  async function loadAppliances() {
    if (isAuthenticatedMode) {
      try {
        const searchInput = document.getElementById('applianceSearchInput');
        const roomSelect = document.getElementById('filterRoomSelect');
        const categorySelect = document.getElementById('filterCategorySelect');
        const sortSelect = document.getElementById('sortSelect');

        const params = {};
        if (searchInput && searchInput.value.trim()) params.search = searchInput.value.trim();
        if (roomSelect && roomSelect.value) params.room = roomSelect.value;
        if (categorySelect && categorySelect.value) params.category = categorySelect.value;

        const sortVal = sortSelect ? sortSelect.value : 'kwh_desc';
        if (sortVal === 'kwh_desc') {
          params.sort_by = 'monthly_kwh';
          params.sort_order = 'desc';
        } else if (sortVal === 'kwh_asc') {
          params.sort_by = 'monthly_kwh';
          params.sort_order = 'asc';
        } else if (sortVal === 'cost_desc') {
          params.sort_by = 'monthly_cost';
          params.sort_order = 'desc';
        } else if (sortVal === 'name_asc') {
          params.sort_by = 'name';
          params.sort_order = 'asc';
        }

        const res = await window.EnergyApi.appliances.list(params);
        if (res && res.success && Array.isArray(res.data)) {
          allAppliances = res.data;
          renderTable(allAppliances, currentSettings.currency_symbol || '₹');
        }
      } catch (err) {
        console.error('Failed to load appliances from MySQL API:', err);
        if (window.showToast) {
          window.showToast('Error loading appliances: ' + (err.message || 'Unknown error'));
        }
      }
    } else {
      currentSettings = window.EnergyStorage.getSettings();
      allAppliances = window.EnergyStorage.getAppliances();
      applyDemoFiltersAndRender();
    }
  }

  function applyFiltersAndRender() {
    if (isAuthenticatedMode) {
      loadAppliances();
    } else {
      applyDemoFiltersAndRender();
    }
  }

  function applyDemoFiltersAndRender() {
    const searchInput = document.getElementById('applianceSearchInput');
    const roomSelect = document.getElementById('filterRoomSelect');
    const categorySelect = document.getElementById('filterCategorySelect');
    const sortSelect = document.getElementById('sortSelect');

    const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const roomVal = roomSelect ? roomSelect.value : '';
    const categoryVal = categorySelect ? categorySelect.value : '';
    const sortVal = sortSelect ? sortSelect.value : 'kwh_desc';

    const rate = currentSettings.electricity_rate || 8.0;
    const symbol = currentSettings.currency_symbol || '₹';

    let list = allAppliances.map((app) =>
      window.EnergyCalculator.computeApplianceMetrics(app, rate)
    );

    if (searchVal) {
      list = list.filter((a) => a.name.toLowerCase().includes(searchVal));
    }

    if (roomVal) {
      list = list.filter((a) => a.room === roomVal);
    }

    if (categoryVal) {
      list = list.filter((a) => a.category === categoryVal);
    }

    if (sortVal === 'kwh_desc') {
      list.sort((a, b) => b.monthly_kwh - a.monthly_kwh);
    } else if (sortVal === 'kwh_asc') {
      list.sort((a, b) => a.monthly_kwh - b.monthly_kwh);
    } else if (sortVal === 'cost_desc') {
      list.sort((a, b) => b.monthly_cost - a.monthly_cost);
    } else if (sortVal === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderTable(list, symbol);
  }

  function setupTableActions() {
    const tbody = document.getElementById('appliancesTableBody');
    if (!tbody) return;

    tbody.addEventListener('click', function (e) {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      if (!id) return;

      if (action === 'test') {
        if (typeof window.openSavingsModal === 'function') {
          window.openSavingsModal(id);
        }
      } else if (action === 'edit') {
        openApplianceModal(id);
      } else if (action === 'delete') {
        confirmDeleteAppliance(id);
      }
    });
  }

  function renderTable(list, symbol) {
    const tbody = document.getElementById('appliancesTableBody');
    const emptyContainer = document.getElementById('appliancesEmptyState');
    const countBadge = document.getElementById('appliancesCountBadge');
    const F = window.EnergyFormatters;

    if (countBadge) {
      countBadge.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
    }

    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      if (emptyContainer) emptyContainer.style.display = 'block';
      return;
    }

    if (emptyContainer) emptyContainer.style.display = 'none';

    list.forEach((app) => {
      const row = document.createElement('tr');
      const hours = typeof app.daily_hours === 'number' ? app.daily_hours.toFixed(1) : parseFloat(app.daily_hours).toFixed(1);
      const safeId = F.escapeHtml(String(app.id));

      row.innerHTML = `
        <td>
          <div class="cell-primary">${F.escapeHtml(app.name)}</div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
            ${app.rated_watts}W &bull; Qty: ${app.quantity}
          </div>
        </td>
        <td><span class="badge badge-room">${F.escapeHtml(app.room)}</span></td>
        <td><span class="badge">${F.escapeHtml(app.category)}</span></td>
        <td class="font-mono">${hours}h/day</td>
        <td class="font-mono">${app.days_used_per_month}d</td>
        <td class="font-mono cell-primary">${F.formatKwh(app.monthly_kwh)}</td>
        <td class="font-mono text-right">${F.formatCurrency(app.monthly_cost, symbol)}</td>
        <td class="text-right no-print">
          <div style="display: inline-flex; gap: 4px;">
            <button type="button" class="btn btn-secondary btn-sm" data-action="test" data-id="${safeId}" title="Test reducing hours in savings sandbox">
              Test
            </button>
            <button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-id="${safeId}" title="Edit appliance details">
              Edit
            </button>
            <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${safeId}" title="Delete appliance">
              Del
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  function setupFiltersAndSearch() {
    const searchInput = document.getElementById('applianceSearchInput');
    const roomSelect = document.getElementById('filterRoomSelect');
    const categorySelect = document.getElementById('filterCategorySelect');
    const sortSelect = document.getElementById('sortSelect');
    const resetFilterBtn = document.getElementById('resetFiltersBtn');

    if (roomSelect && window.EnergyPresets) {
      window.EnergyPresets.DEFAULT_ROOMS.forEach((room) => {
        const opt = document.createElement('option');
        opt.value = room;
        opt.textContent = room;
        roomSelect.appendChild(opt);
      });
    }

    if (categorySelect && window.EnergyPresets) {
      window.EnergyPresets.CATEGORIES.forEach((cat) => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
      });
    }

    if (searchInput) searchInput.addEventListener('input', applyFiltersAndRender);
    if (roomSelect) roomSelect.addEventListener('change', applyFiltersAndRender);
    if (categorySelect) categorySelect.addEventListener('change', applyFiltersAndRender);
    if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndRender);

    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (roomSelect) roomSelect.value = '';
        if (categorySelect) categorySelect.value = '';
        if (sortSelect) sortSelect.value = 'kwh_desc';
        applyFiltersAndRender();
      });
    }
  }

  function setupPresetSelect() {
    const presetSelect = document.getElementById('appliancePresetSelect');
    if (!presetSelect || !window.EnergyPresets) return;

    window.EnergyPresets.PRESETS.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.rated_watts}W)`;
      presetSelect.appendChild(opt);
    });

    presetSelect.addEventListener('change', function () {
      if (!this.value) return;
      const preset = window.EnergyPresets.PRESETS.find((p) => p.id === this.value);
      if (!preset) return;

      document.getElementById('appNameInput').value = preset.name;
      document.getElementById('appWattsInput').value = preset.rated_watts;
      document.getElementById('appQtyInput').value = preset.quantity;
      document.getElementById('appHoursInput').value = preset.daily_hours;
      document.getElementById('appDaysInput').value = preset.days_used_per_month;
      document.getElementById('appCategoryInput').value = preset.category;
      document.getElementById('appRoomInput').value = preset.room;

      const badge = document.getElementById('presetNoticeBadge');
      if (badge) {
        badge.style.display = 'block';
        badge.textContent = `Preset loaded: ${preset.notes} (Editable example)`;
      }

      updateLivePreview();
    });
  }

  function setupFormValidationAndPreview() {
    const inputs = ['appWattsInput', 'appQtyInput', 'appHoursInput', 'appDaysInput'];
    inputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateLivePreview);
      }
    });

    const form = document.getElementById('applianceForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
  }

  function updateLivePreview() {
    const watts = parseFloat(document.getElementById('appWattsInput').value) || 0;
    const qty = parseInt(document.getElementById('appQtyInput').value, 10) || 1;
    const hours = parseFloat(document.getElementById('appHoursInput').value) || 0;
    const days = parseInt(document.getElementById('appDaysInput').value, 10) || 30;

    const rate = currentSettings.electricity_rate || 8.0;
    const symbol = currentSettings.currency_symbol || '₹';

    const dailyKwh = window.EnergyCalculator.calculateDailyKwh(watts, qty, hours);
    const monthlyKwh = window.EnergyCalculator.calculateMonthlyKwh(dailyKwh, days);
    const monthlyCost = window.EnergyCalculator.calculateFlatCost(monthlyKwh, rate);

    const F = window.EnergyFormatters;
    const prevDaily = document.getElementById('previewDailyKwh');
    const prevMonthly = document.getElementById('previewMonthlyKwh');
    const prevCost = document.getElementById('previewMonthlyCost');

    if (prevDaily) prevDaily.textContent = `${dailyKwh.toFixed(2)} kWh`;
    if (prevMonthly) prevMonthly.textContent = `${monthlyKwh.toFixed(2)} kWh`;
    if (prevCost) prevCost.textContent = F.formatCurrency(monthlyCost, symbol);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('appNameInput').value.trim();
    const category = document.getElementById('appCategoryInput').value;
    const room = document.getElementById('appRoomInput').value;
    const watts = parseFloat(document.getElementById('appWattsInput').value);
    const qty = parseInt(document.getElementById('appQtyInput').value, 10);
    const hours = parseFloat(document.getElementById('appHoursInput').value);
    const days = parseInt(document.getElementById('appDaysInput').value, 10);

    let isValid = true;

    if (!name || name.length > 100) {
      showFieldError('appNameInput', 'Name is required (max 100 chars)');
      isValid = false;
    } else {
      clearFieldError('appNameInput');
    }

    if (isNaN(watts) || watts < 1 || watts > 10000) {
      showFieldError('appWattsInput', 'Wattage must be between 1 and 10,000 W');
      isValid = false;
    } else {
      clearFieldError('appWattsInput');
    }

    if (isNaN(qty) || qty < 1 || qty > 50) {
      showFieldError('appQtyInput', 'Quantity must be between 1 and 50');
      isValid = false;
    } else {
      clearFieldError('appQtyInput');
    }

    if (isNaN(hours) || hours < 0.1 || hours > 24.0) {
      showFieldError('appHoursInput', 'Daily hours must be between 0.1 and 24.0');
      isValid = false;
    } else {
      clearFieldError('appHoursInput');
    }

    if (isNaN(days) || days < 1 || days > 31) {
      showFieldError('appDaysInput', 'Days used must be between 1 and 31');
      isValid = false;
    } else {
      clearFieldError('appDaysInput');
    }

    if (!isValid) return;

    const payload = {
      name,
      category,
      room,
      rated_watts: watts,
      quantity: qty,
      daily_hours: hours,
      days_used_per_month: days
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
    }

    try {
      if (isAuthenticatedMode) {
        if (currentEditingId) {
          await window.EnergyApi.appliances.update(currentEditingId, payload);
          if (window.showToast) window.showToast('Appliance updated in database');
        } else {
          await window.EnergyApi.appliances.create(payload);
          if (window.showToast) window.showToast('Appliance added to database');
        }
      } else {
        if (currentEditingId) {
          payload.id = currentEditingId;
        }
        window.EnergyStorage.saveAppliance(payload);
        if (window.showToast) {
          window.showToast(currentEditingId ? 'Appliance updated' : 'Appliance added to demo inventory');
        }
      }

      closeApplianceModal();
      await loadAppliances();
    } catch (err) {
      alert('Failed to save appliance: ' + (err.message || 'Unknown error'));
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Appliance';
      }
    }
  }

  function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.add('is-invalid');
    const parent = input.closest('.form-group');
    if (parent) {
      let err = parent.querySelector('.form-error');
      if (err) {
        err.textContent = message;
        err.style.display = 'block';
      }
    }
  }

  function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.remove('is-invalid');
    const parent = input.closest('.form-group');
    if (parent) {
      let err = parent.querySelector('.form-error');
      if (err) err.style.display = 'none';
    }
  }

  function setupModals() {
    const addBtn = document.getElementById('openAddApplianceModalBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        openApplianceModal(null);
      });
    }

    // Modal close handlers
    document.querySelectorAll('[data-app-modal-close]').forEach((btn) => {
      btn.addEventListener('click', closeApplianceModal);
    });

    // Delete modal confirmation button
    const confirmDeleteBtn = document.getElementById('confirmDeleteApplianceBtn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', async function () {
        if (!deleteTargetId) return;

        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Deleting...';

        try {
          if (isAuthenticatedMode) {
            await window.EnergyApi.appliances.delete(deleteTargetId);
            if (window.showToast) window.showToast('Appliance removed from database');
          } else {
            window.EnergyStorage.deleteAppliance(deleteTargetId);
            if (window.showToast) window.showToast('Appliance removed from demo inventory');
          }

          closeDeleteModal();
          await loadAppliances();
        } catch (err) {
          alert('Failed to delete appliance: ' + (err.message || 'Unknown error'));
        } finally {
          confirmDeleteBtn.disabled = false;
          confirmDeleteBtn.textContent = 'Yes, Delete';
        }
      });
    }

    document.querySelectorAll('[data-delete-modal-close]').forEach((btn) => {
      btn.addEventListener('click', closeDeleteModal);
    });
  }

  function openApplianceModal(appId) {
    currentEditingId = appId;
    const modal = document.getElementById('applianceModal');
    const title = document.getElementById('applianceModalTitle');
    const form = document.getElementById('applianceForm');
    const presetSelect = document.getElementById('appliancePresetSelect');
    const badge = document.getElementById('presetNoticeBadge');

    if (form) form.reset();
    if (badge) badge.style.display = 'none';

    // Populate category dropdown
    const catSelect = document.getElementById('appCategoryInput');
    if (catSelect && catSelect.children.length === 0 && window.EnergyPresets) {
      window.EnergyPresets.CATEGORIES.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
      });
    }

    // Populate room dropdown
    const roomSelect = document.getElementById('appRoomInput');
    if (roomSelect && roomSelect.children.length === 0 && window.EnergyPresets) {
      window.EnergyPresets.DEFAULT_ROOMS.forEach((r) => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        roomSelect.appendChild(opt);
      });
    }

    if (appId) {
      title.textContent = 'Edit Appliance';
      let app = null;
      if (isAuthenticatedMode) {
        app = allAppliances.find((a) => String(a.id) === String(appId));
      } else {
        app = window.EnergyStorage.getAppliance(appId);
      }

      if (app) {
        document.getElementById('appNameInput').value = app.name;
        document.getElementById('appCategoryInput').value = app.category;
        document.getElementById('appRoomInput').value = app.room;
        document.getElementById('appWattsInput').value = app.rated_watts;
        document.getElementById('appQtyInput').value = app.quantity;
        document.getElementById('appHoursInput').value = app.daily_hours;
        document.getElementById('appDaysInput').value = app.days_used_per_month;
      }
      if (presetSelect) presetSelect.value = '';
    } else {
      title.textContent = 'Add Appliance';
      if (presetSelect) presetSelect.value = '';
      document.getElementById('appDaysInput').value = 30;
      document.getElementById('appQtyInput').value = 1;
      document.getElementById('appHoursInput').value = 4.0;
    }

    updateLivePreview();
    if (modal) modal.classList.add('is-open');
  }

  function closeApplianceModal() {
    const modal = document.getElementById('applianceModal');
    if (modal) modal.classList.remove('is-open');
    currentEditingId = null;
  }

  window.editAppliance = function (id) {
    openApplianceModal(id);
  };

  window.confirmDeleteAppliance = function (id) {
    deleteTargetId = id;
    let app = null;
    if (isAuthenticatedMode) {
      app = allAppliances.find((a) => String(a.id) === String(id));
    } else {
      app = window.EnergyStorage.getAppliance(id);
    }
    const nameEl = document.getElementById('deleteApplianceName');
    if (nameEl && app) {
      nameEl.textContent = app.name;
    }
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.add('is-open');
  };

  function closeDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.classList.remove('is-open');
    deleteTargetId = null;
  }
})();
