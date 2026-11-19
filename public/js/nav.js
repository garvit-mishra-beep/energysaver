/**
 * EnergySaver - Shared Navigation, Auth State & Demo Banner Manager
 * Enforces the 4-item navigation: My Home, Appliances, Reports, Settings
 * Updates UI based on authenticated MySQL session vs. Demo mode.
 */

(function () {
  'use strict';

  // Global Session State
  window.currentUser = null;

  document.addEventListener('DOMContentLoaded', async function () {
    highlightActiveNav();
    setupDemoBannerActions();
    setupGlobalEscapeHandler();
    await checkSessionState();
  });

  /**
   * Highlights the current active navigation item
   */
  function highlightActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').toLowerCase();
      if (
        (path.endsWith(href) && href !== 'index.html') ||
        ((path.endsWith('/') || path.endsWith('index.html')) && href === 'index.html')
      ) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Checks with server whether user has an active authenticated MySQL session
   */
  async function checkSessionState() {
    try {
      if (window.EnergyApi) {
        const res = await window.EnergyApi.auth.me();
        if (res && res.success && res.data) {
          window.currentUser = res.data;
          renderAuthenticatedHeader(res.data);
          return;
        }
      }
    } catch (e) {
      // 401 Unauthorized is expected for unauthenticated / demo visitors
      window.currentUser = null;
    }

    renderGuestHeader();
  }

  /**
   * Renders header and banner for authenticated users
   */
  function renderAuthenticatedHeader(user) {
    const banner = document.querySelector('.demo-banner');
    if (banner) {
      banner.className = 'demo-banner auth-banner no-print';
      banner.setAttribute('aria-label', 'User Account Banner');
      banner.innerHTML = `
        <div class="demo-banner-content">
          <span class="badge badge-preset" style="font-weight: 600;">
            Account: ${escapeHtml(user.display_name)}
          </span>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
            (${escapeHtml(user.email)}) &bull; Connected to MySQL Database.
          </span>
        </div>
        <div class="demo-actions">
          <button type="button" id="headerLogoutBtn" style="color: var(--color-danger-text); font-weight: 500;">
            Sign Out
          </button>
        </div>
      `;

      const logoutBtn = document.getElementById('headerLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
      }
    }

    // Header actions update: preserve page primary action while offering Sign Out
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      const currentPath = window.location.pathname.toLowerCase();
      if (currentPath.includes('login') || currentPath.includes('register') || currentPath.includes('settings')) {
        headerActions.innerHTML = `
          <button type="button" class="btn btn-secondary btn-sm" id="mainHeaderLogoutBtn">
            Sign Out
          </button>
        `;
        const btn = document.getElementById('mainHeaderLogoutBtn');
        if (btn) btn.addEventListener('click', handleLogout);
      } else {
        if (!document.getElementById('mainHeaderLogoutBtn')) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn btn-secondary btn-sm';
          btn.id = 'mainHeaderLogoutBtn';
          btn.textContent = 'Sign Out';
          btn.style.marginLeft = '8px';
          btn.addEventListener('click', handleLogout);
          headerActions.appendChild(btn);
        }
      }
    }
  }

  /**
   * Renders header and banner for guest / demo users
   */
  function renderGuestHeader() {
    const banner = document.querySelector('.demo-banner');
    if (banner) {
      banner.style.display = 'none';
      banner.innerHTML = '';
    }
  }

  async function handleLogout() {
    try {
      if (window.EnergyApi) {
        await window.EnergyApi.auth.logout();
        window.showToast('Signed out successfully');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 400);
      }
    } catch (e) {
      console.error('Logout error:', e);
      window.location.reload();
    }
  }

  function setupDemoBannerActions() {
    const resetBtn = document.getElementById('demoResetBtn');
    const emptyBtn = document.getElementById('demoEmptyBtn');

    if (resetBtn) {
      resetBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Reset demo data back to the default 2-BHK sample household?')) {
          if (window.EnergyStorage) {
            window.EnergyStorage.resetToSampleData();
            window.showToast('Demo data reset to sample 2-BHK apartment');
            setTimeout(() => window.location.reload(), 400);
          }
        }
      });
    }

    if (emptyBtn) {
      emptyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Preview empty household state (removes all appliances from demo)?')) {
          if (window.EnergyStorage) {
            window.EnergyStorage.setEmptyState();
            window.showToast('Empty household state activated');
            setTimeout(() => window.location.reload(), 400);
          }
        }
      });
    }
  }

  function setupGlobalEscapeHandler() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-backdrop.is-open');
        if (openModal) {
          const closeBtn = openModal.querySelector('.modal-close-btn, [data-modal-close], [data-delete-account-close]');
          if (closeBtn) closeBtn.click();
        }
      }
    });
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.showToast = function (message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3000);
  };
})();
