/**
 * EnergySaver - Common Household Appliance Presets Catalog
 * NOTE: Preset wattages are typical estimates. Users should always verify their appliance label.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EnergyPresets = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PRESETS = [
    {
      id: 'preset_fan',
      name: 'Ceiling Fan',
      category: 'Cooling',
      room: 'Living Room',
      rated_watts: 75,
      quantity: 2,
      daily_hours: 10.0,
      days_used_per_month: 30,
      notes: 'Standard 1200mm sweep ceiling fan. BLDC fans consume ~28-35W.'
    },
    {
      id: 'preset_geyser',
      name: 'Water Heater (Geyser)',
      category: 'Heating',
      room: 'Bathroom',
      rated_watts: 2000,
      quantity: 1,
      daily_hours: 3.0,
      days_used_per_month: 30,
      notes: 'High-power heating element. A major contributor to winter electricity bills.'
    },
    {
      id: 'preset_fridge',
      name: 'Refrigerator (Double Door)',
      category: 'Kitchen',
      room: 'Kitchen',
      rated_watts: 150,
      quantity: 1,
      daily_hours: 16.0,
      days_used_per_month: 30,
      notes: 'Runs 24 hours, but compressor cycles on/off for ~14-16 hours total.'
    },
    {
      id: 'preset_tv',
      name: 'Smart Television (43-50")',
      category: 'Entertainment',
      room: 'Living Room',
      rated_watts: 100,
      quantity: 1,
      daily_hours: 5.0,
      days_used_per_month: 30,
      notes: 'Modern LED/OLED screen in normal brightness mode.'
    },
    {
      id: 'preset_led',
      name: 'LED Bulbs',
      category: 'Lighting',
      room: 'Bedroom',
      rated_watts: 10,
      quantity: 4,
      daily_hours: 6.0,
      days_used_per_month: 30,
      notes: 'Energy efficient replacement for older 60W incandescent bulbs.'
    },
    {
      id: 'preset_ac',
      name: 'Split AC (1.5 Ton, Inverter)',
      category: 'Cooling',
      room: 'Bedroom',
      rated_watts: 1500,
      quantity: 1,
      daily_hours: 6.0,
      days_used_per_month: 30,
      notes: 'Average power draw while maintaining room thermostat setting.'
    },
    {
      id: 'preset_microwave',
      name: 'Microwave Oven',
      category: 'Kitchen',
      room: 'Kitchen',
      rated_watts: 1200,
      quantity: 1,
      daily_hours: 0.5,
      days_used_per_month: 30,
      notes: 'High wattage draw for short heating intervals.'
    },
    {
      id: 'preset_laptop',
      name: 'Laptop Computer',
      category: 'Work/Study',
      room: 'Bedroom',
      rated_watts: 65,
      quantity: 1,
      daily_hours: 8.0,
      days_used_per_month: 25,
      notes: 'Rated power of AC charging adapter.'
    },
    {
      id: 'preset_washing_machine',
      name: 'Washing Machine (Front Load)',
      category: 'Cleaning',
      room: 'Other',
      rated_watts: 500,
      quantity: 1,
      daily_hours: 1.0,
      days_used_per_month: 15,
      notes: 'Cycle motor usage without water heating.'
    }
  ];

  const CATEGORIES = [
    'Cooling',
    'Heating',
    'Kitchen',
    'Lighting',
    'Entertainment',
    'Cleaning',
    'Work/Study',
    'Other'
  ];

  const DEFAULT_ROOMS = [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Bathroom',
    'Balcony',
    'Dining Room',
    'Other'
  ];

  return {
    PRESETS,
    CATEGORIES,
    DEFAULT_ROOMS
  };
});
