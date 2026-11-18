# UI/UX Specifications & Design System

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Reference Document:** [docs/PRD.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/PRD.md)

---

## 1. Design Philosophy: The Digital Household Electricity Notebook

EnergySaver is deliberately designed to feel like a thoughtful, approachable household electricity notebook brought to the web. 

### Core Aesthetic Principles
1. **Approachable & Calming:** A warm, neutral palette that reduces the anxiety often associated with utility bills and complex numbers.
2. **Editorial Clarity:** High-contrast, clean typography, comfortable line-heights, and clear visual hierarchy without distracting visual gimmicks.
3. **No Unnecessary Novelty:** Avoid decorative gradients, translucent glassmorphism, oversized promotional marketing hero banners, animated bouncing cards, or emojis in primary interactive controls.
4. **Contextual Guidance:** Form fields include concise, plain-language microcopy explaining where to find information (e.g., *"You can usually find the wattage printed on the silver rating label on the back or bottom of the appliance"*).

---

## 2. Design Tokens (CSS Custom Properties)

```css
:root {
  /* Color Palette */
  --color-bg-canvas: #FBFBF9;       /* Warm off-white background */
  --color-bg-surface: #FFFFFF;      /* Clean card and surface white */
  --color-bg-subtle: #F4F4F0;       /* Light table header / hover tone */
  --color-border: #E4E4DC;          /* Thin, soft division borders */
  --color-border-focus: #2E6F40;    /* High-contrast focus outline */

  /* Text Colors */
  --color-text-primary: #2D312E;    /* Deep charcoal for headings & body */
  --color-text-secondary: #5F6560;  /* Subdued text for metadata & labels */
  --color-text-muted: #878E88;      /* Placeholder text and minor hints */

  /* Brand & Action Colors */
  --color-primary: #2E6F40;         /* Muted forest green for primary actions */
  --color-primary-hover: #245833;   /* Darker green hover state */
  --color-primary-light: #EBF4EE;   /* Very light green tint for badges */

  /* Semantic Feedback Colors */
  --color-warning-text: #8A5B00;    /* Amber text for approaching budget */
  --color-warning-bg: #FEF7E6;      /* Soft amber banner background */
  --color-warning-border: #F7D488;  /* Amber border */

  --color-danger-text: #9B2226;     /* Deep crimson for over-budget / delete */
  --color-danger-bg: #FDF0EE;       /* Soft red banner background */
  --color-danger-border: #F4B8B2;   /* Soft red border */

  --color-info-text: #1D4E89;       /* Informational alert text */
  --color-info-bg: #EEF4FC;         /* Informational alert background */
  --color-info-border: #BDD7F5;     /* Informational alert border */

  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-family-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1.0rem;   /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.375rem;   /* 22px */
  --font-size-2xl: 1.75rem;   /* 28px */

  /* Spacing Scale (8pt Baseline) */
  --space-2: 0.25rem;   /* 4px */
  --space-4: 0.5rem;    /* 8px */
  --space-8: 1.0rem;    /* 16px */
  --space-12: 1.5rem;   /* 24px */
  --space-16: 2.0rem;   /* 32px */
  --space-24: 3.0rem;   /* 48px */

  /* Corner Radius & Elevation */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-modal: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

---

## 3. Global Information Architecture & Navigation

The application uses an uncluttered, persistent top navigation header with exactly four core sections for authenticated users:

```
+----------------------------------------------------------------------------------------------------+
|  [EnergySaver Logo]       [1. My Home]    [2. Appliances]    [3. Reports]    [4. Settings]   [Logout] |
+----------------------------------------------------------------------------------------------------+
```

1. **My Home (`/index.html`):** The primary overview dashboard. Displays key monthly estimate metrics, budget tracking status banners, top consuming appliance, room-wise breakdown table, and Chart.js visualizations.
2. **Appliances (`/appliances.html`):** The operational inventory. Complete tabular list with search, room filtering, sorting, preset loader modal, add/edit form, and live estimation preview.
3. **Reports (`/reports.html`):** Historical reporting, immutable monthly snapshot archival, actual utility bill logging, variance reconciliation, CSV export, and print view.
4. **Settings (`/settings.html`):** User profile, currency selection, flat electricity rate configuration, monthly monetary budget, password change, and account deletion.

---

## 4. Text Wireframes of Primary Screens

### 4.1 Screen 1: My Home (Overview Dashboard)

```
======================================================================================================
[EnergySaver]                  My Home   |   Appliances   |   Reports   |   Settings       [Log Out]
======================================================================================================

  Overview for October 2026                                    [+ Add Appliance]  [Savings Planner]
  Tariff: ₹8.00 / kWh | Monthly Budget: ₹3,500.00

  +------------------------------------------------------------------------------------------------+
  |  ALERT: You're ₹250.00 over your budget.                                                      |
  |  Your estimated bill is ₹3,750.00 against your monthly budget of ₹3,500.00 (107% of budget).  |
  +------------------------------------------------------------------------------------------------+

  +-----------------------+ +-----------------------+ +-----------------------+ +-----------------------+
  | ESTIMATED MONTHLY USE | | ESTIMATED BILL        | | BUDGET STATUS         | | HIGHEST CONSUMER    |
  | 468.75 kWh            | | ₹3,750.00             | | ₹250.00 Over Budget   | | Water Heater        |
  | ~15.62 kWh / day      | | Calculated at ₹8.00/u | | 107.1% of limit       | | 180 kWh (38.4%)     |
  +-----------------------+ +-----------------------+ +-----------------------+ +-----------------------+

  +-------------------------------------------------------+ +-------------------------------------------+
  | Room-Wise Breakdown                                   | | Energy Distribution                       |
  | Room          Appliances   Monthly kWh    Est. Cost   | |                                           |
  | ----------------------------------------------------- | |           [ Chart.js Donut Chart ]        |
  | Bathroom               1      180.00      ₹1,440.00   | |                 (By Room)                 |
  | Kitchen                3      145.50      ₹1,164.00   | |                                           |
  | Living Room            4      105.00        ₹840.00   | |       Bathroom (38%)  Kitchen (31%)       |
  | Bedroom                2       38.25        ₹306.00   | |       Living Room (22%) Bedroom (9%)      |
  +-------------------------------------------------------+ +-------------------------------------------+

  +---------------------------------------------------------------------------------------------------+
  | Helpful Energy Insight                                                                            |
  | Your Water Heater contributes 38.4% of your total estimated electricity consumption.              |
  | Reducing daily geyser heating by 20 minutes could save approximately ₹320.00 per month.          |
  | [Explore in Savings Planner ->]                                                                   |
  +---------------------------------------------------------------------------------------------------+
```

---

### 4.2 Screen 2: Appliances Inventory & Preset Modal

```
======================================================================================================
[EnergySaver]                  My Home   |   Appliances   |   Reports   |   Settings       [Log Out]
======================================================================================================

  Appliances Inventory (8 items)                                             [+ Add New Appliance]
  Search: [ Search by name...   ]   Room: [ All Rooms v ]   Category: [ All Categories v ]

  +--------------------------------------------------------------------------------------------------+
  | Name          Room         Category    Power   Qty   Hours/Day  Days/Mo   Monthly kWh  Est. Cost |
  | ------------------------------------------------------------------------------------------------ |
  | Water Heater  Bathroom     Heating     2000W     1       3.0        30       180.00    ₹1,440.00 |
  | Refrigerator  Kitchen      Cooling      150W     1      12.0*       30        54.00      ₹432.00 |
  | Ceiling Fan   Living Room  Cooling       75W     2       8.0        30        36.00      ₹288.00 |
  | Television    Living Room  Entertain.   100W     1       4.0        30        12.00       ₹96.00 |
  | LED Bulbs     Bedroom      Lighting      10W     4       5.0        30         6.00       ₹48.00 |
  +--------------------------------------------------------------------------------------------------+
  * Refrigerator effective compressor hours based on 50% thermostat cycling.

  ----------------------------------------------------------------------------------------------------
  MODAL: Add Appliance
  ----------------------------------------------------------------------------------------------------
  Choose Preset: [ Ceiling Fan (75W)                         v ]
  [Badge: Sample average value. Please verify against your appliance label.]

  Appliance Name: [ Ceiling Fan                 ]
  Category:       [ Cooling                   v ]   Room: [ Living Room          v ]
  Rated Power:    [ 75    ] Watts                   Quantity: [ 2   ] units
  Daily Usage:    [ 8.0   ] Hours / Day             Days / Mo:[ 30  ] Days

  +----------------------------------------------------------------------------------+
  | LIVE PREVIEW                                                                     |
  | Daily Consumption: 1.20 kWh  |  Monthly: 36.00 kWh  |  Estimated Cost: ₹288.00/mo|
  +----------------------------------------------------------------------------------+
                                                        [Cancel]   [Save Appliance]
```

---

### 4.3 Screen 3: Savings Planner (What-If Sandbox)

```
======================================================================================================
[EnergySaver]                  My Home   |   Appliances   |   Reports   |   Settings       [Log Out]
======================================================================================================

  Savings Planner (What-If Scenario Sandbox)
  Notice: Adjusting values here will NOT modify your saved appliance records until you click "Apply".

  +--------------------------------------------------------------------------------------------------+
  | Current Baseline: 468.75 kWh | ₹3,750.00         Proposed Scenario: 423.75 kWh | ₹3,390.00       |
  | ESTIMATED MONTHLY SAVINGS: 45.00 kWh (Save ₹360.00 / month)                                       |
  +--------------------------------------------------------------------------------------------------+

  Select an appliance to adjust usage:
  Appliance: [ Water Heater (Bathroom - 2000W)                                v ]
  
  Baseline Daily Hours: 3.0 Hours / Day
  Proposed Daily Hours: [ 2.0 ] Hours / Day  <-- (Reduced by 1.0 hour / day)
  
  Changed Assumptions Summary:
  - Water Heater daily runtime reduced from 3.0h to 2.0h (-1.0h/day)
  - Estimated kWh reduced from 180.00 kWh to 120.00 kWh (-60.00 kWh/mo)
  - Estimated bill reduced from ₹3,750.00 to ₹3,270.00 (Brings you under your ₹3,500 budget!)

                                             [Discard Scenario]   [Apply Changes to Appliances]
```

---

## 5. UI Microcopy & Interaction Tone

| Context | Recommended Plain-English Copy | Unacceptable Copy to Avoid |
| :--- | :--- | :--- |
| **Dashboard Heading** | "Your home's electricity use" | "AI Energy Command Telemetry Center" |
| **Appliance Input** | "You can usually find the wattage on the silver label on the appliance." | "Input nominal rated wattage coefficient." |
| **Budget Deficit** | "You're ₹250.00 over your budget." | "CRITICAL THRESHOLD BREACH DETECTED." |
| **Saving Advice** | "Try reducing daily use by 15 minutes." | "Maximize green sustainability synergy." |
| **Actual Bill Variance** | "Your actual bill was 20 kWh higher than estimated. Common reasons include seasonal weather or unlisted appliances." | "Prediction failed due to unaccounted user error." |

---

## 6. Empty States & Feedback Patterns

1. **Dashboard (0 Appliances):**
   - Headline: *"No appliances added yet"*
   - Body: *"Add your first appliance or select a common household preset to see your estimated monthly consumption and bill."*
   - CTA: Single green button `[Add Your First Appliance]`.
2. **Filter Results (No matches):**
   - Headline: *"No appliances found in this room"*
   - Body: *"You have not assigned any appliances to 'Balcony'. Click 'Clear Filters' to view all items."*
3. **Saved Reports (0 Reports):**
   - Headline: *"No saved monthly estimates yet"*
   - Body: *"At the end of your billing cycle, click 'Save Current Estimate' to preserve an unchangeable snapshot of this month."*

---

## 7. Accessibility & Form Standards (a11y)

- **Semantic HTML:** All forms utilize `<label for="...">` explicitly matching `<input id="...">`.
- **Keyboard Navigation:** Modals trap focus; pressing `Escape` closes active dialogs; interactive elements possess clear `:focus-visible` outlines (`2px solid var(--color-primary)`).
- **Color Contrast:** All text meets or exceeds WCAG AA $4.5:1$ contrast against `--color-bg-canvas` and `--color-bg-surface`.
- **Form Validation Feedback:** Field errors are announced using `aria-describedby` pointing to error message containers.
