/**
 * EnergySaver - Appliance SVG Line-Art Illustrations
 * Option B Warm Minimalist Editorial Archetypes
 * ViewBox: 120 x 68 | Stroke: #1C2420 (1.75px) | Fill: #EFE9DC
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EnergyIllustrations = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STROKE_COLOR = '#1C2420';
  const FILL_COLOR = '#EFE9DC';
  const ACCENT_COLOR = '#2D5A40';

  /**
   * SVGs for 10 signature household appliance archetypes
   */
  const ICONS = {
    'air-conditioner': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Main Chassis -->
        <rect x="18" y="22" width="84" height="26" rx="4" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Bottom Louver Vent -->
        <path d="M22 41H98" stroke="${STROKE_COLOR}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M22 44H98" stroke="${STROKE_COLOR}" stroke-width="1.25" stroke-linecap="round"/>
        <!-- Top Air Intake Slits -->
        <path d="M26 26H58" stroke="${STROKE_COLOR}" stroke-width="1" stroke-linecap="round"/>
        <path d="M26 29H58" stroke="${STROKE_COLOR}" stroke-width="1" stroke-linecap="round"/>
        <!-- Digital Display / LED Dot -->
        <rect x="80" y="27" width="12" height="6" rx="1.5" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <circle cx="83.5" cy="30" r="0.8" fill="${ACCENT_COLOR}"/>
        <circle cx="86.5" cy="30" r="0.8" fill="${ACCENT_COLOR}"/>
      </svg>
    `,

    'refrigerator': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Main Cabinet -->
        <rect x="42" y="8" width="36" height="52" rx="4" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Door Divider (Freezer Top / Fridge Bottom) -->
        <path d="M42 26H78" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <!-- Upper Door Handle -->
        <rect x="45" y="14" width="2" height="8" rx="1" fill="${STROKE_COLOR}"/>
        <!-- Lower Door Handle -->
        <rect x="45" y="30" width="2" height="14" rx="1" fill="${STROKE_COLOR}"/>
        <!-- Base Feet -->
        <rect x="45" y="60" width="4" height="2" rx="0.5" fill="${STROKE_COLOR}"/>
        <rect x="71" y="60" width="4" height="2" rx="0.5" fill="${STROKE_COLOR}"/>
      </svg>
    `,

    'ceiling-fan': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Downrod -->
        <path d="M60 8V24" stroke="${STROKE_COLOR}" stroke-width="1.75" stroke-linecap="round"/>
        <rect x="56" y="8" width="8" height="3" rx="1" fill="${STROKE_COLOR}"/>
        <!-- Motor Hub -->
        <circle cx="60" cy="34" r="8" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <circle cx="60" cy="34" r="3" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <!-- Left Blade -->
        <path d="M52 34C36 31 22 28 16 33C14 35 18 39 34 38L52 35" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.5" stroke-linejoin="round"/>
        <!-- Right Blade -->
        <path d="M68 34C84 31 98 28 104 33C106 35 102 39 86 38L68 35" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.5" stroke-linejoin="round"/>
        <!-- Bottom Blade (Perspective) -->
        <path d="M60 42C62 50 64 56 60 59C56 59 58 50 60 42" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    `,

    'water-heater': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Geyser Cylindrical Body -->
        <rect x="44" y="10" width="32" height="42" rx="12" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Center Temperature Dial / Gauge -->
        <circle cx="60" cy="28" r="5" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1.25"/>
        <path d="M60 28L62 25" stroke="${STROKE_COLOR}" stroke-width="1.25" stroke-linecap="round"/>
        <circle cx="60" cy="40" r="1.5" fill="${ACCENT_COLOR}"/>
        <!-- Inlet & Outlet Pipes -->
        <rect x="51" y="52" width="4" height="6" rx="1" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.25"/>
        <rect x="65" y="52" width="4" height="6" rx="1" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.25"/>
        <!-- Pipe Rings -->
        <path d="M50 55H56" stroke="${ACCENT_COLOR}" stroke-width="1"/>
        <path d="M64 55H70" stroke="#C86D51" stroke-width="1"/>
      </svg>
    `,

    'microwave': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Outer Shell -->
        <rect x="26" y="16" width="68" height="38" rx="4" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Door Window -->
        <rect x="32" y="22" width="40" height="26" rx="2" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <path d="M37 27L47 37" stroke="${STROKE_COLOR}" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
        <path d="M42 27L52 37" stroke="${STROKE_COLOR}" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
        <!-- Door Handle -->
        <rect x="74" y="24" width="2" height="12" rx="1" fill="${STROKE_COLOR}"/>
        <!-- Control Panel -->
        <rect x="80" y="22" width="10" height="6" rx="1" fill="#FFFFFF" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <circle cx="85" cy="34" r="2.5" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <circle cx="85" cy="42" r="2.5" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <!-- Base Feet -->
        <rect x="32" y="54" width="4" height="2" rx="0.5" fill="${STROKE_COLOR}"/>
        <rect x="84" y="54" width="4" height="2" rx="0.5" fill="${STROKE_COLOR}"/>
      </svg>
    `,

    'television': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Display Frame -->
        <rect x="22" y="14" width="76" height="42" rx="3" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Inner Screen -->
        <rect x="26" y="18" width="68" height="34" rx="1" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <!-- Center Stand Base -->
        <path d="M57 56V60H63V56" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <rect x="48" y="60" width="24" height="2" rx="1" fill="${STROKE_COLOR}"/>
      </svg>
    `,

    'washing-machine': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Cabinet -->
        <rect x="38" y="10" width="44" height="50" rx="4" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Top Control Panel -->
        <path d="M38 22H82" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <!-- Detergent Drawer -->
        <rect x="43" y="14" width="10" height="5" rx="1" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <!-- Control Knob -->
        <circle cx="68" cy="16.5" r="2.5" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <circle cx="76" cy="16.5" r="1" fill="${ACCENT_COLOR}"/>
        <!-- Front Load Porthole Door -->
        <circle cx="60" cy="40" r="14" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <circle cx="60" cy="40" r="9" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.25"/>
        <!-- Door Latch -->
        <rect x="71" y="38" width="2" height="4" rx="1" fill="${STROKE_COLOR}"/>
        <!-- Base Feet -->
        <rect x="42" y="60" width="4" height="2" rx="0.5" fill="${STROKE_COLOR}"/>
        <rect x="74" y="60" width="4" height="2" rx="0.5" fill="${STROKE_COLOR}"/>
      </svg>
    `,

    'laptop': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Screen Panel -->
        <rect x="34" y="14" width="52" height="34" rx="3" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <rect x="38" y="18" width="44" height="26" rx="1" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1"/>
        <!-- Webcam Dot -->
        <circle cx="60" cy="16" r="0.75" fill="${STROKE_COLOR}"/>
        <!-- Base Keyboard Deck -->
        <path d="M26 52L32 48H88L94 52H26Z" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75" stroke-linejoin="round"/>
        <rect x="52" y="50" width="16" height="1.5" rx="0.75" fill="${STROKE_COLOR}"/>
      </svg>
    `,

    'lighting': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Bulb Glass Contour -->
        <path d="M60 12C50 12 43 19 43 28C43 34 47 38 50 43V47H70V43C73 38 77 34 77 28C77 19 70 12 60 12Z" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Filament -->
        <path d="M55 32L58 24L62 24L65 32" stroke="${ACCENT_COLOR}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Screw Base -->
        <path d="M51 47H69" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <path d="M52 50H68" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <path d="M54 53H66" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <path d="M56 56H64" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <!-- Contact Point -->
        <rect x="57" y="56" width="6" height="2" rx="1" fill="${STROKE_COLOR}"/>
      </svg>
    `,

    'smart-home': `
      <svg viewBox="0 0 120 68" width="120" height="68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Device Body -->
        <rect x="36" y="18" width="48" height="34" rx="8" fill="${FILL_COLOR}" stroke="${STROKE_COLOR}" stroke-width="1.75"/>
        <!-- Screen / Dial Area -->
        <circle cx="60" cy="35" r="10" fill="#E8E2D5" stroke="${STROKE_COLOR}" stroke-width="1.5"/>
        <circle cx="60" cy="35" r="4" fill="${ACCENT_COLOR}"/>
        <path d="M60 21V23" stroke="${STROKE_COLOR}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M72 25L70 27" stroke="${STROKE_COLOR}" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M48 25L50 27" stroke="${STROKE_COLOR}" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `
  };

  /**
   * Deterministically resolves an appliance to one of the 10 visual archetypes
   * @param {string} name
   * @param {string} category
   * @returns {string} SVG markup string
   */
  function getApplianceSvg(name = '', category = '') {
    const key = `${name.toLowerCase()} ${category.toLowerCase()}`;

    if (key.includes('condition') || key.includes('split ac') || key.includes('window ac') || key.includes('ac ') || key.endsWith(' ac') || key === 'ac') {
      return ICONS['air-conditioner'];
    }
    if (key.includes('fridge') || key.includes('refriger') || key.includes('freezer')) {
      return ICONS['refrigerator'];
    }
    if (key.includes('fan') || key.includes('circulation')) {
      return ICONS['ceiling-fan'];
    }
    if (key.includes('geyser') || key.includes('water heater') || key.includes('heater') || key.includes('boiler')) {
      return ICONS['water-heater'];
    }
    if (key.includes('microwave') || key.includes('oven') || key.includes('toaster') || key.includes('core')) {
      return ICONS['microwave'];
    }
    if (key.includes('tv') || key.includes('television') || key.includes('display') || key.includes('screen')) {
      return ICONS['television'];
    }
    if (key.includes('wash') || key.includes('laundry') || key.includes('dryer')) {
      return ICONS['washing-machine'];
    }
    if (key.includes('laptop') || key.includes('computer') || key.includes('pc') || key.includes('desktop')) {
      return ICONS['laptop'];
    }
    if (key.includes('bulb') || key.includes('light') || key.includes('lamp') || key.includes('led')) {
      return ICONS['lighting'];
    }

    return ICONS['smart-home'];
  }

  return {
    ICONS,
    getApplianceSvg
  };
});
