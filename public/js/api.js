/**
 * EnergySaver - Centralized API & CSRF Client Wrapper
 * Manages CSRF token retrieval, session cookies, and standard API errors.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EnergyApi = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let cachedCsrfToken = null;

  /**
   * Fetches fresh CSRF token from the server
   */
  async function getCsrfToken() {
    if (cachedCsrfToken) return cachedCsrfToken;
    try {
      const res = await fetch('/api/csrf-token', { credentials: 'same-origin' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.csrfToken) {
          cachedCsrfToken = json.data.csrfToken;
          return cachedCsrfToken;
        }
      }
    } catch (e) {
      console.warn('Could not fetch CSRF token:', e);
    }
    return null;
  }

  /**
   * Generic authenticated Fetch wrapper with automatic CSRF injection
   */
  async function request(path, options = {}) {
    const url = path.startsWith('/api') ? path : `/api${path}`;
    const opts = {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      },
      ...options
    };

    const method = (opts.method || 'GET').toUpperCase();
    const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    if (isStateChanging) {
      const token = await getCsrfToken();
      if (token) {
        opts.headers['X-CSRF-Token'] = token;
      }
      if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(opts.body);
      }
    }

    let response;
    try {
      response = await fetch(url, opts);
    } catch (networkErr) {
      const err = new Error('Network connection failed. Please check your internet connection or server status.');
      err.code = 'NETWORK_ERROR';
      err.status = 0;
      throw err;
    }

    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = null;
      }
    } else {
      try {
        data = await response.text();
      } catch (textErr) {
        data = null;
      }
    }

    if (!response.ok) {
      let code = `HTTP_${response.status}`;
      let message = response.statusText || 'Request failed';
      let field = undefined;

      if (data && data.error) {
        if (typeof data.error === 'object') {
          code = data.error.code || code;
          message = data.error.message || message;
          field = data.error.field;
        } else if (typeof data.error === 'string' && data.error.trim()) {
          message = data.error.trim();
        }
      } else if (typeof data === 'string' && data.trim()) {
        message = data.trim();
      }

      if (response.status === 401) {
        code = 'UNAUTHORIZED';
        message = (data && data.error && data.error.message) || 'Authentication required. Please sign in.';
      } else if (response.status === 403 && code.startsWith('HTTP_')) {
        code = 'FORBIDDEN';
        message = 'Access forbidden. Your session or CSRF token may have expired.';
      }

      const err = new Error(message || 'An unexpected error occurred');
      err.status = response.status;
      err.code = code;
      err.field = field;
      throw err;
    }

    return data;
  }

  // --- Auth Service ---
  const auth = {
    async register(email, password, displayName) {
      return request('/auth/register', {
        method: 'POST',
        body: { email, password, display_name: displayName }
      });
    },

    async login(email, password) {
      return request('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
    },

    async logout() {
      cachedCsrfToken = null;
      return request('/auth/logout', { method: 'POST' });
    },

    async me() {
      return request('/auth/me', { method: 'GET' });
    },

    async updateProfile(displayName) {
      return request('/auth/profile', {
        method: 'PUT',
        body: { display_name: displayName }
      });
    },

    async changePassword(currentPassword, newPassword) {
      return request('/auth/password', {
        method: 'PUT',
        body: { current_password: currentPassword, new_password: newPassword }
      });
    },

    async deleteAccount(password, confirmation = 'DELETE') {
      return request('/auth/delete-account', {
        method: 'POST',
        body: { password, confirmation }
      });
    }
  };

  // --- Settings Service ---
  const settings = {
    async get() {
      return request('/settings', { method: 'GET' });
    },

    async update(settingsPayload) {
      return request('/settings', {
        method: 'PUT',
        body: settingsPayload
      });
    }
  };

  // --- Appliances Service ---
  const appliances = {
    async list(params = {}) {
      const query = new URLSearchParams();
      if (params.room) query.set('room', params.room);
      if (params.category) query.set('category', params.category);
      if (params.search) query.set('search', params.search);
      if (params.sort_by) query.set('sort_by', params.sort_by);
      if (params.sort_order) query.set('sort_order', params.sort_order);

      const qs = query.toString();
      const path = qs ? `/appliances?${qs}` : '/appliances';
      return request(path, { method: 'GET' });
    },

    async create(appliancePayload) {
      return request('/appliances', {
        method: 'POST',
        body: appliancePayload
      });
    },

    async update(id, appliancePayload) {
      return request(`/appliances/${id}`, {
        method: 'PUT',
        body: appliancePayload
      });
    },

    async delete(id) {
      return request(`/appliances/${id}`, {
        method: 'DELETE'
      });
    },

    async preview(previewPayload) {
      return request('/appliances/preview', {
        method: 'POST',
        body: previewPayload
      });
    }
  };

  // --- Dashboard Service ---
  const dashboard = {
    async getSummary() {
      return request('/dashboard/summary', { method: 'GET' });
    }
  };

  // --- Savings Service ---
  const savings = {
    async simulate(modifications) {
      return request('/savings/simulate', {
        method: 'POST',
        body: { modifications }
      });
    },

    async apply(modifications) {
      return request('/savings/apply', {
        method: 'POST',
        body: { modifications }
      });
    }
  };

  // --- Reports Service ---
  const reports = {
    async saveSnapshot(payload) {
      return request('/reports/snapshots', {
        method: 'POST',
        body: payload
      });
    },

    async listSnapshots() {
      return request('/reports/snapshots', { method: 'GET' });
    },

    async getSnapshot(id) {
      return request(`/reports/snapshots/${id}`, { method: 'GET' });
    },

    async logActualBill(payload) {
      return request('/actual-bills', {
        method: 'POST',
        body: payload
      });
    },

    async listActualBills() {
      return request('/actual-bills', { method: 'GET' });
    },

    async deleteActualBill(id) {
      return request(`/actual-bills/${id}`, {
        method: 'DELETE'
      });
    },

    async reconcile(snapshotId, billId) {
      return request(`/reports/reconcile?snapshot_id=${encodeURIComponent(snapshotId)}&bill_id=${encodeURIComponent(billId)}`, {
        method: 'GET'
      });
    },

    getCsvExportUrl() {
      return '/api/reports/export-csv';
    }
  };

  return {
    getCsrfToken,
    request,
    auth,
    settings,
    appliances,
    dashboard,
    savings,
    reports
  };
});
