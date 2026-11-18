/**
 * EnergySaver - Settings & Tariff Configuration Logic
 * Integrates live MySQL settings for authenticated users while preserving demo controls.
 */

(function () {
  'use strict';

  let isAuthenticatedMode = false;

  document.addEventListener('DOMContentLoaded', async function () {
    await initializeSettings();
    setupEventListeners();
  });

  async function initializeSettings() {
    // Check if user is signed in to real account
    try {
      if (window.EnergyApi) {
        const userRes = await window.EnergyApi.auth.me();
        if (userRes && userRes.success && userRes.data) {
          isAuthenticatedMode = true;
          await loadAuthenticatedSettings(userRes.data);
          return;
        }
      }
    } catch (e) {
      isAuthenticatedMode = false;
    }

    // Default to demo settings if not logged in
    loadDemoSettings();
  }

  function loadDemoSettings() {
    const settings = window.EnergyStorage.getSettings();

    const rateInput = document.getElementById('settingRateInput');
    const currencySelect = document.getElementById('settingCurrencySelect');
    const budgetInput = document.getElementById('settingBudgetInput');
    const periodInput = document.getElementById('settingPeriodInput');

    if (rateInput) rateInput.value = settings.electricity_rate || 8.0;
    if (currencySelect) currencySelect.value = settings.currency_symbol || '₹';
    if (budgetInput) budgetInput.value = settings.monthly_budget || 3500.0;
    if (periodInput) periodInput.value = settings.period_name || 'October 2026';

    const profileEmail = document.getElementById('profileEmailInput');
    const profileName = document.getElementById('profileDisplayNameInput');
    if (profileEmail) profileEmail.value = 'demo@example.com (Demo Mode)';
    if (profileName) profileName.value = 'Demo Household';

    renderRoomTags(settings.custom_rooms || []);
    renderSettingsBadge('Demo Storage Mode (Browser LocalStorage)');
  }

  async function loadAuthenticatedSettings(userData = null) {
    try {
      const res = await window.EnergyApi.settings.get();
      if (res && res.success && res.data) {
        const s = res.data;
        const rateInput = document.getElementById('settingRateInput');
        const currencySelect = document.getElementById('settingCurrencySelect');
        const budgetInput = document.getElementById('settingBudgetInput');
        const periodInput = document.getElementById('settingPeriodInput');

        if (rateInput) rateInput.value = s.electricity_rate || 8.0;
        if (currencySelect) currencySelect.value = s.currency_symbol || '₹';
        if (budgetInput) budgetInput.value = s.monthly_budget || 3500.0;
        if (periodInput) periodInput.value = 'October 2026';

        // Populate User Profile
        const user = userData || window.currentUser;
        if (user) {
          const profileEmail = document.getElementById('profileEmailInput');
          const profileName = document.getElementById('profileDisplayNameInput');
          if (profileEmail && user.email) profileEmail.value = user.email;
          if (profileName && user.display_name) profileName.value = user.display_name;
        }

        renderRoomTags(s.custom_rooms || []);
        renderSettingsBadge('Authenticated Database Mode (Saved in MySQL)');

        // Hide demo-specific controls when signed into a real account
        const demoSection = document.getElementById('demoEnvCard');
        if (demoSection) {
          demoSection.style.display = 'none';
        }
      }
    } catch (err) {
      console.warn('Failed to fetch authenticated settings:', err);
      loadDemoSettings();
    }
  }

  function renderSettingsBadge(text) {
    const container = document.getElementById('settingsModeBadge');
    if (container) {
      container.textContent = text;
      container.className = isAuthenticatedMode ? 'badge badge-preset' : 'badge';
    }
  }

  function setupEventListeners() {
    setupPasswordToggles();
    setupProfileForm();
    setupPasswordForm();

    const form = document.getElementById('settingsForm');
    if (form) {
      form.addEventListener('submit', handleSaveSettings);
    }

    const resetBtn = document.getElementById('resetDemoDataSettingsBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (confirm('Reset demo data back to default 2-BHK sample household?')) {
          window.EnergyStorage.resetToSampleData();
          window.showToast('Demo data reset to sample state');
          setTimeout(() => window.location.reload(), 400);
        }
      });
    }

    const emptyBtn = document.getElementById('emptyDemoStateSettingsBtn');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', function () {
        if (confirm('Preview empty household state? (Clears appliances)')) {
          window.EnergyStorage.setEmptyState();
          window.showToast('Empty household state activated');
          setTimeout(() => window.location.reload(), 400);
        }
      });
    }

    // Account deletion modal
    const deleteAccountBtn = document.getElementById('openDeleteAccountModalBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', function () {
        const modal = document.getElementById('deleteAccountModal');
        if (modal) modal.classList.add('is-open');
      });
    }

    document.querySelectorAll('[data-delete-account-close]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const modal = document.getElementById('deleteAccountModal');
        if (modal) modal.classList.remove('is-open');
      });
    });

    const confirmDeleteBtn = document.getElementById('confirmDeleteAccountBtn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', handleDeleteAccount);
    }
  }

  function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const input = this.previousElementSibling;
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          this.textContent = 'Hide';
          this.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          this.textContent = 'Show';
          this.setAttribute('aria-label', 'Show password');
        }
      });
    });
  }

  function setupProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const nameInput = document.getElementById('profileDisplayNameInput');
      const submitBtn = document.getElementById('saveProfileBtn');
      const feedback = document.getElementById('profileFeedbackMessage');
      const errorDiv = document.getElementById('profileDisplayNameError');

      const name = nameInput ? nameInput.value.trim() : '';

      if (!name || name.length > 100) {
        if (nameInput) nameInput.classList.add('is-invalid');
        if (errorDiv) errorDiv.style.display = 'block';
        return;
      } else {
        if (nameInput) nameInput.classList.remove('is-invalid');
        if (errorDiv) errorDiv.style.display = 'none';
      }

      if (!isAuthenticatedMode) {
        if (feedback) {
          feedback.className = 'alert alert-info';
          feedback.innerHTML = '<strong>Demo Mode:</strong> User profile management is available when signed in with a registered account.';
          feedback.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving Profile...';
      }

      try {
        const res = await window.EnergyApi.auth.updateProfile(name);
        if (res && res.success) {
          if (feedback) {
            feedback.className = 'alert alert-success';
            feedback.innerHTML = '<strong>Success:</strong> Display name updated successfully.';
            feedback.style.display = 'block';
          }
          if (window.currentUser) {
            window.currentUser.display_name = name;
          }
          // Update header / demo banner text if present
          const bannerBadge = document.querySelector('.demo-banner .badge');
          if (bannerBadge) {
            bannerBadge.textContent = `Signed In: ${name}`;
          }
          if (typeof window.showToast === 'function') {
            window.showToast('Profile updated successfully');
          }
        }
      } catch (err) {
        if (feedback) {
          feedback.className = 'alert alert-danger';
          feedback.innerHTML = `<strong>Error:</strong> ${err.message || 'Failed to update profile'}`;
          feedback.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Profile';
        }
      }
    });
  }

  function setupPasswordForm() {
    const form = document.getElementById('passwordChangeForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const currentInput = document.getElementById('currentPasswordInput');
      const newInput = document.getElementById('newPasswordInput');
      const confirmInput = document.getElementById('confirmNewPasswordInput');
      const submitBtn = document.getElementById('changePasswordBtn');
      const feedback = document.getElementById('passwordFeedbackMessage');

      const currentErr = document.getElementById('currentPasswordError');
      const newErr = document.getElementById('newPasswordError');
      const confirmErr = document.getElementById('confirmNewPasswordError');

      const currentVal = currentInput ? currentInput.value : '';
      const newVal = newInput ? newInput.value : '';
      const confirmVal = confirmInput ? confirmInput.value : '';

      let isValid = true;

      if (!currentVal) {
        if (currentInput) currentInput.classList.add('is-invalid');
        if (currentErr) currentErr.style.display = 'block';
        isValid = false;
      } else {
        if (currentInput) currentInput.classList.remove('is-invalid');
        if (currentErr) currentErr.style.display = 'none';
      }

      // Password must be >= 8 chars, contain letters and numbers
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!newVal || !passwordRegex.test(newVal)) {
        if (newInput) newInput.classList.add('is-invalid');
        if (newErr) newErr.style.display = 'block';
        isValid = false;
      } else {
        if (newInput) newInput.classList.remove('is-invalid');
        if (newErr) newErr.style.display = 'none';
      }

      if (newVal !== confirmVal) {
        if (confirmInput) confirmInput.classList.add('is-invalid');
        if (confirmErr) confirmErr.style.display = 'block';
        isValid = false;
      } else {
        if (confirmInput) confirmInput.classList.remove('is-invalid');
        if (confirmErr) confirmErr.style.display = 'none';
      }

      if (!isValid) return;

      if (!isAuthenticatedMode) {
        if (feedback) {
          feedback.className = 'alert alert-info';
          feedback.innerHTML = '<strong>Demo Mode:</strong> Password management requires signing in with a real account.';
          feedback.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating Password...';
      }

      try {
        const res = await window.EnergyApi.auth.changePassword(currentVal, newVal);
        if (res && res.success) {
          if (currentInput) currentInput.value = '';
          if (newInput) newInput.value = '';
          if (confirmInput) confirmInput.value = '';

          if (feedback) {
            feedback.className = 'alert alert-success';
            feedback.innerHTML = '<strong>Success:</strong> Password updated successfully.';
            feedback.style.display = 'block';
          }
          if (typeof window.showToast === 'function') {
            window.showToast('Password updated successfully');
          }
        }
      } catch (err) {
        if (feedback) {
          feedback.className = 'alert alert-danger';
          feedback.innerHTML = `<strong>Error:</strong> ${err.message || 'Failed to update password'}`;
          feedback.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Update Password';
        }
      }
    });
  }

  async function handleSaveSettings(e) {
    e.preventDefault();

    const rate = parseFloat(document.getElementById('settingRateInput').value);
    const currency = document.getElementById('settingCurrencySelect').value;
    const budget = parseFloat(document.getElementById('settingBudgetInput').value);
    const period = document.getElementById('settingPeriodInput').value.trim();

    if (isNaN(rate) || rate <= 0) {
      alert('Electricity rate must be a positive number');
      return;
    }

    if (isNaN(budget) || budget < 0) {
      alert('Monthly budget cannot be negative');
      return;
    }

    if (isAuthenticatedMode) {
      // Save to real MySQL database
      try {
        await window.EnergyApi.settings.update({
          electricity_rate: rate,
          monthly_budget: budget,
          currency_symbol: currency
        });
        window.showToast('Settings saved to MySQL database');
      } catch (err) {
        alert('Failed to save settings to database: ' + err.message);
      }
    } else {
      // Save to demo storage
      window.EnergyStorage.updateSettings({
        electricity_rate: rate,
        currency_symbol: currency,
        monthly_budget: budget,
        period_name: period || 'Current Period',
        rate_label: 'Custom user-entered rate'
      });
      window.showToast('Settings updated in demo data');
    }
  }

  async function handleDeleteAccount() {
    const confirmWord = document.getElementById('deleteConfirmWordInput').value.trim();
    if (confirmWord !== 'DELETE') {
      alert('Please type DELETE to confirm');
      return;
    }

    if (isAuthenticatedMode) {
      const pass = prompt('Enter your account password to confirm deletion:');
      if (!pass) return;

      try {
        await window.EnergyApi.auth.deleteAccount(pass, 'DELETE');
        window.showToast('Account and all related records deleted from MySQL');
        const modal = document.getElementById('deleteAccountModal');
        if (modal) modal.classList.remove('is-open');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      } catch (err) {
        alert('Account deletion failed: ' + err.message);
      }
    } else {
      window.EnergyStorage.setEmptyState();
      window.showToast('Demo data erased.');
      const modal = document.getElementById('deleteAccountModal');
      if (modal) modal.classList.remove('is-open');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }
  }

  function renderRoomTags(rooms) {
    const container = document.getElementById('roomTagsContainer');
    if (!container) return;
    container.innerHTML = '';

    rooms.forEach((r) => {
      const span = document.createElement('span');
      span.className = 'badge badge-room';
      span.style.padding = '4px 10px';
      span.textContent = r;
      container.appendChild(span);
    });
  }
})();
