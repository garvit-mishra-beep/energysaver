# Actionable Project Implementation Checklist

## Project: EnergySaver – Electricity Usage Analyzer
**Status:** Core Release Complete & Verified (Phases 1–5 & Phase 7 100% Complete; 371 Automated Assertions Passing; Phase 6 Post-Core Scope Preserved)  
**Reference Document:** [docs/DEVELOPMENT_PHASES.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/DEVELOPMENT_PHASES.md) | [docs/FEATURES.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/FEATURES.md)

---

## Phase 1: Shared UI Design System & Static Prototype (Sample Data)
*Goal: Build the complete client-side visual design system and all 5 primary screens with mock sample data.*

- [x] **TASK-P1-01:** Create CSS design token architecture (`public/css/variables.css`) defining the digital notebook palette, typography, and spacing. `[REQ-UI-01]`
- [x] **TASK-P1-02:** Create base layout and typography reset (`public/css/base.css`). `[REQ-UI-01]`
- [x] **TASK-P1-03:** Create reusable component styles (`public/css/components.css`) for buttons, cards, modals, tables, badges, and alerts. `[REQ-UI-01]`
- [x] **TASK-P1-04:** Create clean browser print stylesheet (`public/css/print.css`) optimizing reports for A4/Letter paper. `[REQ-REP-04]`
- [x] **TASK-P1-05:** Implement common appliance presets catalog (`public/js/utils/presets.js`) with educational badges. `[REQ-APP-02]`
- [x] **TASK-P1-06:** Implement currency, energy, and date formatters (`public/js/utils/formatters.js`). `[REQ-UI-01]`
- [x] **TASK-P1-07:** Build My Home dashboard page (`public/index.html`) with summary metric cards, Chart.js canvases, and empty states. `[REQ-HOME-01, REQ-HOME-02]`
- [x] **TASK-P1-08:** Build Appliances page (`public/appliances.html`) with search, room/category filters, table, and Add/Edit modal. `[REQ-APP-01, REQ-APP-03]`
- [x] **TASK-P1-09:** Build Savings Planner sandbox component (`public/js/savings-modal.js`) with what-if sliders and side-by-side delta preview accessible from My Home and Appliances. `[REQ-SAVE-01, REQ-SAVE-02]`
- [x] **TASK-P1-10:** Build Reports page (`public/reports.html`) with snapshot list, actual bill logging modal, and variance card. `[REQ-REP-01, REQ-REP-02, REQ-REP-03]`
- [x] **TASK-P1-11:** Build Settings page (`public/settings.html`) with profile, flat rate, monthly budget, password change, and danger zone. `[REQ-SETT-01, REQ-AUTH-03, REQ-AUTH-04]`
- [x] **TASK-P1-12:** Build Authentication screens (`public/login.html` and `public/register.html`). `[REQ-AUTH-01, REQ-AUTH-02]`
- [x] **TASK-P1-13:** Populate client-side mock data controllers (`public/js/storage.js`) to enable complete local prototype walkthrough. `[REQ-UI-01]`

---

## Phase 2: Express Server & MySQL Foundations
*Goal: Establish Node.js server, MySQL connection pool, session store, security headers, and schema migrations.*

- [x] **TASK-P2-01:** Initialize `package.json` with scripts and runtime dependencies (`express`, `mysql2`, `express-session`, `express-mysql-session`, `bcrypt`, `helmet`, `dotenv`). `[REQ-SYS-01]`
- [x] **TASK-P2-02:** Create `.env.example` defining environment variables and safe placeholders. `[REQ-SEC-01]`
- [x] **TASK-P2-03:** Write complete DDL schema script (`sql/schema.sql`) for MySQL 8.0 with InnoDB, foreign keys, and constraints. `[REQ-DB-01]`
- [x] **TASK-P2-04:** Write sample seed script (`sql/seed.sql`) with standard 2-BHK apartment demonstration appliances. `[REQ-DB-02]`
- [x] **TASK-P2-05:** Implement MySQL connection pool (`src/config/database.js`) with connection verification. `[REQ-DB-01]`
- [x] **TASK-P2-06:** Configure Express server entry point (`src/server.js`) serving `/public` and parsing JSON payloads. `[REQ-SYS-01]`
- [x] **TASK-P2-07:** Configure `express-session` with MySQL session store and secure HTTP cookies. `[REQ-AUTH-03, REQ-SEC-02]`
- [x] **TASK-P2-08:** Implement Helmet security headers and global JSON error handling middleware (`src/middleware/errorHandler.js`). `[REQ-SEC-03]`

---

## Phase 3: User Accounts, Authentication & Settings
*Goal: Implement secure user registration, session login, logout, password change, tariff/budget configuration, and account deletion with cascade.*

- [x] **TASK-P3-01:** Implement `POST /api/auth/register` with email format verification and bcrypt hashing (10 salt rounds). `[REQ-AUTH-01, REQ-AUTH-02]`
- [x] **TASK-P3-02:** Implement `POST /api/auth/login` with credentials validation and session binding. `[REQ-AUTH-02]`
- [x] **TASK-P3-03:** Implement `POST /api/auth/logout` destroying session and clearing cookies. `[REQ-AUTH-02]`
- [x] **TASK-P3-04:** Implement `GET /api/auth/me` returning authenticated user profile. `[REQ-AUTH-02]`
- [x] **TASK-P3-05:** Implement session guard middleware (`src/middleware/auth.js`) protecting private routes. `[REQ-AUTH-04]`
- [x] **TASK-P3-06:** Implement `GET /api/settings` and `PUT /api/settings` managing tariff rate, currency, and budget. `[REQ-SETT-01, REQ-BUDG-01]`
- [x] **TASK-P3-07:** Implement `PUT /api/auth/password` requiring current password verification. `[REQ-AUTH-03]`
- [x] **TASK-P3-08:** Implement `POST /api/auth/delete-account` cascading complete deletion across all user tables. `[REQ-AUTH-04]`
- [x] **TASK-P3-09:** Connect client authentication files (`public/js/auth.js`, `public/js/settings.js`) to live APIs. `[REQ-AUTH-01, REQ-AUTH-02]`

---

## Phase 4: Appliance Inventory & Authoritative Calculation Engine
*Goal: Implement full CRUD for appliances, editable presets catalog, client preview calculations, and the authoritative server-side calculation service.*

- [x] **TASK-P4-01:** Implement authoritative server calculation service (`src/services/calculator.js`) for Daily/Monthly kWh and Flat-Rate Cost. `[REQ-CALC-01, REQ-CALC-02, REQ-CALC-03]`
- [x] **TASK-P4-02:** Implement client-side preview calculator (`public/js/utils/calculator.js`) mirroring backend math. `[REQ-CALC-04]`
- [x] **TASK-P4-03:** Implement `GET /api/appliances` supporting room/category filtering, name search, and sorting. `[REQ-APP-03]`
- [x] **TASK-P4-04:** Implement `POST /api/appliances` with strict numerical range validation ($W, Q, H, D$). `[REQ-APP-01]`
- [x] **TASK-P4-05:** Implement `PUT /api/appliances/:id` with strict user ownership enforcement. `[REQ-APP-01, REQ-AUTH-04]`
- [x] **TASK-P4-06:** Implement `DELETE /api/appliances/:id` with confirmation modal. `[REQ-APP-04]`
- [x] **TASK-P4-07:** Implement stateless preview endpoint `POST /api/appliances/preview`. `[REQ-APP-01]`
- [x] **TASK-P4-08:** Connect client appliance management (`public/js/appliances.js`) to live endpoints. `[REQ-APP-01]`

---

## Phase 5: Dashboard Visualizations, Budget Alerts, Savings Sandbox & Historical Reports
*Goal: Integrate Chart.js visualizations, budget alerts, what-if scenario sandbox, snapshot reports, actual bill reconciliation, and CSV export.*

- [x] **TASK-P5-01:** Implement `GET /api/dashboard/summary` computing household totals, top consumer, room breakdown, and budget ratio. `[REQ-HOME-01]`
- [x] **TASK-P5-02:** Connect Chart.js donut chart (Room breakdown) and bar chart (Top 5 appliances) in `public/js/dashboard.js`. `[REQ-HOME-02]`
- [x] **TASK-P5-03:** Implement dynamic budget alert banners (Normal, Approaching $\ge 80\%$, Over $> 100\%$). `[REQ-BUDG-02]`
- [x] **TASK-P5-04:** Implement What-If scenario endpoints `POST /api/savings/simulate` and `POST /api/savings/apply`. `[REQ-SAVE-01, REQ-SAVE-02, REQ-SAVE-03]`
- [x] **TASK-P5-05:** Implement `POST /api/reports/snapshots` and `GET /api/reports/snapshots` preserving immutable records. `[REQ-REP-01]`
- [x] **TASK-P5-06:** Implement `POST /api/actual-bills` and `GET /api/reports/reconcile` for variance analysis. `[REQ-REP-02, REQ-REP-03]`
- [x] **TASK-P5-07:** Implement `GET /api/reports/export-csv` with formula character defense (`=,+,-,@`). `[REQ-REP-04, REQ-SEC-04]`
- [x] **TASK-P5-08:** Connect client files (`public/js/dashboard.js`, `public/js/savings.js`, `public/js/reports.js`) to live APIs. `[REQ-HOME-01, REQ-REP-01]`
- [x] **TASK-P5-09:** Add rule-based educational tips to dashboard highlighting high-consumption appliances. `[REQ-TIPS-01]`

---

## Phase 6: Advanced Enhancements (Post-Core Target)
*Goal: Implement progressive tariff slabs, duty cycle modeling, replacement payback, JSON backup/restore, and demo mode.*
*Note: Strictly classified as Post-Core Scope; preserved for future enhancement.*

- [ ] **TASK-P6-01:** Implement progressive tiered tariff slab calculation engine with fixed charges and tax. `[REQ-ENH-01]`
- [ ] **TASK-P6-02:** Add compressor duty cycle percentage modeling for intermittent appliances. `[REQ-ENH-02]`
- [ ] **TASK-P6-03:** Add split weekday vs. weekend operating schedules. `[REQ-ENH-03]`
- [ ] **TASK-P6-04:** Add standby power tracking without double-counting active hours. `[REQ-ENH-04]`
- [ ] **TASK-P6-05:** Build appliance replacement financial comparison and simple payback calculator. `[REQ-ENH-05]`
- [ ] **TASK-P6-06:** Build household savings goals tracker linked to a saved baseline snapshot. `[REQ-ENH-06]`
- [x] **TASK-P6-07:** Implement isolated Demo Mode with pre-populated sample household data. `[REQ-ENH-07]`
- [ ] **TASK-P6-08:** Implement JSON backup export and validated restore with duplicate handling. `[REQ-ENH-08]`

---

## Phase 7: Verification, Academic Viva Prep & Local/Server Deployment
*Goal: Execute comprehensive test plan, review security compliance, and prepare student demonstration materials.*

- [x] **TASK-P7-01:** Execute all calculation and boundary test cases in `docs/TEST_PLAN.md` (`test/calculations.test.js` - 75 passed assertions, 5 Phase 6 cases marked Out of Scope).
- [x] **TASK-P7-02:** Execute security tests (SQL injection, IDOR cross-user attempts, CSRF, rate limits) (`test/security.test.js` - 48 passed assertions, `audit/SECURITY_VERIFICATION_REPORT.md`).
- [x] **TASK-P7-03:** Perform responsive design audit on mobile (360px) and desktop displays (`audit/UI_ACCESSIBILITY_REPORT.md`).
- [x] **TASK-P7-04:** Conduct WCAG AA color contrast and keyboard navigation accessibility audit (`audit/UI_ACCESSIBILITY_REPORT.md`).
- [x] **TASK-P7-05:** Practice the 5–7 minute teacher walkthrough script in `docs/DEMO_GUIDE.md` and `audit/ACADEMIC_DEMO_READINESS.md`.
- [x] **TASK-P7-06:** Review anticipated viva examination questions and model answers (`audit/VIVA_PREPARATION.md`).
- [x] **TASK-P7-07:** Verify deployment readiness following `docs/DEPLOYMENT.md` and `audit/DEPLOYMENT_READINESS_REPORT.md`.

---

## Deep Audit Remediation (All 14 Issues Resolved & Verified)
*Goal: Resolve all 14 independent audit findings, achieve complete frontend-backend integration, and certify release readiness.*

- [x] **TASK-REM-01:** Wire `dashboard.js`, `savings-modal.js`, and `reports.js` to live MySQL Express REST APIs with dual-mode guest fallback (`ISS-DEEP-01`).
- [x] **TASK-REM-02:** Standardize API error payloads to `{ success: false, error: { code, message } }` in `reportController.js`, `savingsController.js`, and `api.js` (`ISS-DEEP-02`).
- [x] **TASK-REM-03:** Fix HTML attribute escaping in `formatters.js` and `nav.js`, and eliminate inline `onclick` handlers via table event delegation (`ISS-DEEP-03`).
- [x] **TASK-REM-04:** Establish Git repository baseline tracking all files (`ISS-DEEP-04`).
- [x] **TASK-REM-05:** Implement unref'd 10-minute periodic sweep timer for rate limiter memory in `src/middleware/security.js` (`ISS-DEEP-05`).
- [x] **TASK-REM-06:** Enforce database least privilege (DML only for runtime app user) in `docs/DEPLOYMENT.md` (`ISS-DEEP-06`).
- [x] **TASK-REM-07:** Enable `trustProxy` in `src/config/index.js` for production reverse proxies (`ISS-DEEP-07`).
- [x] **TASK-REM-08:** Enforce 100-appliance per account quota in `src/controllers/applianceController.js` (`ISS-DEEP-08`).
- [x] **TASK-REM-09:** Compute unrounded totals prior to subtraction in `calculateScenarioDelta()` for high delta precision (`ISS-DEEP-09`).
- [x] **TASK-REM-10:** Replace tautological assertions with multi-table MySQL checks in `test/phase5.test.js` (`ISS-DEEP-10`).
- [x] **TASK-REM-11:** Version-control automated browser E2E test suite in `test/browser.test.js` and add `npm run test:browser` (`ISS-DEEP-11`).
- [x] **TASK-REM-12:** Add `.auth-banner` styling and clarify account indicator for authenticated users in `nav.js` (`ISS-DEEP-12`).
- [x] **TASK-REM-13:** Add domain educational tooltips for duty cycle & compressor cycling in `appliances.html` and `dashboard.js` (`ISS-DEEP-13`).
- [x] **TASK-REM-14:** Align `docs/API_SPEC.md` naming (`display_name`) and add `PUT /api/auth/profile` documentation (`ISS-DEEP-14`).
