/**
 * EnergySaver - Formatting & Safe Output Utilities
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EnergyFormatters = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Formats a monetary value with a currency symbol and 2 decimal places
   * @param {number} amount
   * @param {string} [symbol='₹']
   * @returns {string} e.g. "₹3,750.00"
   */
  function formatCurrency(amount, symbol = '₹') {
    const num = Number(amount) || 0;
    const formattedNum = num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${symbol}${formattedNum}`;
  }

  /**
   * Formats an energy value in kWh with 2 decimal places
   * @param {number} kwh
   * @returns {string} e.g. "468.75 kWh"
   */
  function formatKwh(kwh) {
    const num = Number(kwh) || 0;
    return `${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} kWh`;
  }

  /**
   * Formats hours per day
   * @param {number} hours
   * @returns {string} e.g. "3.5 hrs/day"
   */
  function formatHours(hours) {
    const num = Number(hours) || 0;
    return `${num.toFixed(1)} hrs/day`;
  }

  /**
   * Escapes untrusted user input string to prevent XSS injection (both text & attribute contexts)
   * @param {string} str
   * @returns {string} Safe escaped string
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Sanitizes a string for CSV export to protect against spreadsheet formula injection
   * @param {string|number} value
   * @returns {string}
   */
  function sanitizeCsvCell(value) {
    if (value === null || value === undefined) return '""';
    let str = String(value);
    const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
    if (dangerousChars.includes(str.charAt(0))) {
      str = `'${str}`;
    }
    // Escape internal double quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  }

  return {
    formatCurrency,
    formatKwh,
    formatHours,
    escapeHtml,
    sanitizeCsvCell
  };
});
