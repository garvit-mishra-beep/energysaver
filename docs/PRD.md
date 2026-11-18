# Product Requirements Document (PRD)

## Project: EnergySaver – Electricity Usage Analyzer
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Target Environment:** Antigravity IDE (Node.js, Express, MySQL, Vanilla HTML/CSS/JS)

---

## 1. Executive Summary & Problem Statement

### 1.1 Problem Statement
In residential households, utility providers issue a consolidated monthly electricity bill specifying total energy consumed in kilowatt-hours (kWh or "units") and the total amount due. However, this bill functions as a "black box":
1. It does not disaggregate electricity usage by appliance (e.g., water heater vs. refrigerator vs. ceiling fan vs. air conditioner).
2. Householders who notice sudden bill spikes cannot easily diagnose which appliance or usage habit caused the increase.
3. Consumers lack accessible tools to model how simple habit changes (e.g., turning off geysers 15 minutes earlier or switching television off standby) translate into financial savings.
4. Non-technical users often confuse electrical power (Watts) with energy consumed over time (kilowatt-hours), making manual estimation intimidating.

### 1.2 Proposed Solution
**EnergySaver** is a web-based educational electricity usage analyzer and budgeting application. It allows a household to build an inventory of their electrical appliances, assign wattage ratings and operating schedules, and configure electricity tariffs. 

EnergySaver translates these everyday inputs into clear metrics:
- Daily and monthly energy consumption (kWh).
- Estimated monthly expenditure and budget variance.
- Breakdown of energy consumption by individual appliance and room.
- Interactive "what-if" scenario modeling to test conservation strategies before applying changes to baseline data.
- Side-by-side reconciliation between saved estimation snapshots and actual utility bills.

---

## 2. Target Audience & Personas

| Persona | Description & Needs | Core Use Case in EnergySaver |
| :--- | :--- | :--- |
| **P1: Household Budget Manager (e.g., Priya, 34)** | Manages family monthly expenses; concerned about summer electricity bills exceeding household budget. | Enters appliance details, sets a ₹3,500 monthly budget, monitors whether estimated consumption stays within budget, and identifies which room uses the most power. |
| **P2: Energy-Conscious Student / Tech Novice (e.g., Rahul, 20)** | Living in shared student accommodation; wants to understand what "1 unit of electricity" means and why the geyser costs so much. | Uses educational presets to discover typical wattages, learns the difference between Watts and kWh, and tests how reducing geyser usage cuts bills. |
| **P3: Appliance Upgrader (e.g., Amit, 45)** | Considering replacing an aging 150W non-inverter refrigerator with a modern 80W energy-efficient model. | Uses the savings scenario / replacement tool to compare energy consumption and calculate simple financial payback periods. |

---

## 3. Goals & Non-Goals

### 3.1 Project Goals
1. **Educational Transparency:** Demystify electricity billing formulas (Watts $\rightarrow$ kWh $\rightarrow$ Tariff $\rightarrow$ Bill) with visible assumptions.
2. **Actionable Appliance Breakdown:** Provide visual disaggregation showing which individual appliances and rooms dominate household consumption.
3. **Safe "What-If" Experimentation:** Allow users to test habit changes in a scratchpad scenario that does not overwrite saved baseline data unless explicitly confirmed.
4. **Historical Reconciliation:** Enable users to store immutable monthly estimates and log actual utility bills to evaluate estimation accuracy.
5. **Academic Demonstrability:** Maintain a clean, maintainable, framework-free codebase (Node.js, Express, MySQL, Vanilla HTML/CSS/JS) that a student can clearly explain in a viva examination.

### 3.2 Non-Goals (Explicit Exclusions)
1. **No Live Hardware / IoT Integration:** EnergySaver will not interface with smart plugs, Zigbee monitors, CT clamps, or smart meters.
2. **No Automated Utility Scraping:** The system will not automatically log into power distribution company portals or scrape PDF bills.
3. **No Automated Appliance Control:** The system does not turn appliances on or off.
4. **No Definitive Diagnostics:** When estimates differ from actual bills, EnergySaver will highlight potential factors (unlisted appliances, cycling behavior, tariff changes) but will never claim absolute certainty without measured telemetry.
5. **No Multi-Household Fleet Management:** A user account corresponds to a single household in the initial releases.

---

## 4. System Assumptions & Constraints

### 4.1 Assumptions
1. **Appliance Wattage:** Appliance nameplate wattage represents maximum continuous power draw unless effective duty cycle is modeled.
2. **1 Unit = 1 kWh:** 1 electrical unit on utility bills equals 1 kilowatt-hour ($1\text{ kW}\times 1\text{ hour} = 1,000\text{ Watt-hours}$).
3. **Standard Month Length:** Core release calculations evaluate a standard 30-day billing cycle or user-specified operating days ($1 \le \text{days} \le 31$).
4. **User-Entered Tariffs:** Utility rates, fixed charges, and tax rates are user-configured; EnergySaver does not maintain an automated global tariff repository.

### 4.2 Technical Constraints
- Frontend: Vanilla HTML5, Vanilla CSS3, Vanilla ES6 JavaScript (No React, Angular, or Vue).
- Visualization: Chart.js loaded locally or via CDN.
- Backend: Node.js with Express.js (single origin serving both static UI and `/api` routes).
- Database: MySQL 8.0+ accessed strictly via `mysql2` with parameterized queries.
- Authentication: Secure HTTP-only server-side sessions with bcrypt password hashing.

---

## 5. Scope & Release Boundaries

```mermaid
graph TD
    subgraph "Core Release (Phases 1-5)"
        A[User Accounts & Auth] --> B[Appliance Inventory & Presets]
        B --> C[Flat-Rate Calculations]
        C --> D[Household Overview & Charts]
        D --> E[Budget Monitoring & Warnings]
        E --> F[What-If Scenario Sandbox]
        F --> G[Saved Immutable Reports]
        G --> H[Actual Bill Logging & Variance]
        H --> I[CSV Export & Printable Reports]
        I --> J[Contextual Educational Tips]
    end

    subgraph "Later Enhancements (Phase 6)"
        K[Progressive Tariff Slabs]
        L[Advanced Duty Cycle & Standby]
        M[Appliance Replacement Payback]
        N[Savings Target Tracker]
        O[Backup & Restore JSON]
        P[Demo Sandbox Mode]
    end

    Core Release --> Later Enhancements
```

---

## 6. Detailed Functional Requirements

### 6.1 Authentication & Account Management (AUTH)
- **REQ-AUTH-01:** System shall permit registration with unique email, display name, and password ($\ge 8$ characters).
- **REQ-AUTH-02:** System shall securely hash passwords using `bcrypt` (salt rounds $\ge 10$) before storing in MySQL.
- **REQ-AUTH-03:** System shall manage authentication via server-side session cookies (`httpOnly: true`, `sameSite: 'lax'`, `secure: production`).
- **REQ-AUTH-04:** System shall validate user ownership on all protected API routes, returning `401 Unauthorized` for unauthenticated requests and `403 Forbidden` if accessing another user's resource.
- **REQ-AUTH-05:** System shall provide account profile editing (name, preferred currency).
- **REQ-AUTH-06:** System shall provide secure password change requiring current password verification.
- **REQ-AUTH-07:** System shall provide account deletion that permanently purges all user appliances, settings, scenarios, reports, and bills via database foreign key cascades.

### 6.2 Appliance Management (APP)
- **REQ-APP-01:** System shall allow users to add appliances with fields:
  - Name (string, 1–100 chars)
  - Category (Lighting, Heating/Cooling, Kitchen, Entertainment, Cleaning, Other)
  - Room (e.g., Living Room, Bedroom, Kitchen, Bathroom, Balcony)
  - Rated Power in Watts ($1 \le \text{Watts} \le 10,000$)
  - Quantity ($1 \le Q \le 50$)
  - Daily Operating Hours ($0.1 \le H \le 24.0$)
  - Days Used in Month ($1 \le D \le 31$)
- **REQ-APP-02:** System shall provide editable presets (e.g., Ceiling Fan: 75W, LED Bulb: 10W, Refrigerator: 150W, Geyser: 2000W) clearly marked with an educational badge stating: *"Sample average values. Please check your appliance label."*
- **REQ-APP-03:** System shall display a live calculation preview in the modal/form before saving.
- **REQ-APP-04:** System shall support listing, filtering (by room and category), sorting (by name, kWh, cost), and searching appliances.
- **REQ-APP-05:** System shall support editing and deleting appliances with client-side confirmation modals.

### 6.3 Authoritative Calculations (CALC)
- **REQ-CALC-01:** System shall compute:
  $$\text{Daily kWh} = \frac{\text{Watts} \times \text{Quantity} \times \text{Daily Hours}}{1000}$$
- **REQ-CALC-02:** System shall compute:
  $$\text{Monthly kWh} = \text{Daily kWh} \times \text{Days Used in Month}$$
- **REQ-CALC-03:** System shall compute flat-rate cost:
  $$\text{Monthly Cost} = \text{Monthly kWh} \times \text{Price per kWh}$$
- **REQ-CALC-04:** Calculation logic shall reside authoritatively on the backend (`/src/services/calculator.js`). The frontend preview must execute an identical mirrored algorithm.
- **REQ-CALC-05:** Decimal calculations shall maintain full floating-point precision internally and round to 2 decimal places strictly at the display/response layer.

### 6.4 Household Overview & Budgeting (HOME & BUDG)
- **REQ-HOME-01:** Dashboard shall display:
  - Total estimated monthly consumption (kWh).
  - Total estimated monthly expenditure.
  - Active budget status and remaining balance or deficit.
  - Primary electricity consumer appliance.
  - Room-wise consumption breakdown table and donut chart.
  - Top 5 appliances bar chart.
- **REQ-BUDG-01:** User shall configure a monthly monetary budget in Settings.
- **REQ-BUDG-02:** Dashboard shall display clear visual alerts:
  - **Normal:** Estimated bill $< 80\%$ of budget (neutral/subtle styling).
  - **Warning:** Estimated bill $\ge 80\%$ and $\le 100\%$ of budget (amber banner: *"Approaching monthly budget"*).
  - **Over-Budget:** Estimated bill $> 100\%$ of budget (red banner: *"You're [Amount] over your budget"*).
- **REQ-BUDG-03:** If budget is set to 0 or null, dashboard shall prompt user to set a budget without throwing errors.

### 6.5 What-If Savings Planner (SAVE)
- **REQ-SAVE-01:** Users can open a savings scenario tool to experiment with adjusting hours, days, or wattages for existing appliances.
- **REQ-SAVE-02:** The system shall calculate side-by-side metrics:
  - Baseline kWh vs. Proposed kWh
  - Baseline Bill vs. Proposed Bill
  - Absolute kWh Saved and Currency Amount Saved
  - Summary of changed assumptions
- **REQ-SAVE-03:** Proposed modifications shall reside in a temporary session scratchpad and **must never overwrite** baseline appliance data unless user explicitly clicks "Apply Changes to Appliances".

### 6.6 Reports & Actual Bill Reconciliation (REP)
- **REQ-REP-01:** Users can save an immutable "Estimate Snapshot" for a specified month/year.
- **REQ-REP-02:** The snapshot must store a frozen JSON payload containing all appliance inputs, tariff rates, budget, calculation engine version, and resulting metrics. Subsequent changes to current appliances shall never alter past snapshots.
- **REQ-REP-03:** Users can view saved snapshots, compare any two saved snapshot months, and export appliance inventory to CSV.
- **REQ-REP-04:** Reports page shall feature a print stylesheet allowing clean PDF printing via the browser print dialog.
- **REQ-REP-05:** Users can manually log actual utility bills (Billing Start Date, Billing End Date, Billed kWh Units, Total Billed Amount, Utility Provider Name, Notes).
- **REQ-REP-06:** System shall allow comparing an actual bill against an estimate snapshot for matching dates, displaying kWh variance, cost variance, and objective educational guidance regarding possible variance causes.

### 6.7 Educational Tips (TIPS)
- **REQ-TIPS-01:** System shall render context-aware educational cards:
  - Highlighting appliances consuming $> 25\%$ of household total.
  - Reminding users to check water heater thermostat settings.
  - Explaining the difference between power (W) and energy (kWh).
- **REQ-TIPS-02:** Tips must never make unsupported absolute savings claims (e.g., *"You will save ₹1,200"*); they must quantify potential savings using the user's specific inputs.

### 6.8 Later Enhancements (ENH)
- **REQ-ENH-01 (Tiered Slabs):** Progressive tiered pricing with marginal slab rates, fixed meter fees, and percentage tax.
- **REQ-ENH-02 (Duty Cycle):** Compressor / thermostat duty cycle percentage ($1\%\text{--}100\%$) for intermittent appliances.
- **REQ-ENH-03 (Split Schedules):** Distinct weekday vs. weekend operating hours ($5 \times \text{Weekday} + 2 \times \text{Weekend}$).
- **REQ-ENH-04 (Standby Mode):** Tracking standby wattage and standby hours ($H_{\text{active}} + H_{\text{standby}} \le 24.0$).
- **REQ-ENH-05 (Replacement Payback):** Financial payback analysis: $\text{Payback (Years)} = \frac{\text{Purchase Cost}}{\text{Annual Savings}}$.
- **REQ-ENH-06 (Demo Mode):** Sandbox session preloaded with sample 2-BHK apartment data that does not touch database records.

---

## 7. Non-Functional Requirements

### 7.1 Performance & Responsiveness
- Server response times for API endpoints shall be $< 150\text{ ms}$ under local conditions.
- Frontend bundle shall remain under $150\text{ KB}$ (excluding external Chart.js library).
- Interface must be fully functional across mobile screens ($\ge 360\text{ px}$ width), tablets, and desktop displays.

### 7.2 Usability & Visual Aesthetic
- Clean, calm aesthetic: Warm off-white background (`#FBFBF9`), charcoal body typography (`#2D312E`), muted green accents (`#2E6F40`).
- No flashy marketing elements, no heavy drop shadows, no neon gradients, and no emojis in critical UI controls.
- All numbers formatted with appropriate regional thousands separators and currency symbols.

### 7.3 Security & Data Protection
- 100% parameterization of SQL queries via `mysql2/promise` to eliminate SQL injection vulnerabilities.
- Passwords hashed with `bcrypt` (10 rounds).
- Cookies flagged `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- CSRF token validation on all state-changing API endpoints (`POST`, `PUT`, `DELETE`).
- In-memory rate limiting on authentication routes (maximum 5 failed login attempts per IP per 15 minutes).

### 7.4 Accessibility (a11y)
- Contrast ratio between text and background $\ge 4.5:1$ (WCAG AA).
- All input fields must possess linked semantic `<label>` elements.
- Full keyboard navigability (visible `:focus-visible` styling).
- Color alone must not be used to convey status (e.g., budget alerts must have descriptive text icons and clear copy).

---

## 8. Measurable Success Criteria

| Metric | Target | Verification Method |
| :--- | :--- | :--- |
| **Calculation Accuracy** | 100% match with manual test vectors | Automated unit tests in `docs/TEST_PLAN.md` |
| **OWASP Core Compliance** | Zero SQLi, XSS, or Insecure Direct Object References | Manual penetration testing and code review |
| **Report Immutability** | Modifying appliances leaves previous reports 100% identical | Database verification after appliance edit |
| **Classroom Demonstration** | Complete teacher walkthrough in under 7 minutes | Execution of `docs/DEMO_GUIDE.md` |
| **Cross-Platform Responsive** | Clean layout without horizontal scrollbars on mobile & desktop | Browser DevTools verification (360px to 1920px) |
