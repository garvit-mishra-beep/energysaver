# EnergySaver — Master Academic Viva Question Bank (180+ Questions)
**Document:** `docs/ENERGYSAVER_VIVA_QUESTION_BANK.md`  
**Target Project:** EnergySaver — Electricity Usage Analyzer  
**Auditor/Author:** Senior Technical Viva Examiner & Full-Stack Architect  
**Date:** November 18, 2026  
**Audience:** B.Tech Computer Science & Engineering Final Project Examination  
**Total Questions:** 180 Curated Questions with Short Exam-Ready Answers, Detailed Explanations, and Code References.

---

# TABLE OF CONTENTS
1. [Level 1: Basic & Foundational Concepts (Q1 - Q30)](#level-1-basic--foundational-concepts)
2. [Level 2: Frontend Architecture, HTML5, CSS3 & Client JS (Q31 - Q60)](#level-2-frontend-architecture-html5-css3--client-js)
3. [Level 3: Backend Architecture, Node.js & Express (Q61 - Q100)](#level-3-backend-architecture-nodejs--express)
4. [Level 4: Relational Database, MySQL 8.0 & SQL Queries (Q101 - Q130)](#level-4-relational-database-mysql-80--sql-queries)
5. [Level 5: Web Security, OWASP & Defensive Engineering (Q131 - Q150)](#level-5-web-security-owasp--defensive-engineering)
6. [Level 6: Project-Specific Advanced Architecture & Viva Traps (Q151 - Q180)](#level-6-project-specific-advanced-architecture--viva-traps)

---

## LEVEL 1: BASIC & FOUNDATIONAL CONCEPTS

#### Q1: What is EnergySaver in simple terms?
- **Short Answer:** EnergySaver is a full-stack educational web application that helps households track appliance-level electricity consumption, estimate monthly bills, simulate savings scenarios, and reconcile estimates with actual utility bills.
- **Detailed Explanation:** Utility providers issue a single aggregated monthly bill without breaking down costs per appliance. EnergySaver bridges this gap by calculating daily/monthly kilowatt-hours and rupee costs based on rated wattages, quantities, and operating hours.
- **Reference:** `README.md`, `docs/PRD.md`
- **Difficulty:** Level 1 (Basic)

#### Q2: What problem does your project solve?
- **Short Answer:** It solves the "black-box utility bill" problem where families do not know which specific appliances are driving up their electricity expenses.
- **Detailed Explanation:** Without granular appliance visibility, consumers cannot make informed budgeting decisions. EnergySaver identifies the highest consuming appliances and models the financial impact of small operational changes.
- **Reference:** `docs/PRD.md`
- **Difficulty:** Level 1 (Basic)

#### Q3: Does EnergySaver measure live electricity consumption using IoT hardware?
- **Short Answer:** No. It is an educational mathematical modeling tool that computes estimates based on manufacturer ratings and user operating hours, not physical IoT sensors.
- **Detailed Explanation:** This is an explicit design boundary. IoT hardware increases cost and hardware dependencies; EnergySaver focuses on algorithmic auditing and budgeting accessible via standard web browsers.
- **Reference:** `README.md` §1
- **Difficulty:** Level 1 (Basic)

#### Q4: What is the technology stack of EnergySaver?
- **Short Answer:** Frontend: Semantic HTML5, Vanilla CSS3, Vanilla ES6 JavaScript, Chart.js. Backend: Node.js, Express.js. Database: MySQL 8.0 with InnoDB.
- **Detailed Explanation:** It is a single-origin monolith without heavy frontend frameworks (no React, Angular, or Vite), ensuring high performance, lean dependencies, and easy viva defense.
- **Reference:** `package.json`, `README.md` §3
- **Difficulty:** Level 1 (Basic)

#### Q5: Why did you choose Vanilla JavaScript instead of React or Angular?
- **Short Answer:** To keep the project lightweight, eliminate complex build tooling, understand core DOM APIs from scratch, and ensure zero-friction local browser execution.
- **Detailed Explanation:** Modern frameworks introduce heavy toolchains (Webpack/Vite/transpilers) that obscure fundamental web mechanics. Vanilla ES6 demonstrates pure JavaScript mastery, native event delegation, and clean architectural separation.
- **Reference:** `AGENTS.md` §1.2
- **Difficulty:** Level 1 (Basic)

#### Q6: Why did you choose MySQL over MongoDB?
- **Short Answer:** Because household energy data is inherently relational: users own settings and appliances, snapshots have child items, and foreign keys with ON DELETE CASCADE guarantee data integrity.
- **Detailed Explanation:** MongoDB lacks rigid schema constraints by default. MySQL 8.0 provides ACID compliance, strong typed columns, foreign key cascade deletion, and CHECK constraints for numerical ranges.
- **Reference:** `docs/DATABASE.md`
- **Difficulty:** Level 1 (Basic)

#### Q7: What is the unit of electrical energy used for billing?
- **Short Answer:** The kilowatt-hour (kWh), commonly called one "unit" of electricity in India.
- **Detailed Explanation:** 1 kilowatt-hour equals 1000 watts of power consumed continuously for 1 hour: $1	ext{ kWh} = 1000	ext{ W} 	imes 1	ext{ h} = 3,600,000	ext{ Joules}$.
- **Reference:** `docs/CALCULATIONS.md`
- **Difficulty:** Level 1 (Basic)

#### Q8: What is the formula for calculating daily energy consumption?
- **Short Answer:** $	ext{Daily kWh} = (	ext{Rated Watts} 	imes 	ext{Quantity} 	imes 	ext{Daily Hours}) / 1000$.
- **Detailed Explanation:** Watts multiplied by hours gives watt-hours. Dividing by 1000 converts watt-hours to kilowatt-hours.
- **Reference:** `src/services/calculator.js` line 34 (`calculateDailyKwh`)
- **Difficulty:** Level 1 (Basic)

#### Q9: What is the formula for estimated monthly electricity cost?
- **Short Answer:** $	ext{Monthly Cost} = 	ext{Monthly kWh} 	imes 	ext{Electricity Tariff Rate}$.
- **Detailed Explanation:** Monthly kWh is computed by multiplying daily kWh by active operating days per month (default 30). This total is then multiplied by the flat tariff rate (default ₹8.00/kWh).
- **Reference:** `src/services/calculator.js` line 70 (`calculateFlatCost`)
- **Difficulty:** Level 1 (Basic)

#### Q10: What is the difference between power and energy?
- **Short Answer:** Power is the instantaneous rate of electricity consumption measured in Watts (W); Energy is the total power consumed over a duration of time measured in Watt-hours (Wh) or Kilowatt-hours (kWh).
- **Detailed Explanation:** A 1500W air conditioner has a power rating of 1.5 kW. If it runs for 4 hours, it consumes $1.5	ext{ kW} 	imes 4	ext{ h} = 6	ext{ kWh}$ of energy.
- **Reference:** `docs/CALCULATIONS.md`
- **Difficulty:** Level 1 (Basic)

#### Q11: What are the two storage modes supported by EnergySaver?
- **Short Answer:** Guest Demo Mode (runs in browser localStorage) and Authenticated Database Mode (persists in MySQL 8.0).
- **Detailed Explanation:** Guests can walk through a pre-populated 2-BHK apartment scenario without registering. When a user registers and signs in, the application seamlessly switches to MySQL persistence.
- **Reference:** `public/js/dashboard.js` line 80 (`initializeDashboard`)
- **Difficulty:** Level 1 (Basic)

#### Q12: How does the application identify which mode it is running in?
- **Short Answer:** By calling `GET /api/auth/me` on startup. If it returns HTTP 200 with user data, the app runs in Database Mode; if HTTP 401, it runs in Demo Mode.
- **Detailed Explanation:** The frontend updates a visible status badge in the header: "Database Mode (MySQL)" or "Demo Storage Mode (Browser LocalStorage)".
- **Reference:** `public/js/nav.js` line 66, `public/js/dashboard.js` line 113
- **Difficulty:** Level 1 (Basic)

#### Q13: What is the What-If Savings Planner?
- **Short Answer:** A sandbox feature where users adjust appliance operating hours using tactile sliders to preview potential monthly energy and rupee savings before committing changes.
- **Detailed Explanation:** It calls `POST /api/savings/simulate` to compute comparison deltas in memory without modifying saved database records.
- **Reference:** `public/js/savings-modal.js`, `src/controllers/savingsController.js`
- **Difficulty:** Level 1 (Basic)

#### Q14: What is an immutable report snapshot?
- **Short Answer:** A permanent historical record that freezes the user's appliance inventory, tariff rate, and computed bill for a given month so future edits do not alter past records.
- **Detailed Explanation:** Stored across `report_snapshots` (header) and `report_snapshot_items` (frozen appliance copies). Even if an appliance is later deleted, the snapshot remains historically exact.
- **Reference:** `src/controllers/reportController.js` line 48 (`saveSnapshot`)
- **Difficulty:** Level 1 (Basic)

#### Q15: What is utility bill reconciliation?
- **Short Answer:** A feature that compares a saved estimated snapshot against a real utility provider bill, computing kilowatt-hour and cost differences.
- **Detailed Explanation:** It displays variance delta pills (e.g. $+17.2	ext{ kWh} (+5.33%)$ Higher) and presents an educational checklist explaining potential real-world variances.
- **Reference:** `src/controllers/reportController.js` line 456 (`reconcileBill`)
- **Difficulty:** Level 1 (Basic)

#### Q16: What is a single-origin monolith?
- **Short Answer:** An architecture where the same Node.js Express server delivers both static frontend files (HTML/CSS/JS) and backend API endpoints from the exact same origin (port 3000).
- **Detailed Explanation:** Eliminates Cross-Origin Resource Sharing (CORS) complexity, avoids cross-site cookie blocking, and simplifies local deployment.
- **Reference:** `src/app.js` line 186
- **Difficulty:** Level 1 (Basic)

#### Q17: What port does the EnergySaver server run on?
- **Short Answer:** Port 3000 by default (configurable via the `PORT` environment variable in `.env`).
- **Detailed Explanation:** Managed in `src/config/index.js` and started in `src/server.js` via `app.listen(config.port)`.
- **Reference:** `src/server.js` line 12
- **Difficulty:** Level 1 (Basic)

#### Q18: What is the default electricity tariff rate in EnergySaver?
- **Short Answer:** ₹8.00 per kilowatt-hour (₹8.00 / unit).
- **Detailed Explanation:** Defined as the default in `sql/schema.sql` on `user_settings.electricity_rate` and fallback in `src/controllers/applianceController.js`.
- **Reference:** `sql/schema.sql` line 23
- **Difficulty:** Level 1 (Basic)

#### Q19: What is the default monthly electricity budget target?
- **Short Answer:** ₹3,500.00 per month.
- **Detailed Explanation:** Set in `sql/schema.sql` on `user_settings.monthly_budget`. Users can customize this in the Settings screen.
- **Reference:** `sql/schema.sql` line 24
- **Difficulty:** Level 1 (Basic)

#### Q20: What are the three budget alert states?
- **Short Answer:** NORMAL (spending $< 80%$), APPROACHING_BUDGET ($80% - 100%$), and OVER_BUDGET ($> 100%$).
- **Detailed Explanation:** Computed in `calculateHouseholdTotals` in `src/services/calculator.js` line 184 and rendered visually on the dashboard.
- **Reference:** `src/services/calculator.js` line 184
- **Difficulty:** Level 1 (Basic)

#### Q21: What is the purpose of the presets catalog?
- **Short Answer:** To give users one-click starting templates for common household appliances (e.g., Inverter AC 1500W, Refrigerator 250W, Ceiling Fan 75W).
- **Detailed Explanation:** Stored in `public/js/utils/presets.js`. Selecting a preset automatically fills form fields with realistic technical defaults that the user can freely edit.
- **Reference:** `public/js/utils/presets.js`
- **Difficulty:** Level 1 (Basic)

#### Q22: Can a user export their appliance inventory?
- **Short Answer:** Yes, via the CSV Export button on the Reports page, which streams a sanitized `.csv` file from the server.
- **Detailed Explanation:** Implemented in `GET /api/reports/export-csv` with formula injection defense to prevent spreadsheet exploits.
- **Reference:** `src/controllers/reportController.js` line 568
- **Difficulty:** Level 1 (Basic)

#### Q23: What npm command initializes the database?
- **Short Answer:** `npm run db:init`.
- **Detailed Explanation:** Executes `src/scripts/initDb.js`, which reads `sql/schema.sql` and applies all table definitions idempotently using `CREATE TABLE IF NOT EXISTS`.
- **Reference:** `package.json` line 10, `src/scripts/initDb.js`
- **Difficulty:** Level 1 (Basic)

#### Q24: What npm command checks database connectivity?
- **Short Answer:** `npm run db:check`.
- **Detailed Explanation:** Executes `src/scripts/dbCheck.js`, which attempts a connection to MySQL and queries `SELECT 1` to verify credentials without modifying data.
- **Reference:** `src/scripts/dbCheck.js`
- **Difficulty:** Level 1 (Basic)

#### Q25: What npm command runs all automated tests?
- **Short Answer:** `npm test`.
- **Detailed Explanation:** Runs 7 test suites sequentially covering backend health, authentication, security, appliance CRUD, dashboard calculations, and mathematical precision (347 assertions).
- **Reference:** `package.json` line 19
- **Difficulty:** Level 1 (Basic)

#### Q26: What npm command runs the headless browser E2E test suite?
- **Short Answer:** `npm run test:e2e`.
- **Detailed Explanation:** Executes `test/post_redesign_audit.test.js`, launching headless Chrome via Chrome DevTools Protocol (CDP) to verify 6 viewports and 12 user steps.
- **Reference:** `package.json` line 18, `test/post_redesign_audit.test.js`
- **Difficulty:** Level 1 (Basic)

#### Q27: How is user registration authenticated?
- **Short Answer:** Using salted bcrypt password hashing with 10 salt rounds and persistent server-side sessions stored in MySQL.
- **Detailed Explanation:** Implemented in `authController.register`. Passwords are never stored in plaintext.
- **Reference:** `src/controllers/authController.js` line 78
- **Difficulty:** Level 1 (Basic)

#### Q28: What is CSRF and why does EnergySaver protect against it?
- **Short Answer:** Cross-Site Request Forgery is an attack where a malicious website tricks a user's browser into submitting unauthorized requests to a site where they are logged in.
- **Detailed Explanation:** EnergySaver requires an `X-CSRF-Token` header for every state-changing request (POST, PUT, DELETE), validated using constant-time comparison.
- **Reference:** `src/middleware/security.js` line 40
- **Difficulty:** Level 1 (Basic)

#### Q29: What is Zero-Trust IDOR protection?
- **Short Answer:** Insecure Direct Object Reference defense ensuring that every query modifying or reading records explicitly filters by `WHERE user_id = req.session.userId`.
- **Detailed Explanation:** Prevents User A from viewing, editing, or deleting User B's appliances, snapshots, or bills by guessing numeric record IDs.
- **Reference:** `src/controllers/applianceController.js` line 163
- **Difficulty:** Level 1 (Basic)

#### Q30: What is the Zero Silent Commits policy?
- **Short Answer:** A core UX principle where moving sliders or editing preview inputs updates calculations in real time on the screen but never writes to the database until the user explicitly clicks a save or apply button.
- **Detailed Explanation:** Prevents accidental overwrites of saved appliance records while users experiment with hypothetical usage scenarios.
- **Reference:** `test/post_redesign_audit.test.js` Step 5
- **Difficulty:** Level 1 (Basic)

---

## LEVEL 2: FRONTEND ARCHITECTURE, HTML5, CSS3 & CLIENT JS

#### Q31: How is the frontend structured without a framework?
- **Short Answer:** Using semantic HTML5 pages (`index.html`, `appliances.html`, etc.), modular CSS tokens, and vanilla ES6 JavaScript modules that interact with the backend via native `fetch()`.
- **Detailed Explanation:** State is managed via central storage controllers (`storage.js` for demo mode, `api.js` for authenticated mode). Components register DOM event listeners to handle user actions.
- **Reference:** `public/js/`
- **Difficulty:** Level 2 (Frontend)

#### Q32: What design system does EnergySaver use?
- **Short Answer:** The Option B: Warm Minimalist Editorial Design System.
- **Detailed Explanation:** Characterized by an oatmeal canvas (`#F9F6F0`), botanical ink text (`#1C2420`), forest green accents (`#2E6F40`), editorial serif headlines (`Newsreader`), and a signature floating bottom navigation pill.
- **Reference:** `public/css/editorial-tokens.css`, `public/css/editorial-theme.css`
- **Difficulty:** Level 2 (Frontend)

#### Q33: How is responsive design implemented across viewports?
- **Short Answer:** Using CSS Grid, Flexbox, fluid typography, and media queries at standard breakpoints: 360px, 768px, 1024px, and 1440px.
- **Detailed Explanation:** Appliance card grid uses `repeat(auto-fit, minmax(0, 1fr))` transitioning from 1 column on mobile to 2 on tablet, 3 on laptop, and 6 on desktop.
- **Reference:** `public/css/editorial-theme.css`
- **Difficulty:** Level 2 (Frontend)

#### Q34: How does the continuous 24px segmented room breakdown bar work?
- **Short Answer:** It is a single flexbox container where child segments represent rooms; their widths are set dynamically via inline CSS `flex-basis: X%` based on each room's share of total energy.
- **Detailed Explanation:** Rendered by `renderRoomBreakdown` in `public/js/dashboard.js`. Colors are assigned per room: Living Room (Moss `#2E6F40`), Kitchen (Terracotta `#C86D51`), Bedrooms (Ochre `#E2A856`), Study (Slate `#6B8E9B`).
- **Reference:** `public/js/dashboard.js` line 362
- **Difficulty:** Level 2 (Frontend)

#### Q35: How does the floating bottom navigation work?
- **Short Answer:** A fixed position pill (`position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%)`) containing quick navigation icons and labels.
- **Detailed Explanation:** Rendered by `renderFloatingNavigation` in `editorial-navigation.js`. Highlights the active page, has a high z-index (1000), and includes full ARIA navigation landmarks.
- **Reference:** `public/js/components/editorial-navigation.js`
- **Difficulty:** Level 2 (Frontend)

#### Q36: How are appliance vector illustrations generated?
- **Short Answer:** Programmatically via `getApplianceSvg(category, name)` in `public/js/components/appliance-illustrations.js`.
- **Detailed Explanation:** Returns clean inline SVG line-art with beige fills (`#F3EFE6`) and botanical ink strokes (`#1C2420`) for 10 appliance types (AC, fridge, fan, heater, TV, etc.).
- **Reference:** `public/js/components/appliance-illustrations.js` line 194
- **Difficulty:** Level 2 (Frontend)

#### Q37: How do tactile sliders achieve zero-latency preview?
- **Short Answer:** By listening to the native `input` event on the range slider, computing instantaneous metrics with client-side `calculator.js`, and updating the text label immediately without network requests.
- **Detailed Explanation:** The `input` event fires synchronously on every tick of slider movement. The card estimates update instantly while leaving the database untouched.
- **Reference:** `public/js/dashboard.js` line 520
- **Difficulty:** Level 2 (Frontend)

#### Q38: What is the difference between `input` and `change` events on a slider?
- **Short Answer:** `input` fires continuously as the slider thumb is dragged; `change` fires only after the user releases the slider thumb.
- **Detailed Explanation:** EnergySaver uses `input` for instantaneous zero-latency visual feedback on estimated daily costs.
- **Reference:** `public/js/dashboard.js`
- **Difficulty:** Level 2 (Frontend)

#### Q39: How does Chart.js render charts offline?
- **Short Answer:** By loading a locally bundled copy of Chart.js (`public/js/vendor/chart.umd.min.js`) rather than relying exclusively on a remote CDN.
- **Detailed Explanation:** Ensures 100% functionality during offline academic evaluations or disconnected presentations.
- **Reference:** `public/js/vendor/chart.umd.min.js`
- **Difficulty:** Level 2 (Frontend)

#### Q40: What types of charts are rendered on the dashboard?
- **Short Answer:** A Donut Chart for room energy distribution and a Horizontal Bar Chart for top 5 energy-consuming appliances.
- **Detailed Explanation:** Created using `new Chart(ctx, config)` in `public/js/dashboard.js`, customized with the project's editorial color palette.
- **Reference:** `public/js/dashboard.js` lines 600-680
- **Difficulty:** Level 2 (Frontend)

#### Q41: How does modal dialog focus and escape dismissal work?
- **Short Answer:** Modals listen for the keyboard `keydown` event; if `e.key === 'Escape'`, the modal immediately removes the `is-open` class and restores focus.
- **Detailed Explanation:** Implemented across `appliances.js`, `savings-modal.js`, and `reports.js`, complying with WCAG 2.1 modal dialog accessibility criteria.
- **Reference:** `public/js/appliances.js` line 492
- **Difficulty:** Level 2 (Frontend)

#### Q42: What is the purpose of `public/js/api.js`?
- **Short Answer:** It is the centralized client API gateway that manages all HTTP communication, handles CSRF tokens, and returns structured data.
- **Detailed Explanation:** Wraps `fetch()` in an internal `request()` helper, automatically attaching `X-CSRF-Token` and JSON headers, and parsing uniform error envelopes.
- **Reference:** `public/js/api.js` line 40
- **Difficulty:** Level 2 (Frontend)

#### Q43: How does `public/js/api.js` fetch and cache the CSRF token?
- **Short Answer:** When a state-changing request is made and no token is in memory, it calls `GET /api/csrf-token`, caches the token string, and attaches it as `X-CSRF-Token`.
- **Detailed Explanation:** If a subsequent request returns a CSRF error, the cached token is invalidated so a fresh token is requested automatically.
- **Reference:** `public/js/api.js` line 20 (`getCsrfToken`)
- **Difficulty:** Level 2 (Frontend)

#### Q44: What is the role of `public/js/storage.js`?
- **Short Answer:** It manages the Guest Demo Mode state stored in the browser's `localStorage`.
- **Detailed Explanation:** Implements methods like `getAppliances()`, `saveAppliance()`, `getSettings()`, pre-populating a sample 2-BHK apartment scenario for unauthenticated visitors.
- **Reference:** `public/js/storage.js`
- **Difficulty:** Level 2 (Frontend)

#### Q45: How does EnergySaver sanitize user inputs to prevent DOM XSS?
- **Short Answer:** By running all user-generated strings through `EnergyFormatters.escapeHtml()` before interpolating them into HTML templates.
- **Detailed Explanation:** Uses regex replacement encoding `&`, `<`, `>`, `"`, and `'` into HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`).
- **Reference:** `public/js/utils/formatters.js` line 57
- **Difficulty:** Level 2 (Frontend)

#### Q46: Why is innerHTML dangerous and how does your project use it safely?
- **Short Answer:** `innerHTML` parses raw HTML; if unescaped user strings contain `<script>` or event attributes, malicious scripts can execute (XSS).
- **Detailed Explanation:** EnergySaver neutralizes this by either using `textContent` or strictly passing user data through `escapeHtml()` before concatenating.
- **Reference:** `public/js/utils/formatters.js`
- **Difficulty:** Level 2 (Frontend)

#### Q47: How does room filtering work on the Appliances page?
- **Short Answer:** Filter pills (`All Rooms`, `Living Room`, `Kitchen`, etc.) filter the appliance array in memory and re-render the table rows without refreshing the page.
- **Detailed Explanation:** In database mode, it can also pass `?room=X` to `GET /api/appliances` for server-filtered results.
- **Reference:** `public/js/appliances.js` line 127 (`applyFiltersAndRender`)
- **Difficulty:** Level 2 (Frontend)

#### Q48: How does the search bar filter appliances?
- **Short Answer:** By listening to the `input` event on the search box and filtering appliances where `appliance.name.toLowerCase().includes(query)`.
- **Detailed Explanation:** Re-renders the table dynamically with matching items or an empty search state if no matches exist.
- **Reference:** `public/js/appliances.js` line 257
- **Difficulty:** Level 2 (Frontend)

#### Q49: What is the purpose of `EnergyFormatters.formatCurrency()`?
- **Short Answer:** Formats numbers into standardized currency strings with symbol and 2 decimal places (e.g. `₹2,480.00`).
- **Detailed Explanation:** Uses `Intl.NumberFormat` or manual comma formatting based on locale rules.
- **Reference:** `public/js/utils/formatters.js` line 20
- **Difficulty:** Level 2 (Frontend)

#### Q50: What is the purpose of `EnergyFormatters.formatKwh()`?
- **Short Answer:** Formats energy numbers into clean strings ending with "kWh" (e.g. `120.50 kWh`).
- **Detailed Explanation:** Formats the number to 2 decimal places and appends the unit suffix.
- **Reference:** `public/js/utils/formatters.js` line 34
- **Difficulty:** Level 2 (Frontend)

#### Q51: How is client-side form validation handled?
- **Short Answer:** Form inputs validate on submit and blur; invalid fields highlight with red borders and inline error messages while blocking submission.
- **Detailed Explanation:** Implemented via `showFieldError(input, message)` and `clearFieldError(input)` in `appliances.js` and `auth.js`.
- **Reference:** `public/js/appliances.js` line 467
- **Difficulty:** Level 2 (Frontend)

#### Q52: What is event delegation and where is it used?
- **Short Answer:** Attaching a single event listener to a parent element to handle events triggered by current or future child elements using `e.target.closest()`.
- **Detailed Explanation:** Used in `public/js/appliances.js` on the table body to handle edit and delete button clicks for dynamically generated table rows.
- **Reference:** `public/js/appliances.js` line 178 (`setupTableActions`)
- **Difficulty:** Level 2 (Frontend)

#### Q53: What is the purpose of the print stylesheet (`print.css`)?
- **Short Answer:** Optimizes pages for printing or saving as PDF by hiding navigation pills, buttons, and backgrounds while expanding reports to full width.
- **Detailed Explanation:** Activated via `@media print`, formatting snapshot tables neatly on A4 paper.
- **Reference:** `public/css/print.css`
- **Difficulty:** Level 2 (Frontend)

#### Q54: How does the password visibility toggle work?
- **Short Answer:** Clicking the eye icon toggles the input's `type` attribute between `"password"` and `"text"`.
- **Detailed Explanation:** Handled in `setupPasswordVisibilityToggles` in `public/js/auth.js`.
- **Reference:** `public/js/auth.js` line 15
- **Difficulty:** Level 2 (Frontend)

#### Q55: What CSS variables define the primary colors?
- **Short Answer:** `--bg-editorial: #F9F6F0`, `--ink-editorial: #1C2420`, `--accent-forest: #2E6F40`, `--accent-terracotta: #C86D51`.
- **Detailed Explanation:** Declared in `:root` in `public/css/editorial-tokens.css` and referenced throughout stylesheets for consistency.
- **Reference:** `public/css/editorial-tokens.css`
- **Difficulty:** Level 2 (Frontend)

#### Q56: How does the frontend handle empty states?
- **Short Answer:** When a user has 0 appliances, the dashboard and appliances table render clean empty state cards with an "Add Appliance" call-to-action button.
- **Detailed Explanation:** Rendered by `renderEmptyState()` in `dashboard.js` line 214.
- **Reference:** `public/js/dashboard.js` line 214
- **Difficulty:** Level 2 (Frontend)

#### Q57: How does the What-If savings modal update its live delta pill?
- **Short Answer:** As the slider moves, it calculates savings and updates the delta pill text: e.g. "Save ₹480.00 / month" in green, or "Costs ₹120.00 / month more" in red.
- **Detailed Explanation:** Updates in `updateSimulationDisplay()` in `public/js/savings-modal.js`.
- **Reference:** `public/js/savings-modal.js` line 220
- **Difficulty:** Level 2 (Frontend)

#### Q58: What is semantic HTML and which semantic tags are used?
- **Short Answer:** HTML tags that convey meaning about their content: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Detailed Explanation:** EnergySaver avoids generic `<div>` soup, using `<nav>` for floating pills, `<section>` for report blocks, and `<table>` for tabular records.
- **Reference:** `public/index.html`
- **Difficulty:** Level 2 (Frontend)

#### Q59: How does the frontend prevent horizontal scrollbar overflow on mobile?
- **Short Answer:** By enforcing `minmax(0, 1fr)` on CSS Grid columns and `min-width: 0` on card containers and range sliders.
- **Detailed Explanation:** Verified across all 6 viewports with 0px horizontal overflow in our automated CDP test suite.
- **Reference:** `public/css/editorial-theme.css`
- **Difficulty:** Level 2 (Frontend)

#### Q60: What happens on the frontend when the backend API returns an error?
- **Short Answer:** The API client catches the error and throws an Error with the message returned from the server's error envelope, which the UI displays via alert or toast.
- **Detailed Explanation:** Implemented in `public/js/api.js` line 84.
- **Reference:** `public/js/api.js` line 84
- **Difficulty:** Level 2 (Frontend)

---

## LEVEL 3: BACKEND ARCHITECTURE, NODE.JS & EXPRESS

#### Q61: What is Node.js?
- **Short Answer:** An open-source, cross-platform JavaScript runtime environment built on Google Chrome's V8 engine that allows developers to run JavaScript on the server.
- **Detailed Explanation:** Uses an event-driven, non-blocking I/O model that makes it lightweight and efficient for handling concurrent HTTP requests and database operations.
- **Reference:** `src/server.js`
- **Difficulty:** Level 3 (Backend)

#### Q62: What is Express.js?
- **Short Answer:** A minimal and flexible web application framework for Node.js that provides routing, middleware support, and HTTP utility methods.
- **Detailed Explanation:** Used in EnergySaver to organize routes, parse JSON bodies, manage cookies, and mount security middleware.
- **Reference:** `src/app.js` line 26 (`createApp`)
- **Difficulty:** Level 3 (Backend)

#### Q63: What is the purpose of `src/server.js` versus `src/app.js`?
- **Short Answer:** `app.js` is the Express application factory that configures middleware and routes; `server.js` is the entry point that starts the HTTP network listener on port 3000.
- **Detailed Explanation:** Separating `app.js` from `server.js` allows automated test suites (like Supertest or custom runners) to import `app` without binding real network ports.
- **Reference:** `src/server.js`, `src/app.js`
- **Difficulty:** Level 3 (Backend)

#### Q64: What is graceful shutdown and how is it implemented?
- **Short Answer:** A process where the server stops accepting new connections, finishes in-flight requests, cleanly closes the MySQL pool, and exits without data corruption.
- **Detailed Explanation:** Handled in `gracefulShutdown()` in `src/server.js` listening for `SIGTERM` and `SIGINT` with a 10-second forced termination timeout.
- **Reference:** `src/server.js` line 29
- **Difficulty:** Level 3 (Backend)

#### Q65: What is middleware in Express?
- **Short Answer:** A function with access to the request object (`req`), response object (`res`), and the `next` function in the application’s request-response cycle.
- **Detailed Explanation:** Middleware can execute code, modify `req`/`res`, end the request-response cycle, or call `next()` to pass control to the next middleware.
- **Reference:** `src/middleware/`
- **Difficulty:** Level 3 (Backend)

#### Q66: What does `next()` do in Express?
- **Short Answer:** It calls the next middleware function in the routing pipeline.
- **Detailed Explanation:** If `next()` is called with an argument (`next(err)`), Express skips remaining non-error middleware and jumps straight to the global error handler.
- **Reference:** `src/middleware/errorHandler.js` line 28
- **Difficulty:** Level 3 (Backend)

#### Q67: How does the global error handler work?
- **Short Answer:** An Express error middleware with 4 arguments `(err, req, res, next)` that catches all uncaught exceptions, logs the error, and returns a sanitized JSON response.
- **Detailed Explanation:** In production, it hides raw stack traces from clients to avoid information disclosure.
- **Reference:** `src/middleware/errorHandler.js` line 28 (`globalErrorHandler`)
- **Difficulty:** Level 3 (Backend)

#### Q68: What is the 404 handler in your application?
- **Short Answer:** `apiNotFoundHandler`, mounted after all routes to catch any request matching an undefined URL and return a uniform JSON 404 error envelope.
- **Detailed Explanation:** Prevents Express from emitting default HTML error pages for API consumers.
- **Reference:** `src/middleware/errorHandler.js` line 11
- **Difficulty:** Level 3 (Backend)

#### Q69: What is the purpose of `express.json({ limit: '100kb' })`?
- **Short Answer:** It parses incoming request bodies with JSON payloads and enforces a conservative 100 KB size ceiling to prevent payload denial-of-service attacks.
- **Detailed Explanation:** Rejects oversized request payloads with HTTP 413 Payload Too Large.
- **Reference:** `src/app.js` line 58
- **Difficulty:** Level 3 (Backend)

#### Q70: How does connection pooling work in `mysql2/promise`?
- **Short Answer:** It maintains a pool of pre-established reusable database connections, eliminating the overhead of opening and closing connections for every HTTP request.
- **Detailed Explanation:** Configured in `src/config/database.js` via `mysql.createPool()` with `connectionLimit: 10`. Queries execute via `pool.execute()`.
- **Reference:** `src/config/database.js` line 15
- **Difficulty:** Level 3 (Backend)

#### Q71: What is the difference between `pool.query()` and `pool.execute()`?
- **Short Answer:** `pool.execute()` prepares the SQL statement on the MySQL server (prepared statement) before binding parameters; `pool.query()` does client-side string escaping.
- **Detailed Explanation:** Prepared statements (`execute`) provide superior performance for repeated queries and maximum protection against SQL injection.
- **Reference:** `src/controllers/applianceController.js`
- **Difficulty:** Level 3 (Backend)

#### Q72: How does `express-session` work with MySQL?
- **Short Answer:** It issues a cryptographically signed cookie (`energysaver_sid`) to the browser, while the actual session data (user ID, CSRF token) is stored in the MySQL `sessions` table.
- **Detailed Explanation:** Managed by `express-mysql-session`. On every request, the session ID from the cookie is looked up in the `sessions` table.
- **Reference:** `src/app.js` line 64
- **Difficulty:** Level 3 (Backend)

#### Q73: Why is `saveUninitialized: false` configured in session options?
- **Short Answer:** To prevent storing empty, unauthenticated sessions in the database for visitors who simply browse the site without logging in.
- **Detailed Explanation:** Reduces database load and prevents session store bloat from search crawlers or casual visitors.
- **Reference:** `src/app.js` line 95
- **Difficulty:** Level 3 (Backend)

#### Q74: Why is `resave: false` configured in session options?
- **Short Answer:** To avoid resaving the session back to the database if it was never modified during the request.
- **Detailed Explanation:** Eliminates unnecessary SQL UPDATE queries on the `sessions` table.
- **Reference:** `src/app.js` line 94
- **Difficulty:** Level 3 (Backend)

#### Q75: What cookie security flags are configured?
- **Short Answer:** `httpOnly: true`, `sameSite: 'lax'`, and `secure: isProduction`.
- **Detailed Explanation:** `httpOnly` prevents JavaScript from reading the cookie (protecting against XSS cookie theft); `sameSite: 'lax'` blocks cross-site cookie transmission (mitigating CSRF).
- **Reference:** `src/config/index.js` line 46
- **Difficulty:** Level 3 (Backend)

#### Q76: What is Helmet and what does it do?
- **Short Answer:** A security middleware package that sets secure HTTP response headers (Content Security Policy, X-Content-Type-Options, X-Frame-Options).
- **Detailed Explanation:** Helps protect the app from clickjacking, MIME-type sniffing, and cross-site scripting attacks.
- **Reference:** `src/app.js` line 36
- **Difficulty:** Level 3 (Backend)

#### Q77: What is Content Security Policy (CSP)?
- **Short Answer:** An HTTP header that restricts which scripts, styles, images, and fonts the browser is permitted to load and execute.
- **Detailed Explanation:** Configured in Helmet to permit scripts from `'self'` and `https://cdn.jsdelivr.net` (for Chart.js), while blocking unauthorized third-party scripts.
- **Reference:** `src/app.js` line 37
- **Difficulty:** Level 3 (Backend)

#### Q78: What does `X-Frame-Options: SAMEORIGIN` do?
- **Short Answer:** Prevents external websites from embedding EnergySaver inside an `<iframe>`, defeating Clickjacking attacks.
- **Detailed Explanation:** Configured via Helmet in `src/app.js`.
- **Reference:** `src/app.js` line 36
- **Difficulty:** Level 3 (Backend)

#### Q79: What does `X-Content-Type-Options: nosniff` do?
- **Short Answer:** Instructs the browser to strictly adhere to the declared `Content-Type` header and not attempt to guess or sniff the MIME type.
- **Detailed Explanation:** Prevents script execution disguised as image files or text files.
- **Reference:** `src/app.js` line 36
- **Difficulty:** Level 3 (Backend)

#### Q80: How does the liveness probe (`/health/live`) work?
- **Short Answer:** Returns HTTP 200 with server status `"UP"` and uptime seconds if the Node process is running.
- **Detailed Explanation:** Used by orchestrators and monitoring tools to determine if the process is alive.
- **Reference:** `src/app.js` line 101
- **Difficulty:** Level 3 (Backend)

#### Q81: How does the readiness probe (`/health/ready`) work?
- **Short Answer:** Performs an active query against MySQL; returns HTTP 200 `"READY"` if database is connected, or HTTP 503 `"UNAVAILABLE"` if disconnected.
- **Detailed Explanation:** Verifies whether the application is fully capable of serving traffic dependent on the database.
- **Reference:** `src/app.js` line 109
- **Difficulty:** Level 3 (Backend)

#### Q82: How does `dotenv` load configuration?
- **Short Answer:** Reads the `.env` file in the project root and injects the defined key-value pairs into `process.env`.
- **Detailed Explanation:** Executed in `src/config/index.js` via `dotenv.config({ path: ... })`.
- **Reference:** `src/config/index.js` line 11
- **Difficulty:** Level 3 (Backend)

#### Q83: How does `src/config/index.js` handle missing secrets in production?
- **Short Answer:** It strictly enforces that `SESSION_SECRET` is defined and at least 32 characters long; otherwise, it logs a fatal error and terminates the process (`process.exit(1)`).
- **Detailed Explanation:** Prevents deployment with weak or default development secrets.
- **Reference:** `src/config/index.js` line 18
- **Difficulty:** Level 3 (Backend)

#### Q84: How is asynchronous code handled in backend controllers?
- **Short Answer:** Using `async/await` syntax with `try/catch` blocks; errors in `catch` are passed to `next(err)` for centralized handling.
- **Detailed Explanation:** Ensures that unhandled Promise rejections do not crash the Node.js process.
- **Reference:** `src/controllers/authController.js`
- **Difficulty:** Level 3 (Backend)

#### Q85: What is the Node.js Event Loop?
- **Short Answer:** A single-threaded loop that monitors the call stack and offloads I/O tasks (file reading, network calls, database queries) to the OS kernel or thread pool, executing callbacks when ready.
- **Detailed Explanation:** Allows Node.js to achieve high concurrency without creating a separate operating system thread for each incoming connection.
- **Reference:** `src/server.js`
- **Difficulty:** Level 3 (Backend)

#### Q86: What is the standardized JSON response envelope used across all API endpoints?
- **Short Answer:** Success: `{ "success": true, "data": { ... } }`; Error: `{ "success": false, "error": { "code": "...", "message": "..." } }`.
- **Detailed Explanation:** Ensures consistent contract consumption across client fetch wrappers.
- **Reference:** `src/middleware/errorHandler.js`, `public/js/api.js`
- **Difficulty:** Level 3 (Backend)

#### Q87: How does `applianceController.createAppliance` validate inputs?
- **Short Answer:** By calling `validateApplianceInput(body)`, which verifies name (1-100), category, room, watts (1-10000), quantity (1-50), hours (0.1-24), and days (1-31).
- **Detailed Explanation:** Returns `{ valid: false, field, message }` if any check fails, resulting in HTTP 400.
- **Reference:** `src/controllers/applianceController.js` line 17
- **Difficulty:** Level 3 (Backend)

#### Q88: How does `applianceController.updateAppliance` verify ownership?
- **Short Answer:** By executing `UPDATE appliances SET ... WHERE id = ? AND user_id = ?`.
- **Detailed Explanation:** If `affectedRows === 0`, the server returns HTTP 404, preventing unauthorized updates.
- **Reference:** `src/controllers/applianceController.js` line 290
- **Difficulty:** Level 3 (Backend)

#### Q89: How does `applianceController.deleteAppliance` verify ownership?
- **Short Answer:** By executing `DELETE FROM appliances WHERE id = ? AND user_id = ?`.
- **Detailed Explanation:** Returns HTTP 404 if no rows match both the ID and user ID.
- **Reference:** `src/controllers/applianceController.js` line 348
- **Difficulty:** Level 3 (Backend)

#### Q90: What does `applianceController.previewAppliance` do?
- **Short Answer:** Calculates daily kWh, monthly kWh, and monthly cost for a set of input parameters without saving anything to the database.
- **Detailed Explanation:** Used by the client to get an authoritative server-calculated preview.
- **Reference:** `src/controllers/applianceController.js` line 371
- **Difficulty:** Level 3 (Backend)

#### Q91: What does `dashboardController.getSummary` return?
- **Short Answer:** An aggregated object containing total appliances, monthly kWh, estimated bill, budget variance, budget status, top consumer, and room breakdown.
- **Detailed Explanation:** Invokes `calculator.calculateHouseholdTotals()`.
- **Reference:** `src/controllers/dashboardController.js` line 16
- **Difficulty:** Level 3 (Backend)

#### Q92: What does `savingsController.simulateSavings` do?
- **Short Answer:** Clones the user's appliance list in memory, applies proposed runtime modifications, computes delta savings, and returns the result without writing to MySQL.
- **Detailed Explanation:** Uses `calculator.calculateScenarioDelta()`.
- **Reference:** `src/controllers/savingsController.js` line 64
- **Difficulty:** Level 3 (Backend)

#### Q93: What does `savingsController.applySavings` do?
- **Short Answer:** Executes UPDATE queries on `appliances` in MySQL to commit the proposed daily hours permanently.
- **Detailed Explanation:** Enforces `WHERE id = ? AND user_id = ?` on each update.
- **Reference:** `src/controllers/savingsController.js` line 148
- **Difficulty:** Level 3 (Backend)

#### Q94: How does `reportController.saveSnapshot` use a transaction?
- **Short Answer:** It obtains a connection, calls `beginTransaction()`, inserts the parent snapshot, bulk-inserts frozen child items, and calls `commit()`.
- **Detailed Explanation:** If an error occurs, it calls `rollback()` to prevent partial or orphaned data.
- **Reference:** `src/controllers/reportController.js` line 84
- **Difficulty:** Level 3 (Backend)

#### Q95: How does `reportController.reconcileBill` detect date mismatches?
- **Short Answer:** Compares `snapshot.period_start === bill.billing_start_date` and `snapshot.period_end === bill.billing_end_date`.
- **Detailed Explanation:** If dates differ, it sets `dates_match: false` in the response so the UI displays an educational notice.
- **Reference:** `src/controllers/reportController.js` line 517
- **Difficulty:** Level 3 (Backend)

#### Q96: How does `reportController.exportCsv` prevent formula injection?
- **Short Answer:** By running every string cell through `sanitizeCsvCell()`, which prepends a single quote (`'`) if the cell begins with `=`, `+`, `-`, or `@`.
- **Detailed Explanation:** Prevents spreadsheet software from evaluating user input as executable formulas.
- **Reference:** `src/controllers/reportController.js` line 31
- **Difficulty:** Level 3 (Backend)

#### Q97: What does `settingsController.getSettings` return?
- **Short Answer:** Returns the user's tariff rate, monthly budget, currency symbol, and tariff type from `user_settings`.
- **Detailed Explanation:** Automatically initializes default settings if none exist.
- **Reference:** `src/controllers/settingsController.js` line 13
- **Difficulty:** Level 3 (Backend)

#### Q98: What does `settingsController.updateSettings` validate?
- **Short Answer:** Validates that `electricity_rate > 0`, `monthly_budget >= 0`, and currency symbol is valid.
- **Detailed Explanation:** Updates `user_settings` in MySQL.
- **Reference:** `src/controllers/settingsController.js` line 71
- **Difficulty:** Level 3 (Backend)

#### Q99: What does `authController.changePassword` do?
- **Short Answer:** Verifies the user's current password with `bcrypt.compare()`, hashes the new password with `bcrypt.hash()`, and updates `password_hash` in MySQL.
- **Detailed Explanation:** Rejects if current password does not match or new password is $< 8$ chars.
- **Reference:** `src/controllers/authController.js` line 338
- **Difficulty:** Level 3 (Backend)

#### Q100: What does `authController.deleteAccount` do?
- **Short Answer:** Permanently deletes the user record from MySQL (`DELETE FROM users WHERE id = ?`), which cascade-deletes all child tables, and destroys the active session.
- **Detailed Explanation:** Guarantees GDPR "Right to Erasure" compliance.
- **Reference:** `src/controllers/authController.js` line 410
- **Difficulty:** Level 3 (Backend)

---

## LEVEL 4: RELATIONAL DATABASE, MYSQL 8.0 & SQL QUERIES

#### Q101: What storage engine is used in MySQL and why?
- **Short Answer:** InnoDB.
- **Detailed Explanation:** InnoDB is MySQL's ACID-compliant transactional storage engine supporting row-level locking, foreign key constraints, and crash recovery.
- **Reference:** `sql/schema.sql`
- **Difficulty:** Level 4 (Database)

#### Q102: What character set and collation are configured?
- **Short Answer:** Character set `utf8mb4` and collation `utf8mb4_unicode_ci`.
- **Detailed Explanation:** Supports the full Unicode spectrum including emojis and international characters (like the Indian Rupee symbol ₹).
- **Reference:** `sql/schema.sql`
- **Difficulty:** Level 4 (Database)

#### Q103: What are the 7 tables in the database schema?
- **Short Answer:** `users`, `user_settings`, `appliances`, `report_snapshots`, `report_snapshot_items`, `actual_bills`, and `sessions`.
- **Detailed Explanation:** Verified in `sql/schema.sql` lines 1-116.
- **Reference:** `sql/schema.sql`
- **Difficulty:** Level 4 (Database)

#### Q104: What is the relationship between `users` and `user_settings`?
- **Short Answer:** One-to-One (1:1).
- **Detailed Explanation:** Every user has exactly one settings row, enforced by `user_id INT NOT NULL UNIQUE` in `user_settings`.
- **Reference:** `sql/schema.sql` line 22
- **Difficulty:** Level 4 (Database)

#### Q105: What is the relationship between `users` and `appliances`?
- **Short Answer:** One-to-Many (1:N).
- **Detailed Explanation:** One user can own multiple appliance inventory records.
- **Reference:** `sql/schema.sql` line 37
- **Difficulty:** Level 4 (Database)

#### Q106: What is the relationship between `report_snapshots` and `report_snapshot_items`?
- **Short Answer:** One-to-Many (1:N).
- **Detailed Explanation:** One snapshot header contains multiple frozen child appliance item records.
- **Reference:** `sql/schema.sql` line 77
- **Difficulty:** Level 4 (Database)

#### Q107: What does `ON DELETE CASCADE` do?
- **Short Answer:** If a parent row is deleted, all foreign-key-linked child rows are automatically deleted by the database.
- **Detailed Explanation:** If a user row is deleted, MySQL automatically purges their settings, appliances, snapshots, and bills without orphaned rows.
- **Reference:** `sql/schema.sql` line 29, 47, 70, 87, 102
- **Difficulty:** Level 4 (Database)

#### Q108: Why is `DECIMAL` used instead of `FLOAT` for ratings and costs?
- **Short Answer:** `DECIMAL` is an exact fixed-point numerical type, whereas `FLOAT` is an approximate binary floating-point type subject to rounding inaccuracies.
- **Detailed Explanation:** Currency and billing metrics require exact precision; using FLOAT can cause 1-paisa discrepancies.
- **Reference:** `sql/schema.sql` line 23 (`DECIMAL(8,4)`)
- **Difficulty:** Level 4 (Database)

#### Q109: What CHECK constraints are enforced in `appliances`?
- **Short Answer:** Watts: $0 < W le 10000$, Qty: $1 le Q le 50$, Hours: $0.1 le H le 24.0$, Days: $1 le D le 31$.
- **Detailed Explanation:** Declared in `sql/schema.sql` lines 48-51.
- **Reference:** `sql/schema.sql` lines 48-51
- **Difficulty:** Level 4 (Database)

#### Q110: What indexes exist on the `appliances` table?
- **Short Answer:** `PRIMARY KEY (id)`, `idx_appliances_user (user_id)`, `idx_appliances_room (user_id, room)`, `idx_appliances_category (user_id, category)`.
- **Detailed Explanation:** Accelerates queries filtering by room or category for a specific user.
- **Reference:** `sql/schema.sql` lines 52-54
- **Difficulty:** Level 4 (Database)

#### Q111: What is a composite index?
- **Short Answer:** An index that covers multiple columns together in a specific order (e.g., `(user_id, room)`).
- **Detailed Explanation:** Allows MySQL to find matching records for a specific user and room in a single index lookup without evaluating individual rows.
- **Reference:** `sql/schema.sql` line 53
- **Difficulty:** Level 4 (Database)

#### Q112: What does the `sessions` table store?
- **Short Answer:** `session_id` (PK), `expires` (timestamp integer), and `data` (serialized session JSON containing userId and csrfToken).
- **Detailed Explanation:** Managed by `express-mysql-session`.
- **Reference:** `sql/schema.sql` lines 110-116
- **Difficulty:** Level 4 (Database)

#### Q113: Why is `session_id` declared with `COLLATE utf8mb4_bin`?
- **Short Answer:** To enforce case-sensitive matching of cryptographic session identifiers.
- **Detailed Explanation:** Standard collation is case-insensitive; binary collation ensures `abc` and `ABC` are treated as completely distinct session keys.
- **Reference:** `sql/schema.sql` line 111
- **Difficulty:** Level 4 (Database)

#### Q114: What is SQL Injection?
- **Short Answer:** An attack where malicious SQL code is injected into user inputs, manipulating query structure to view or modify unauthorized data.
- **Detailed Explanation:** e.g. passing `' OR '1'='1` into an email field.
- **Reference:** `docs/SECURITY.md`
- **Difficulty:** Level 4 (Database)

#### Q115: How does EnergySaver eliminate SQL Injection?
- **Short Answer:** By using 100% parameterized queries via prepared statements (`pool.execute(query, params)`).
- **Detailed Explanation:** Parameters are sent separately from the SQL statement; MySQL treats user input strictly as literal values, never as executable code.
- **Reference:** `src/controllers/applianceController.js`
- **Difficulty:** Level 4 (Database)

#### Q116: What is a database transaction?
- **Short Answer:** A logical unit of work that contains one or more SQL statements executed as all-or-nothing (Atomicity).
- **Detailed Explanation:** Used in `saveSnapshot` to guarantee that snapshot header and child items are inserted together.
- **Reference:** `src/controllers/reportController.js` line 84
- **Difficulty:** Level 4 (Database)

#### Q117: What are the four commands that control a transaction?
- **Short Answer:** `START TRANSACTION` (or `beginTransaction`), `COMMIT`, `ROLLBACK`, and `SAVEPOINT`.
- **Detailed Explanation:** In Node.js: `conn.beginTransaction()`, `conn.commit()`, and `conn.rollback()`.
- **Reference:** `src/controllers/reportController.js`
- **Difficulty:** Level 4 (Database)

#### Q118: How does `initDb.js` create the schema without data loss?
- **Short Answer:** By executing `CREATE TABLE IF NOT EXISTS` statements.
- **Detailed Explanation:** If tables already exist, MySQL skips creation and leaves existing rows untouched.
- **Reference:** `src/scripts/initDb.js`
- **Difficulty:** Level 4 (Database)

#### Q119: What is the purpose of `DATE_FORMAT(period_start, '%Y-%m-%d')` in queries?
- **Short Answer:** Formats SQL DATE fields into standardized ISO date strings (`YYYY-MM-DD`) directly in the database engine.
- **Detailed Explanation:** Avoids timezone shifting and inconsistent client-side JavaScript date parsing.
- **Reference:** `src/controllers/reportController.js` line 243
- **Difficulty:** Level 4 (Database)

#### Q120: How is referential integrity maintained between snapshots and snapshot items?
- **Short Answer:** By the foreign key `fk_snapshot_items_parent` referencing `report_snapshots(id) ON DELETE CASCADE`.
- **Detailed Explanation:** If a snapshot header is deleted, all its frozen appliance items are automatically removed.
- **Reference:** `sql/schema.sql` line 87
- **Difficulty:** Level 4 (Database)

#### Q121: What is the purpose of the 100-appliance ceiling query?
- **Short Answer:** To cap the maximum number of appliances a user can store, preventing resource exhaustion attacks.
- **Detailed Explanation:** Runs `SELECT COUNT(*) FROM appliances WHERE user_id = ?` before permitting an insertion.
- **Reference:** `src/controllers/applianceController.js` line 211
- **Difficulty:** Level 4 (Database)

#### Q122: What happens if two users register with the same email?
- **Short Answer:** The unique key constraint `UNIQUE (email)` in the `users` table rejects the second insert, throwing an `ER_DUP_ENTRY` error.
- **Detailed Explanation:** The backend catches this and returns HTTP 409 Conflict with code `EMAIL_EXISTS`.
- **Reference:** `src/controllers/authController.js` line 112
- **Difficulty:** Level 4 (Database)

#### Q123: Why is `updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` used?
- **Short Answer:** MySQL automatically updates the timestamp column whenever any row attribute changes.
- **Detailed Explanation:** Eliminates the need to manually pass `updated_at = NOW()` in UPDATE queries.
- **Reference:** `sql/schema.sql` line 15
- **Difficulty:** Level 4 (Database)

#### Q124: What permissions does the application MySQL user require?
- **Short Answer:** Data Manipulation Language (DML) permissions only: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
- **Detailed Explanation:** Adheres to the Principle of Least Privilege; runtime application users should not possess DDL privileges (`DROP`, `ALTER`).
- **Reference:** `audit/deep_audit/DEEP_ISSUE_REGISTER.md` (ISS-DEEP-06)
- **Difficulty:** Level 4 (Database)

#### Q125: How does the server verify database readiness before startup?
- **Short Answer:** Calls `checkConnection()` in `src/config/database.js`, which executes `SELECT 1` on the connection pool.
- **Detailed Explanation:** If it succeeds, the database is marked reachable; if it fails, a warning is logged while keeping demo mode testable.
- **Reference:** `src/config/database.js` line 37
- **Difficulty:** Level 4 (Database)

#### Q126: What is database normalization and what normal form does EnergySaver satisfy?
- **Short Answer:** Database normalization organizes data to reduce redundancy and improve data integrity; EnergySaver satisfies 3rd Normal Form (3NF).
- **Detailed Explanation:** Every non-key attribute depends strictly on the primary key, whole key, and nothing but the key.
- **Reference:** `docs/DATABASE.md`
- **Difficulty:** Level 4 (Database)

#### Q127: Why are snapshot items duplicated instead of linking to `appliances.id`?
- **Short Answer:** Because appliances can be edited or deleted later; linking by ID would cause past reports to change or break when appliances change.
- **Detailed Explanation:** Freezing a separate copy in `report_snapshot_items` guarantees historical immutability.
- **Reference:** `src/controllers/reportController.js` line 118
- **Difficulty:** Level 4 (Database)

#### Q128: What is a deadlock and how does EnergySaver prevent deadlocks?
- **Short Answer:** When two transactions block each other by holding locks the other needs; EnergySaver executes short transactions with consistent row update ordering.
- **Detailed Explanation:** Transactions are scoped strictly to snapshot creation and finish in milliseconds.
- **Reference:** `src/controllers/reportController.js`
- **Difficulty:** Level 4 (Database)

#### Q129: What is the purpose of `sql/seed.sql`?
- **Short Answer:** Contains sample data representing a typical 2-BHK Indian apartment (AC, fridge, ceiling fans, water heater, TV) for testing.
- **Detailed Explanation:** Can be imported for manual development verification.
- **Reference:** `sql/seed.sql`
- **Difficulty:** Level 4 (Database)

#### Q130: How does account deletion cascade to actual bills?
- **Short Answer:** `actual_bills` defines `CONSTRAINT fk_actual_bills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`.
- **Detailed Explanation:** Deleting the user row automatically cascades deletion to all logged bills.
- **Reference:** `sql/schema.sql` line 102
- **Difficulty:** Level 4 (Database)

---

## LEVEL 5: WEB SECURITY, OWASP & DEFENSIVE ENGINEERING

#### Q131: What is bcrypt and how does it work?
- **Short Answer:** An adaptive password-hashing function based on the Blowfish cipher that incorporates a salt and configurable work factor to protect against brute-force attacks.
- **Detailed Explanation:** EnergySaver uses `bcrypt` with 10 salt rounds ($2^{10} = 1024$ key expansion iterations), making offline rainbow table and dictionary attacks computationally infeasible.
- **Reference:** `src/controllers/authController.js` line 124
- **Difficulty:** Level 5 (Security)

#### Q132: What is a cryptographic salt?
- **Short Answer:** A random string added to the password before hashing so that two users with the same password produce completely different hashes.
- **Detailed Explanation:** Defeats precomputed rainbow table attacks.
- **Reference:** `src/controllers/authController.js`
- **Difficulty:** Level 5 (Security)

#### Q133: What is the difference between hashing and encryption?
- **Short Answer:** Hashing is a one-way cryptographic function (cannot be decrypted); encryption is a two-way function that can be decrypted with a secret key.
- **Detailed Explanation:** Passwords must be hashed, never encrypted.
- **Reference:** `docs/SECURITY.md`
- **Difficulty:** Level 5 (Security)

#### Q134: What is Session Fixation and how is it prevented?
- **Short Answer:** An attack where an attacker sets a victim's session ID before login; EnergySaver prevents it by calling `regenerateSession()` immediately upon registration and login.
- **Detailed Explanation:** Generates a completely new session ID upon authentication, invalidating pre-login session keys.
- **Reference:** `src/controllers/authController.js` line 41
- **Difficulty:** Level 5 (Security)

#### Q135: What is Cross-Site Request Forgery (CSRF)?
- **Short Answer:** An exploit where an unauthorized command is transmitted from a user that the web application trusts.
- **Detailed Explanation:** Mitigated by requiring an `X-CSRF-Token` header on all state-mutating requests, validated via `csrfProtection`.
- **Reference:** `src/middleware/security.js` line 40
- **Difficulty:** Level 5 (Security)

#### Q136: How does the CSRF token mechanism work end-to-end?
- **Short Answer:** The client fetches a 32-byte hex token from `GET /api/csrf-token`, stores it in memory, and sends it in the `X-CSRF-Token` header with every POST/PUT/DELETE request. The server compares it against the session copy.
- **Detailed Explanation:** Compares using `crypto.timingSafeEqual()` to prevent timing attacks.
- **Reference:** `src/middleware/security.js` line 60
- **Difficulty:** Level 5 (Security)

#### Q137: What is a timing attack and what is `crypto.timingSafeEqual`?
- **Short Answer:** A side-channel attack where an attacker measures the execution time of string comparison to guess secret tokens byte by byte.
- **Detailed Explanation:** Standard `===` exits on the first mismatched character; `timingSafeEqual` always compares every byte, taking constant time regardless of where mismatches occur.
- **Reference:** `src/middleware/security.js` line 65
- **Difficulty:** Level 5 (Security)

#### Q138: What is Insecure Direct Object Reference (IDOR)?
- **Short Answer:** A vulnerability where an attacker accesses or modifies another user's records simply by changing an ID parameter in the request (e.g. `DELETE /api/appliances/5`).
- **Detailed Explanation:** EnergySaver defends against IDOR by always verifying `WHERE id = ? AND user_id = req.session.userId`.
- **Reference:** `src/controllers/applianceController.js` line 290
- **Difficulty:** Level 5 (Security)

#### Q139: What is Cross-Site Scripting (XSS) and what types exist?
- **Short Answer:** An attack where malicious JavaScript is injected into web pages viewed by other users: Stored XSS, Reflected XSS, and DOM-based XSS.
- **Detailed Explanation:** Mitigated by attribute-safe HTML entity escaping in `formatters.js` and Helmet Content Security Policy.
- **Reference:** `public/js/utils/formatters.js` line 57
- **Difficulty:** Level 5 (Security)

#### Q140: How does `formatters.js` prevent attribute-context XSS?
- **Short Answer:** By escaping quotes: `"` to `&quot;` and `'` to `&#39;` using regex character replacement.
- **Detailed Explanation:** Prevents attribute breakout attacks when user strings are placed inside HTML attributes like `onclick="openModal('${app.id}')"`.
- **Reference:** `public/js/utils/formatters.js` line 57
- **Difficulty:** Level 5 (Security)

#### Q141: What is CSV Formula Injection (CSV Injection)?
- **Short Answer:** An exploit where cells beginning with `=`, `+`, `-`, or `@` execute arbitrary formulas or commands when opened in Microsoft Excel.
- **Detailed Explanation:** EnergySaver's `sanitizeCsvCell()` prepends a single quote (`'`) to neutralize formula triggers.
- **Reference:** `src/controllers/reportController.js` line 31
- **Difficulty:** Level 5 (Security)

#### Q142: How does the login rate limiter protect against brute-force attacks?
- **Short Answer:** It counts failed login attempts per IP address; after 5 failures in 15 minutes, it blocks subsequent requests with HTTP 429 Too Many Requests.
- **Detailed Explanation:** Implemented in `src/middleware/security.js` line 103.
- **Reference:** `src/middleware/security.js` line 103
- **Difficulty:** Level 5 (Security)

#### Q143: How is the rate limiter's memory leak hazard prevented?
- **Short Answer:** A periodic background cleanup timer sweeps the in-memory Map every 5 minutes and deletes expired IP records.
- **Detailed Explanation:** Prevents unbounded memory growth during distributed IP scans.
- **Reference:** `src/middleware/security.js` line 86
- **Difficulty:** Level 5 (Security)

#### Q144: What are the security benefits of `HttpOnly` cookies?
- **Short Answer:** Client-side JavaScript cannot read or access the session cookie, neutralizing session theft via Cross-Site Scripting (XSS).
- **Detailed Explanation:** Even if an attacker finds an XSS vulnerability, they cannot execute `document.cookie` to steal the session key.
- **Reference:** `src/config/index.js` line 46
- **Difficulty:** Level 5 (Security)

#### Q145: What does `SameSite=Lax` do?
- **Short Answer:** Restricts cookie sending on cross-site requests, protecting against Cross-Site Request Forgery (CSRF).
- **Detailed Explanation:** The cookie is only sent on top-level safe navigations (like following a link), not on third-party POST requests.
- **Reference:** `src/config/index.js` line 47
- **Difficulty:** Level 5 (Security)

#### Q146: Why is user enumeration prevented on the login endpoint?
- **Short Answer:** The login endpoint returns identical error messages and status codes (HTTP 401 `INVALID_CREDENTIALS`) whether the email does not exist or the password is wrong.
- **Detailed Explanation:** Prevents attackers from harvesting valid user email addresses.
- **Reference:** `src/controllers/authController.js` line 199
- **Difficulty:** Level 5 (Security)

#### Q147: How does EnergySaver adhere to the Zero Secrets in Code rule?
- **Short Answer:** All sensitive credentials (database passwords, session secrets) are loaded strictly from environment variables via `.env`, and `.env` is ignored by version control.
- **Detailed Explanation:** An authoritative template `.env.example` provides safe placeholders without real secrets.
- **Reference:** `.gitignore`, `.env.example`
- **Difficulty:** Level 5 (Security)

#### Q148: What is Clickjacking and how is it prevented?
- **Short Answer:** An attack where a malicious site embeds a transparent iframe of another application to trick users into clicking buttons; prevented by Helmet's `X-Frame-Options: SAMEORIGIN`.
- **Detailed Explanation:** Browsers reject loading EnergySaver inside foreign iframes.
- **Reference:** `src/app.js` line 36
- **Difficulty:** Level 5 (Security)

#### Q149: What is MIME-type sniffing and how is it prevented?
- **Short Answer:** When a browser ignores the declared Content-Type and treats text or image files as executable scripts; prevented by `X-Content-Type-Options: nosniff`.
- **Detailed Explanation:** Configured automatically via Helmet.
- **Reference:** `src/app.js` line 36
- **Difficulty:** Level 5 (Security)

#### Q150: What is the Principle of Least Privilege?
- **Short Answer:** A security concept where every module, user, or process is granted only the minimum permissions necessary to perform its legitimate function.
- **Detailed Explanation:** In EnergySaver, the runtime MySQL application user possesses DML privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) and zero DDL permissions.
- **Reference:** `audit/deep_audit/DEEP_ISSUE_REGISTER.md`
- **Difficulty:** Level 5 (Security)

---

## LEVEL 6: PROJECT-SPECIFIC ADVANCED ARCHITECTURE & VIVA TRAPS

#### Q151: What happens if a student moves a slider on the dashboard and then reloads the page?
- **Short Answer:** The slider returns to its saved database value, and the temporary preview cost disappears. Zero changes are committed to the database.
- **Detailed Explanation:** This proves our Zero Silent Commits policy. Moving a slider triggers only a client-side preview; updates require opening the edit modal and clicking submit.
- **Reference:** `test/post_redesign_audit.test.js` Step 5
- **Difficulty:** Level 6 (Advanced)

#### Q152: How did you fix the cumulative 1-paisa rounding discrepancy in the calculation engine?
- **Short Answer:** By subtracting unrounded baseline and proposed totals first, and applying rounding strictly to the final delta: `rawSavedCost = unroundedBaseline - unroundedProposed`.
- **Detailed Explanation:** Previously, subtracting already rounded figures could introduce a 1-paisa or 0.01 kWh variance due to IEEE-754 representation limits.
- **Reference:** `src/services/calculator.js` line 240 (`calculateScenarioDelta`)
- **Difficulty:** Level 6 (Advanced)

#### Q153: Why do we use `Number(Math.round(Number(val + 'e' + decimals)) + 'e-' + decimals)` in `roundTo`?
- **Short Answer:** Exponential-shift half-up rounding prevents binary floating-point representation anomalies (e.g. `1.005.toFixed(2)` returning `"1.00"` instead of `"1.01"`).
- **Detailed Explanation:** Shifting the decimal point via scientific notation ensures exact mathematical half-up rounding.
- **Reference:** `src/services/calculator.js` line 21
- **Difficulty:** Level 6 (Advanced)

#### Q154: Walk through the exact steps of creating an immutable report snapshot.
- **Short Answer:** Validate period dates $\rightarrow$ calculate current totals $\rightarrow$ acquire connection $\rightarrow$ begin transaction $\rightarrow$ insert parent `report_snapshots` $\rightarrow$ insert child `report_snapshot_items` $\rightarrow$ commit transaction $\rightarrow$ release connection.
- **Detailed Explanation:** If any query fails, rollback executes. This guarantees atomic consistency across tables.
- **Reference:** `src/controllers/reportController.js` lines 48-183
- **Difficulty:** Level 6 (Advanced)

#### Q155: What happens if User B sends a request to `DELETE /api/actual-bills/1` where bill 1 belongs to User A?
- **Short Answer:** The query executes `DELETE FROM actual_bills WHERE id = 1 AND user_id = 2`. MySQL deletes 0 rows (`affectedRows === 0`), and the server responds with HTTP 404 Not Found.
- **Detailed Explanation:** User B receives no indication of whether bill 1 exists, completely mitigating IDOR.
- **Reference:** `src/controllers/reportController.js` line 431
- **Difficulty:** Level 6 (Advanced)

#### Q156: How does the application prevent duplicate appliance IDs in a savings simulation?
- **Short Answer:** `validateModifications()` inserts IDs into a JavaScript `Set` and verifies `idSet.has(mod.id)`. If a duplicate is found, it throws HTTP 400.
- **Detailed Explanation:** Prevents corrupted scenarios where the same appliance is modified multiple times in one payload.
- **Reference:** `src/controllers/savingsController.js` line 25
- **Difficulty:** Level 6 (Advanced)

#### Q157: What is the purpose of `calculation_version: 'v1.0'` in report snapshots?
- **Short Answer:** It records which mathematical formula version was active when the snapshot was generated, allowing backward compatibility if tariff calculation algorithms evolve in future phases.
- **Detailed Explanation:** Prepares the schema for Phase 6 progressive tiered slab algorithms without breaking historical flat-rate snapshot records.
- **Reference:** `sql/schema.sql` line 68
- **Difficulty:** Level 6 (Advanced)

#### Q158: Explain the complete lifecycle of a login request from button click to UI update.
- **Short Answer:** User clicks submit $\rightarrow$ auth.js intercepts event $\rightarrow$ api.js attaches CSRF token $\rightarrow$ Express parses body $\rightarrow$ rate limiter checks IP $\rightarrow$ authController verifies bcrypt hash $\rightarrow$ session regenerates in MySQL $\rightarrow$ cookie sent $\rightarrow$ client redirects to index.html.
- **Detailed Explanation:** Full step-by-step trace covered in Part 5 call graphs.
- **Reference:** `public/js/auth.js`, `src/controllers/authController.js`
- **Difficulty:** Level 6 (Advanced)

#### Q159: What is the 100-appliance ceiling and why is it necessary?
- **Short Answer:** A safeguard that prevents users from adding more than 100 appliances to their inventory, protecting the server from memory bloat and CPU exhaustion during aggregation.
- **Detailed Explanation:** Mitigates CWE-770 (Allocation of Resources Without Limits or Throttling).
- **Reference:** `src/controllers/applianceController.js` line 211
- **Difficulty:** Level 6 (Advanced)

#### Q160: What happens when a user deletes their account?
- **Short Answer:** The user row is deleted from `users`. Through MySQL foreign key cascading, all user settings, appliances, snapshots, snapshot items, and utility bills are deleted, and their session is destroyed.
- **Detailed Explanation:** Tested in `test/phase3.test.js` Step 7 and `test/stage0.test.js`.
- **Reference:** `src/controllers/authController.js` line 410
- **Difficulty:** Level 6 (Advanced)

#### Q161: Why does `post_redesign_audit.test.js` use Chrome DevTools Protocol (CDP)?
- **Short Answer:** To perform real headless browser automation and render tests without requiring external testing framework dependencies like Puppeteer or Cypress.
- **Detailed Explanation:** Directly connects to Chrome's debugging WebSocket port to evaluate JavaScript, inspect DOM element geometry, resize viewports, and capture screenshots.
- **Reference:** `test/post_redesign_audit.test.js` line 60
- **Difficulty:** Level 6 (Advanced)

#### Q162: What was the root cause of the reconciliation error on `date_match` in earlier audits?
- **Short Answer:** The backend returned `{ success: true, data: { dates_match, period, estimate, actual, variance } }`, but the frontend unpacked `{ snapshot, bill, reconciliation }`, causing `reconciliation` to be undefined.
- **Detailed Explanation:** Resolved by normalizing the response envelope in `public/js/reports.js` to unpack `res.data.variance` and `res.data.dates_match`.
- **Reference:** `public/js/reports.js` line 550
- **Difficulty:** Level 6 (Advanced)

#### Q163: Why does the system support non-standard monthly days (e.g. 15 days/month)?
- **Short Answer:** Because many household appliances do not run every single day (e.g., washing machines run ~12 days/month, garden pumps run alternate days).
- **Detailed Explanation:** Formula: $	ext{Monthly kWh} = 	ext{Daily kWh} 	imes 	ext{days_used_per_month}$, providing realistic domestic energy auditing.
- **Reference:** `src/services/calculator.js` line 53
- **Difficulty:** Level 6 (Advanced)

#### Q164: How does EnergySaver handle compressor duty cycles in intermittent appliances?
- **Short Answer:** In the core release, entered daily hours represent effective compressor run-time; educational tooltips and disclosures in the UI explain this assumption to users.
- **Detailed Explanation:** A 24-hour refrigerator does not draw full power continuously; its compressor cycles on for roughly 6–8 hours equivalent. Phase 6 plans automated duty cycle percentage modeling.
- **Reference:** `public/index.html`, `docs/CALCULATIONS.md`
- **Difficulty:** Level 6 (Advanced)

#### Q165: What is the difference between client-side `calculator.js` and server-side `calculator.js`?
- **Short Answer:** Client-side calculator provides zero-latency instant visual previews while typing; server-side calculator is the single authoritative source of truth for all database records.
- **Detailed Explanation:** Prevents client tampering from persisting corrupted or malicious calculations in MySQL.
- **Reference:** `public/js/utils/calculator.js`, `src/services/calculator.js`
- **Difficulty:** Level 6 (Advanced)

#### Q166: How does the application prevent session fixation on user registration?
- **Short Answer:** By calling `await regenerateSession(req)` before binding `req.session.userId = newUserId`.
- **Detailed Explanation:** Ensures that anonymous session keys created before registration cannot be hijacked after authentication.
- **Reference:** `src/controllers/authController.js` line 147
- **Difficulty:** Level 6 (Advanced)

#### Q167: What prevents an attacker from brute-forcing passwords with rotating IP addresses?
- **Short Answer:** Rate limiting per IP is the first layer of defense; the second layer is bcrypt's computational cost ($work factor = 10$), which slows down automated attempts even across multiple IPs.
- **Detailed Explanation:** In addition, session regeneration and strong password complexity policies prevent rapid dictionary cracking.
- **Reference:** `src/middleware/security.js`, `src/controllers/authController.js`
- **Difficulty:** Level 6 (Advanced)

#### Q168: Why does the backend reject appliance daily hours greater than 24.0?
- **Short Answer:** Because there are only 24 hours in a day; operating hours greater than 24 are physically impossible for a single appliance.
- **Detailed Explanation:** Enforced by both server validation and MySQL CHECK constraint `chk_appliance_hours`.
- **Reference:** `src/controllers/applianceController.js` line 64
- **Difficulty:** Level 6 (Advanced)

#### Q169: What is the purpose of `res.setHeader('Retry-After', retrySec)` in rate limiting?
- **Short Answer:** It informs the client or automated agent exactly how many seconds they must wait before attempting another login request.
- **Detailed Explanation:** Standard HTTP 429 compliance.
- **Reference:** `src/middleware/security.js` line 118
- **Difficulty:** Level 6 (Advanced)

#### Q170: How does EnergySaver handle database disconnection while the server is running?
- **Short Answer:** The readiness probe (`/health/ready`) begins returning HTTP 503 Service Unavailable, and API requests return structured database error envelopes.
- **Detailed Explanation:** Guests can still test the interface in Phase 1 Demo Mode via localStorage.
- **Reference:** `src/app.js` line 119
- **Difficulty:** Level 6 (Advanced)

#### Q171: What is the purpose of `.gitattributes` in this project?
- **Short Answer:** Enforces automatic line-ending normalization (`eol=lf`) across Windows, macOS, and Linux, while preserving binary media files.
- **Detailed Explanation:** Prevents Git dirty diffs and CRLF/LF merge conflicts across multi-OS developer teams.
- **Reference:** `.gitattributes`
- **Difficulty:** Level 6 (Advanced)

#### Q172: What does `.nvmrc` do?
- **Short Answer:** Specifies the Node.js version (`20`) for Node Version Manager (`nvm`), allowing developers to run `nvm use` to match the project runtime.
- **Detailed Explanation:** Guarantees environment consistency across development and evaluation machines.
- **Reference:** `.nvmrc`
- **Difficulty:** Level 6 (Advanced)

#### Q173: Why is `npm ci` preferred over `npm install` for evaluation?
- **Short Answer:** `npm ci` installs exact dependency versions from `package-lock.json` without updating or altering the lockfile, ensuring 100% reproducible builds.
- **Detailed Explanation:** Prevents package drift between the student's machine and the examiner's evaluation machine.
- **Reference:** `package-lock.json`
- **Difficulty:** Level 6 (Advanced)

#### Q174: What is the significance of the 371 automated assertions metric?
- **Short Answer:** It represents the cumulative count of verified system tests across unit, integration, calculation precision, security, headless browser CDP, and offline chart checks.
- **Detailed Explanation:** 347 core unit/API/calc/sec assertions + 22 browser CDP checks + 2 offline chart assertions = 371 total verified checks.
- **Reference:** `audit/FINAL_RELEASE_EVIDENCE_CHECK.md`, `audit/POST_UIUX_MIGRATION_AUDIT.md`
- **Difficulty:** Level 6 (Advanced)

#### Q175: What is the difference between `package.json` and `package-lock.json`?
- **Short Answer:** `package.json` lists required packages and version ranges (e.g. `^4.19.2`); `package-lock.json` locks the exact downloaded versions and cryptographic hashes of every direct and transitive dependency.
- **Detailed Explanation:** `package-lock.json` ensures that two developers running install get the exact same dependency tree down to the last byte.
- **Reference:** `package-lock.json`
- **Difficulty:** Level 6 (Advanced)

#### Q176: What is a Transitive Dependency?
- **Short Answer:** A dependency of a dependency (e.g. EnergySaver depends on `express`, which in turn depends on `body-parser`, `cookie`, and `send`).
- **Detailed Explanation:** Recorded in `package-lock.json` with cryptographic SHA-512 integrity hashes.
- **Reference:** `package-lock.json`
- **Difficulty:** Level 6 (Advanced)

#### Q177: What are the 5 Phase 6 enhancement vectors explicitly marked out of scope?
- **Short Answer:** 1. Progressive tariff slabs; 2. Fixed charges and taxes; 3. Duty cycle modeling; 4. Simple payback period; 5. Zero/negative payback edge cases.
- **Detailed Explanation:** Documented in `test/calculations.test.js` lines 260-280 as planned post-core features.
- **Reference:** `test/calculations.test.js`
- **Difficulty:** Level 6 (Advanced)

#### Q178: If an examiner asks you to modify an appliance's wattage rating in the database, which file and line of code handles this?
- **Short Answer:** `applianceController.updateAppliance` in `src/controllers/applianceController.js` line 262.
- **Detailed Explanation:** It receives the PUT request, validates the input, and executes the UPDATE query with user ownership verification.
- **Reference:** `src/controllers/applianceController.js` line 262
- **Difficulty:** Level 6 (Advanced)

#### Q179: If an examiner asks how the donut chart is created on the dashboard, which function do you show them?
- **Short Answer:** `renderRoomDonutChart()` in `public/js/dashboard.js` line 600.
- **Detailed Explanation:** It extracts labels and data from `room_breakdown`, configures the Chart.js dataset with editorial color tokens, and instantiates the Chart instance.
- **Reference:** `public/js/dashboard.js` line 600
- **Difficulty:** Level 6 (Advanced)

#### Q180: What is your closing statement if the examiner asks what you learned from building EnergySaver?
- **Short Answer:** "I learned how to architect a complete full-stack web application from first principles without relying on heavy abstractions. I gained deep experience in relational database modeling, writing authoritative mathematical engines, implementing defense-in-depth web security (OWASP Top 10), and building accessible, high-performance user interfaces."
- **Detailed Explanation:** Demonstrates holistic engineering maturity covering architecture, security, mathematics, and user experience.
- **Reference:** Entire EnergySaver Project
- **Difficulty:** Level 6 (Advanced)
