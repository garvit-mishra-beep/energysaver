/**
 * EnergySaver - Signature Floating Bottom Navigation Pill
 * Option B Warm Minimalist Editorial Navigation Component
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    renderFloatingNavigation();
  });

  function renderFloatingNavigation() {
    if (document.getElementById('editorialFloatingNav')) return;

    const currentPath = window.location.pathname.toLowerCase();
    const isHome = currentPath.endsWith('/') || currentPath.endsWith('index.html');
    const isAppliances = currentPath.includes('appliances.html');
    const isReports = currentPath.includes('reports.html');
    const isSettings = currentPath.includes('settings.html');

    const navHtml = `
      <nav id="editorialFloatingNav" class="editorial-floating-nav no-print" aria-label="Floating Primary Navigation">
        <a href="index.html" class="nav-pill-item ${isHome ? 'is-active' : ''}" aria-label="Overview" ${isHome ? 'aria-current="page"' : ''}>
          <svg class="nav-pill-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"/>
          </svg>
          <span class="nav-pill-label">Overview</span>
        </a>

        <a href="appliances.html" class="nav-pill-item ${isAppliances ? 'is-active' : ''}" aria-label="Appliances Inventory" ${isAppliances ? 'aria-current="page"' : ''}>
          <svg class="nav-pill-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="3" width="16" height="18" rx="2"/>
            <line x1="4" y1="9" x2="20" y2="9"/>
            <line x1="8" y1="6" x2="8.01" y2="6"/>
          </svg>
          <span class="nav-pill-label">Appliances</span>
        </a>

        <button type="button" id="floatingSavingsBtn" class="nav-pill-item" aria-label="Calculators and Savings Experiment">
          <svg class="nav-pill-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="16" y1="14" x2="16" y2="18"/>
            <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/>
          </svg>
          <span class="nav-pill-label">Calculators</span>
        </button>

        <a href="reports.html" class="nav-pill-item ${isReports ? 'is-active' : ''}" aria-label="Reports & Bill Reconciliation" ${isReports ? 'aria-current="page"' : ''}>
          <svg class="nav-pill-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span class="nav-pill-label">Reports</span>
        </a>

        <a href="settings.html" class="nav-pill-item ${isSettings ? 'is-active' : ''}" aria-label="Settings and Profile" ${isSettings ? 'aria-current="page"' : ''}>
          <svg class="nav-pill-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4"/>
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
          </svg>
          <span class="nav-pill-label">Settings</span>
        </a>
      </nav>
    `;

    document.body.insertAdjacentHTML('beforeend', navHtml);

    // Wire Calculators button to open Savings Modal
    const calcBtn = document.getElementById('floatingSavingsBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        if (typeof window.openSavingsModal === 'function') {
          window.openSavingsModal();
        } else {
          window.location.href = 'index.html#savings';
        }
      });
    }
  }
})();
