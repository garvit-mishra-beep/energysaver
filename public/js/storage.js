/**
 * EnergySaver - Isolated Demo Storage Manager
 * Stores demo household data in browser localStorage under a dedicated namespace.
 * Guarantees zero pollution of future database models and provides easy Reset / Empty State toggling.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EnergyStorage = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'energysaver_demo_data_v1';

  // Realistic sample household: 2-BHK apartment in October 2026
  // Numbers precisely match the worked numerical example in docs/CALCULATIONS.md
  const DEFAULT_DEMO_DATA = {
    settings: {
      electricity_rate: 8.0000, // Hypothetical editable rate per kWh
      rate_label: 'Hypothetical rate (editable in Settings)',
      monthly_budget: 3500.00,
      currency_symbol: '₹',
      period_name: 'October 2026',
      custom_rooms: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Other']
    },
    appliances: [
      {
        id: 'demo_app_1',
        name: 'Water Heater (Geyser)',
        category: 'Heating',
        room: 'Bathroom',
        rated_watts: 2000,
        quantity: 1,
        daily_hours: 3.0,
        days_used_per_month: 30,
        created_at: '2026-10-01T10:00:00.000Z'
      },
      {
        id: 'demo_app_2',
        name: 'Refrigerator (Double Door)',
        category: 'Kitchen',
        room: 'Kitchen',
        rated_watts: 150,
        quantity: 1,
        daily_hours: 16.0,
        days_used_per_month: 30,
        created_at: '2026-10-01T10:05:00.000Z'
      },
      {
        id: 'demo_app_3',
        name: 'Ceiling Fans',
        category: 'Cooling',
        room: 'Living Room',
        rated_watts: 75,
        quantity: 2,
        daily_hours: 10.0,
        days_used_per_month: 30,
        created_at: '2026-10-01T10:10:00.000Z'
      },
      {
        id: 'demo_app_4',
        name: 'Television',
        category: 'Entertainment',
        room: 'Living Room',
        rated_watts: 100,
        quantity: 1,
        daily_hours: 5.0,
        days_used_per_month: 30,
        created_at: '2026-10-01T10:15:00.000Z'
      },
      {
        id: 'demo_app_5',
        name: 'LED Lighting',
        category: 'Lighting',
        room: 'Bedroom',
        rated_watts: 10,
        quantity: 6,
        daily_hours: 6.0,
        days_used_per_month: 30,
        created_at: '2026-10-01T10:20:00.000Z'
      }
    ],
    // Sample historical snapshots to demonstrate report inspection and comparison
    snapshots: [
      {
        id: 'snap_sep_2026',
        period_name: 'September 2026 Estimate',
        period_start: '2026-09-01',
        period_end: '2026-09-30',
        total_kwh: 365.50,
        total_cost: 2924.00,
        tariff_rate_used: 8.0000,
        budget_used: 3500.00,
        created_at: '2026-09-30T23:59:00.000Z',
        items: [
          { appliance_name: 'Water Heater (Geyser)', room: 'Bathroom', category: 'Heating', rated_watts: 2000, quantity: 1, daily_hours: 3.5, days_used: 30, monthly_kwh: 210.00, monthly_cost: 1680.00 },
          { appliance_name: 'Refrigerator (Double Door)', room: 'Kitchen', category: 'Kitchen', rated_watts: 150, quantity: 1, daily_hours: 16.0, days_used: 30, monthly_kwh: 72.00, monthly_cost: 576.00 },
          { appliance_name: 'Ceiling Fans', room: 'Living Room', category: 'Cooling', rated_watts: 75, quantity: 2, daily_hours: 12.0, days_used: 30, monthly_kwh: 54.00, monthly_cost: 432.00 },
          { appliance_name: 'Television', room: 'Living Room', category: 'Entertainment', rated_watts: 100, quantity: 1, daily_hours: 5.5, days_used: 30, monthly_kwh: 16.50, monthly_cost: 132.00 },
          { appliance_name: 'LED Lighting', room: 'Bedroom', category: 'Lighting', rated_watts: 10, quantity: 6, daily_hours: 7.2, days_used: 30, monthly_kwh: 13.00, monthly_cost: 104.00 }
        ]
      }
    ],
    // Sample actual utility bills to demonstrate reconciliation
    actual_bills: [
      {
        id: 'bill_sep_2026',
        billing_start_date: '2026-09-01',
        billing_end_date: '2026-09-30',
        billed_kwh: 380.00,
        billed_amount: 3080.00,
        provider_name: 'State Electricity Distribution Co.',
        notes: 'End of summer cooling. 2 guest visits during the month.'
      }
    ]
  };

  /**
   * Loads state from localStorage or initializes with default demo data
   */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage demo state, reinitializing', e);
    }
    // Initialize default demo state
    saveState(DEFAULT_DEMO_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DEMO_DATA));
  }

  /**
   * Persists state to localStorage
   */
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  // --- Appliance Operations ---
  function getAppliances() {
    return loadState().appliances || [];
  }

  function getAppliance(id) {
    const list = getAppliances();
    return list.find((a) => a.id === id) || null;
  }

  function saveAppliance(appData) {
    const state = loadState();
    if (appData.id) {
      // Update existing
      const index = state.appliances.findIndex((a) => a.id === appData.id);
      if (index !== -1) {
        state.appliances[index] = {
          ...state.appliances[index],
          ...appData,
          updated_at: new Date().toISOString()
        };
      }
    } else {
      // Create new
      const newApp = {
        ...appData,
        id: 'app_' + Date.now(),
        created_at: new Date().toISOString()
      };
      state.appliances.push(newApp);
    }
    saveState(state);
    return state.appliances;
  }

  function deleteAppliance(id) {
    const state = loadState();
    state.appliances = state.appliances.filter((a) => a.id !== id);
    saveState(state);
    return state.appliances;
  }

  // --- Settings Operations ---
  function getSettings() {
    return loadState().settings;
  }

  function updateSettings(newSettings) {
    const state = loadState();
    state.settings = { ...state.settings, ...newSettings };
    saveState(state);
    return state.settings;
  }

  // --- Snapshot Operations ---
  function getSnapshots() {
    return loadState().snapshots || [];
  }

  function saveSnapshot(snapshotData) {
    const state = loadState();
    const newSnapshot = {
      ...snapshotData,
      id: 'snap_' + Date.now(),
      created_at: new Date().toISOString()
    };
    state.snapshots.unshift(newSnapshot);
    saveState(state);
    return newSnapshot;
  }

  // --- Actual Bill Operations ---
  function getActualBills() {
    return loadState().actual_bills || [];
  }

  function saveActualBill(billData) {
    const state = loadState();
    const newBill = {
      ...billData,
      id: 'bill_' + Date.now(),
      created_at: new Date().toISOString()
    };
    state.actual_bills.unshift(newBill);
    saveState(state);
    return newBill;
  }

  function deleteActualBill(id) {
    const state = loadState();
    state.actual_bills = state.actual_bills.filter((b) => b.id !== id);
    saveState(state);
    return state.actual_bills;
  }

  // --- Reset & Testing States ---
  function resetToSampleData() {
    saveState(DEFAULT_DEMO_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DEMO_DATA));
  }

  function setEmptyState() {
    const emptyState = {
      settings: { ...DEFAULT_DEMO_DATA.settings },
      appliances: [],
      snapshots: [],
      actual_bills: []
    };
    saveState(emptyState);
    return emptyState;
  }

  return {
    getAppliances,
    getAppliance,
    saveAppliance,
    deleteAppliance,
    getSettings,
    updateSettings,
    getSnapshots,
    saveSnapshot,
    getActualBills,
    saveActualBill,
    deleteActualBill,
    resetToSampleData,
    setEmptyState
  };
});
