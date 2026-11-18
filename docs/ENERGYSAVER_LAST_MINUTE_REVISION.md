# EnergySaver — 10 Quick Viva Revision Sheets
**Document:** `docs/ENERGYSAVER_LAST_MINUTE_REVISION.md`  
**Target Date:** November 19, 2026  
**Audience:** B.Tech Final Examination Quick Revision (Review 30 Minutes Before Viva)  
**Format:** 10 Ultra-Condensed, High-Impact Revision Sheets

---

# SHEET 1: THE ENTIRE PROJECT IN ONE PAGE

### 1. Elevator Pitch (30 Seconds)
"EnergySaver is a full-stack educational web application that helps households analyze appliance-level electricity consumption. While utility companies provide only a single monthly bill total, EnergySaver calculates daily and monthly kilowatt-hours and costs per appliance, offers an interactive What-If savings sandbox, freezes historical estimates into immutable snapshots, and reconciles estimates against actual utility bills to identify consumption gaps."

### 2. Technology Stack & Roles
- **Frontend:** HTML5 (semantic markup), Vanilla CSS3 (Warm Minimalist Editorial theme), Vanilla ES6 JavaScript (DOM manipulation, native `fetch()`), Chart.js (donut and bar visualizations).
- **Backend:** Node.js, Express.js (single-origin monolith serving `public/` and REST APIs from port 3000).
- **Database:** MySQL 8.0 with InnoDB (7 tables, foreign keys with `ON DELETE CASCADE`, 100% parameterized SQL via `mysql2/promise`).
- **Security:** `bcrypt` (salt work factor 10), `express-session` with `express-mysql-session` (persistent cookie store), anti-CSRF token verification, brute-force IP rate limiting, and Zero-Trust IDOR protection (`WHERE user_id = req.session.userId`).

### 3. Core Architectural Principles
- **Single-Origin Monolith:** No CORS issues; backend and frontend share port 3000.
- **Zero Silent Commits:** Slider movement provides real-time client previews without committing unconfirmed changes to MySQL.
- **Dual Storage Modes:** Guest demo mode runs in browser `localStorage`; authenticated mode runs in `MySQL 8.0`.

---

# SHEET 2: FOLDER & FILE RESPONSIBILITIES

```text
EnergySaver/
├── public/                 # Static frontend client files
│   ├── css/                # Styling: editorial-tokens.css, editorial-theme.css, base.css, components.css
│   ├── js/                 # Client scripts
│   │   ├── components/     # appliance-illustrations.js (SVGs), editorial-navigation.js (floating nav)
│   │   ├── utils/          # calculator.js (preview math), formatters.js (currency/XSS), presets.js
│   │   ├── vendor/         # chart.umd.min.js (offline Chart.js library)
│   │   ├── api.js          # Central client fetch gateway & CSRF handler
│   │   ├── appliances.js   # Appliance inventory table, search, filters, modal forms
│   │   ├── auth.js         # Login and registration form handling
│   │   ├── dashboard.js    # Overview dashboard, segmented room bar, donut & bar charts
│   │   ├── nav.js          # Header auth state & mode badge ("Database Mode" vs "Demo Mode")
│   │   ├── reports.js      # Snapshots, utility bill logging, variance reconciliation, CSV export
│   │   ├── savings-modal.js# What-If scenario sandbox slider & simulation display
│   │   ├── settings.js     # User profile, tariff rate, and budget target forms
│   │   └── storage.js      # Guest demo mode storage controller (localStorage)
│   ├── index.html          # Overview Dashboard
│   ├── appliances.html     # Appliance Inventory screen
│   ├── reports.html        # Reports & Bill Reconciliation screen
│   ├── settings.html       # User Profile & Settings screen
│   ├── login.html          # Account Sign In
│   └── register.html       # Account Registration
├── src/                    # Backend Node.js Express source code
│   ├── config/             # index.js (environment config), database.js (MySQL pool)
│   ├── controllers/        # Route controllers (auth, appliance, dashboard, savings, report, settings)
│   ├── middleware/         # auth.js (requireAuth), errorHandler.js, security.js (CSRF & rate limits)
│   ├── scripts/            # dbCheck.js (health probe), initDb.js (DDL schema migration)
│   ├── services/           # calculator.js (authoritative calculation engine)
│   ├── app.js              # Express app factory (middleware stack & route declarations)
│   └── server.js           # Server entry point (app.listen on port 3000 & graceful shutdown)
├── sql/                    # Relational database scripts
│   ├── schema.sql          # MySQL DDL schema (7 tables, foreign keys, CHECK constraints)
│   └── seed.sql            # Sample 2-BHK apartment demonstration seed data
├── test/                   # Automated test suites (371 assertions across 8 test suites)
│   ├── calculations.test.js# 75 calculation precision & boundary math assertions
│   ├── phase2.test.js      # 15 backend infrastructure & health probe assertions
│   ├── phase3.test.js      # 29 authentication, session & cascade delete assertions
│   ├── phase4.test.js      # 43 appliance CRUD & numerical validation assertions
│   ├── phase5.test.js      # 96 dashboard, savings simulation & reports assertions
│   ├── security.test.js    # 48 security assertions (CSRF, SQLi, IDOR, Rate Limits, CSV injection)
│   ├── stage0.test.js      # 41 profile update, password change & credential safety assertions
│   └── post_redesign_audit.test.js # 22 automated headless Chrome CDP assertions across 6 viewports
├── docs/                   # Specifications, architecture, calculations, and academic handbooks
├── audit/                  # Audit verification reports & visual evidence screenshots
├── .env.example            # Safe configuration template with harmless placeholders
├── .gitignore              # Git exclusion patterns
├── .gitattributes          # Line ending normalization rules (LF)
├── .nvmrc                  # Node.js version specification (20)
├── package.json            # Dependencies and npm scripts
└── README.md               # Primary project documentation
```

---

# SHEET 3: TOP 25 CRITICAL FUNCTIONS TO MEMORIZE

| # | Function Name | File | Purpose | One-Line Memory Trick |
|:---:|:---|:---|:---|:---|
| 1 | `createApp()` | `src/app.js` | Express factory; configures Helmet, session, parsers, and routes | "Factory building the Express pipeline" |
| 2 | `gracefulShutdown()` | `src/server.js` | Closes HTTP listener and MySQL connection pool cleanly on SIGTERM | "Cleanly closes door and pool on exit" |
| 3 | `getPool()` | `src/config/database.js` | Creates or returns singleton MySQL connection pool (limit 10) | "Singleton gateway to MySQL connections" |
| 4 | `calculateDailyKwh()` | `src/services/calculator.js` | $(W \times Q \times H) / 1000$; unrounded daily kWh | "Watts times quantity times hours over 1000" |
| 5 | `calculateMonthlyKwh()`| `src/services/calculator.js` | Daily kWh $\times$ Days used per month | "Daily energy times days in the month" |
| 6 | `calculateFlatCost()` | `src/services/calculator.js` | Monthly kWh $\times$ Tariff Rate (₹8.0) | "Units times tariff rate" |
| 7 | `calculateHouseholdTotals()` | `src/services/calculator.js` | Aggregates total kWh, cost, room shares, top appliance, budget status | "Master aggregator of household energy" |
| 8 | `calculateScenarioDelta()` | `src/services/calculator.js` | Computes unrounded baseline minus proposed totals to get exact savings | "Baseline minus proposed with zero rounding drift" |
| 9 | `roundTo()` | `src/services/calculator.js` | Exponential-shift half-up rounding avoiding binary floating point flaws | "Scientific shift rounding for exact paise" |
| 10 | `requireAuth()` | `src/middleware/auth.js` | Session guard: verifies `req.session.userId`; returns HTTP 401 if missing | "Bouncer checking the session ID" |
| 11 | `csrfProtection()` | `src/middleware/security.js` | Compares client `X-CSRF-Token` with session token using `timingSafeEqual` | "Timing-safe lock against CSRF attacks" |
| 12 | `authRateLimiter()` | `src/middleware/security.js` | Restricts failed logins to 5 per 15 minutes per IP with memory pruning | "5 strikes and you wait 15 minutes" |
| 13 | `register()` | `src/controllers/authController.js` | Hashes password with bcrypt, inserts user and default settings, regenerates session | "Hashes, inserts, and logs in safely" |
| 14 | `login()` | `src/controllers/authController.js` | Verifies bcrypt hash, clears rate limits, regenerates session ID | "Compares hash and gives fresh session" |
| 15 | `logout()` | `src/controllers/authController.js` | Destroys MySQL session and clears `energysaver_sid` cookie | "Purges session and clears cookie" |
| 16 | `listAppliances()` | `src/controllers/applianceController.js` | Queries appliances WHERE user_id = ?; computes kWh and costs | "Fetches user appliances with live math" |
| 17 | `createAppliance()` | `src/controllers/applianceController.js` | Validates inputs, enforces 100-item cap, inserts appliance into MySQL | "Validates bounds and saves new appliance" |
| 18 | `updateAppliance()` | `src/controllers/applianceController.js` | Updates appliance WHERE id = ? AND user_id = ? | "Updates only if user owns the record" |
| 19 | `deleteAppliance()` | `src/controllers/applianceController.js` | Deletes appliance WHERE id = ? AND user_id = ? | "Deletes only if user owns the record" |
| 20 | `getSummary()` | `src/controllers/dashboardController.js` | Fetches appliances and settings; returns complete dashboard summary | "Feeds the dashboard with calculated metrics" |
| 21 | `simulateSavings()` | `src/controllers/savingsController.js` | In-memory clone of appliances with proposed runtimes; returns delta savings | "Read-only what-if savings calculation" |
| 22 | `applySavings()` | `src/controllers/savingsController.js` | Executes UPDATE on MySQL appliances table to commit proposed hours | "Permanently applies confirmed savings" |
| 23 | `saveSnapshot()` | `src/controllers/reportController.js` | MySQL transaction: inserts parent snapshot and frozen child items | "Transaction freezing monthly report" |
| 24 | `reconcileBill()` | `src/controllers/reportController.js` | Compares snapshot vs actual bill; computes variance and checklist | "Compares estimate against real utility bill" |
| 25 | `exportCsv()` | `src/controllers/reportController.js` | Streams CSV attachment with formula injection defense via `sanitizeCsvCell` | "Exports spreadsheet safely escaping formulas" |

---

# SHEET 4: MAIN REST API ROUTES & CONTRACTS

| Route | Method | Auth? | CSRF? | Expected Input | Expected Output | Status Code |
|:---|:---:|:---:|:---:|:---|:---|:---:|
| `/health/live` | `GET` | No | No | None | `{ "status": "UP", "uptime_seconds": ... }` | 200 |
| `/health/ready` | `GET` | No | No | None | `{ "status": "READY", "database": "CONNECTED" }` | 200 / 503 |
| `/api/csrf-token` | `GET` | No | No | None | `{ "csrfToken": "32-byte-hex-string" }` | 200 |
| `/api/auth/register` | `POST` | No | Yes | `{ email, password, display_name }` | `{ success: true, data: { user } }` | 201 Created |
| `/api/auth/login` | `POST` | No | Yes | `{ email, password }` | `{ success: true, data: { user } }` | 200 OK / 401 / 429 |
| `/api/auth/me` | `GET` | Yes | No | None | `{ success: true, data: { user } }` | 200 OK / 401 |
| `/api/settings` | `GET` | Yes | No | None | `{ success: true, data: { settings } }` | 200 OK |
| `/api/settings` | `PUT` | Yes | Yes | `{ electricity_rate, monthly_budget }` | `{ success: true, data: { settings } }` | 200 OK |
| `/api/appliances` | `GET` | Yes | No | Optional: `?room=X&category=Y` | `{ success: true, data: { appliances, count } }`| 200 OK |
| `/api/appliances` | `POST` | Yes | Yes | `{ name, category, room, watts, qty, hours, days }` | `{ success: true, data: { appliance } }` | 201 Created |
| `/api/appliances/:id` | `PUT` | Yes | Yes | `{ name, category, room, watts, qty, hours, days }` | `{ success: true, data: { appliance } }` | 200 OK |
| `/api/appliances/:id` | `DELETE` | Yes | Yes | None | `{ success: true, message: "Deleted" }` | 200 OK |
| `/api/dashboard/summary` | `GET` | Yes | No | None | `{ success: true, data: { summary } }` | 200 OK |
| `/api/savings/simulate` | `POST` | Yes | Yes | `{ modifications: [{ id, proposed_daily_hours }] }` | `{ success: true, data: { delta } }` | 200 OK |
| `/api/savings/apply` | `POST` | Yes | Yes | `{ modifications: [{ id, proposed_daily_hours }] }` | `{ success: true, data: { updated_summary } }`| 200 OK |
| `/api/reports/snapshots` | `POST` | Yes | Yes | `{ period_name, period_start, period_end }` | `{ success: true, data: { snapshot_id } }` | 201 Created |
| `/api/reports/snapshots` | `GET` | Yes | No | None | `{ success: true, data: { snapshots } }` | 200 OK |
| `/api/actual-bills` | `POST` | Yes | Yes | `{ start_date, end_date, billed_kwh, amount }` | `{ success: true, data: { bill_id } }` | 201 Created |
| `/api/reports/reconcile` | `GET` | Yes | No | `?snapshot_id=X&bill_id=Y` | `{ success: true, data: { variance } }` | 200 OK |
| `/api/reports/export-csv` | `GET` | Yes | No | None | Text stream: `text/csv; charset=utf-8` | 200 OK |

---

# SHEET 5: DATABASE TABLES & RELATIONSHIPS

### 7 Relational Tables in MySQL 8.0:
1. **`users`:** `id` (PK), `email` (UNIQUE), `password_hash` (bcrypt), `display_name`, `created_at`.
2. **`user_settings`:** `id` (PK), `user_id` (FK -> users.id, UNIQUE), `electricity_rate`, `monthly_budget`, `currency_symbol`.
3. **`appliances`:** `id` (PK), `user_id` (FK -> users.id), `name`, `category`, `room`, `rated_watts`, `quantity`, `daily_hours`, `days_used_per_month`.
4. **`report_snapshots`:** `id` (PK), `user_id` (FK -> users.id), `period_name`, `period_start`, `period_end`, `total_kwh`, `total_cost`, `tariff_rate_used`, `budget_used`.
5. **`report_snapshot_items`:** `id` (PK), `snapshot_id` (FK -> report_snapshots.id), `appliance_name`, `room`, `rated_watts`, `quantity`, `daily_hours`, `monthly_kwh`, `monthly_cost`.
6. **`actual_bills`:** `id` (PK), `user_id` (FK -> users.id), `billing_start_date`, `billing_end_date`, `billed_kwh`, `billed_amount`, `provider_name`.
7. **`sessions`:** `session_id` (VARCHAR(128) BINARY, PK), `expires` (INT UNSIGNED), `data` (MEDIUMTEXT).

### Key Rules:
- All foreign keys enforce `ON DELETE CASCADE`.
- `appliances` enforces CHECK constraints: Watts ($1-10000$), Qty ($1-50$), Hours ($0.1-24.0$), Days ($1-31$).
- `actual_bills` enforces `chk_bill_dates CHECK (billing_end_date >= billing_start_date)`.

---

# SHEET 6: ELECTRICITY FORMULAS & WORKED EXAMPLES

### Core Formulas:
1. **Daily Energy Consumption:**  
   $$\text{Daily kWh} = \frac{\text{Watts} \times \text{Quantity} \times \text{Hours}}{1000}$$
2. **Monthly Energy Consumption:**  
   $$\text{Monthly kWh} = \text{Daily kWh} \times \text{Days Used Per Month}$$
3. **Monthly Electricity Cost:**  
   $$\text{Monthly Cost} = \text{Monthly kWh} \times \text{Tariff Rate (₹/kWh)}$$
4. **Scenario Delta Savings:**  
   $$\Delta\text{ kWh} = \text{Unrounded Baseline kWh} - \text{Unrounded Proposed kWh}$$  
   $$\Delta\text{ Cost} = \text{Unrounded Baseline Cost} - \text{Unrounded Proposed Cost}$$

### Solved Viva Example:
- **Appliance:** 1500W Inverter Air Conditioner ($Q=1$, $H=6.0\text{ hrs/day}$, $D=30\text{ days}$, $\text{Rate}=₹8.00/\text{kWh}$).
- $\text{Daily kWh} = (1500 \times 1 \times 6) / 1000 = 9.0\text{ kWh/day}$.
- $\text{Monthly kWh} = 9.0 \times 30 = 270.0\text{ kWh/month}$.
- $\text{Monthly Cost} = 270.0 \times 8.0 = ₹2,160.00/\text{month}$.
- **Proposed Reduction:** Lower usage to $4.0\text{ hrs/day}$ (Save 2 hrs/day).
- $\text{Proposed Monthly kWh} = ((1500 \times 1 \times 4) / 1000) \times 30 = 6.0 \times 30 = 180.0\text{ kWh}$.
- $\text{Saved kWh} = 270.0 - 180.0 = 90.0\text{ kWh/month}$.
- $\text{Saved Cost} = 90.0 \times ₹8.00 = ₹720.00/\text{month saved}$.

---

# SHEET 7: AUTHENTICATION & DEFENSIVE SECURITY

| Threat Vector | Defense Implemented | Source File Reference |
|:---|:---|:---|
| **Plaintext Password Leaks** | Salted `bcrypt` hashing with 10 salt rounds ($2^{10}=1024$ iterations) | `src/controllers/authController.js` line 124 |
| **Session Fixation** | `req.session.regenerate()` called immediately upon registration and login | `src/controllers/authController.js` lines 147, 218 |
| **Session Hijacking (XSS)** | `httpOnly: true` prevents client-side JS from reading `energysaver_sid` | `src/config/index.js` line 46 |
| **Cross-Site Request Forgery (CSRF)** | `csrfProtection` checks `X-CSRF-Token` using `crypto.timingSafeEqual()` | `src/middleware/security.js` line 40 |
| **SQL Injection** | 100% Parameterized queries via `pool.execute()` prepared statements | All controllers in `src/controllers/` |
| **Broken Object Level Auth (IDOR)** | Hardcoded `WHERE user_id = req.session.userId` on every query | All user queries in `src/controllers/` |
| **Brute-Force Password Guessing**| Rate limiter blocks IP after 5 failed logins within 15 minutes | `src/middleware/security.js` line 103 |
| **Rate Limiter Memory Bloat** | Background 5-minute cleanup sweep prunes expired IP records from Map | `src/middleware/security.js` line 86 |
| **Denial of Service (Query Floods)** | Maximum 100 appliances limit per household | `src/controllers/applianceController.js` line 211 |
| **CSV Formula Injection** | Prepends single quote (`'`) if cell starts with `=`, `+`, `-`, or `@` | `src/controllers/reportController.js` line 31 |
| **DOM XSS** | Attribute-safe entity escaping (`escapeHtml`) encoding quotes and brackets | `public/js/utils/formatters.js` line 57 |
| **Clickjacking & Sniffing** | Helmet sets `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff` | `src/app.js` line 36 |

---

# SHEET 8: COMPLETE REQUEST-RESPONSE LIFECYCLE

### Walkthrough: Adding a New Appliance
1. **User Action:** User fills Add Appliance modal and clicks "Save Appliance".
2. **Client Validation:** `public/js/appliances.js` validates watts ($1-10000$), hours ($0.1-24$).
3. **API Call:** Calls `window.EnergyApi.appliances.create(data)` in `public/js/api.js`.
4. **Header Attachment:** `api.js` attaches `Content-Type: application/json` and `X-CSRF-Token`.
5. **Express Ingestion:** Express receives `POST /api/appliances` on port 3000.
6. **Middleware 1 (Helmet):** Validates security headers and CSP.
7. **Middleware 2 (express.json):** Parses body, verifying payload is under 100 KB.
8. **Middleware 3 (session):** Looks up session in MySQL `sessions` table via cookie.
9. **Middleware 4 (requireAuth):** Verifies `req.session.userId` exists; allows request to continue.
10. **Middleware 5 (csrfProtection):** Validates `X-CSRF-Token` against session token in constant time.
11. **Controller Execution:** Invokes `applianceController.createAppliance`.
12. **Quota Check:** Executes `SELECT COUNT(*) FROM appliances WHERE user_id = ?`; verifies $< 100$.
13. **Database Write:** Executes `INSERT INTO appliances (...) VALUES (?, ?, ...)`.
14. **Metric Calculation:** Calls authoritative `calculator.computeApplianceMetrics()`.
15. **HTTP Response:** Emits HTTP 201 Created with JSON envelope: `{ success: true, data: { ... } }`.
16. **UI Update:** Frontend updates appliances array in memory and re-renders table without page reload.

---

# SHEET 9: MOST LIKELY VIVA QUESTIONS & INSTANT ANSWERS

1. **Q: Why does EnergySaver not use React?**  
   *A:* To eliminate complex build chains, understand pure DOM mechanics, and keep the application lightweight and framework-independent for easy viva defense.
2. **Q: How does the application prevent a user from deleting someone else's appliance?**  
   *A:* By enforcing Zero-Trust IDOR protection: every query specifies `WHERE id = ? AND user_id = req.session.userId`.
3. **Q: What is the difference between simulateSavings and applySavings?**  
   *A:* `simulateSavings` is strictly read-only and calculates what-if metrics in memory; `applySavings` permanently updates the `daily_hours` in MySQL.
4. **Q: How does the app handle offline environments?**  
   *A:* It bundles Chart.js locally (`chart.umd.min.js`) and supports an isolated Guest Demo Mode in browser `localStorage`.
5. **Q: Why do you divide by 1000 in the calculation formula?**  
   *A:* Because 1 kilowatt equals 1000 watts, and electricity billing is based on kilowatt-hours (units).
6. **Q: What happens if an examiner drags a slider on the dashboard and refreshes the page?**  
   *A:* The slider returns to its saved value; zero changes are committed to the database (Zero Silent Commits).
7. **Q: Why are snapshot items stored in a separate table from appliances?**  
   *A:* To guarantee historical immutability; future appliance changes or deletions never alter past reports.
8. **Q: What does bcrypt do?**  
   *A:* It generates a salted, one-way hash with a work factor of 10 so passwords cannot be decrypted.
9. **Q: What is a connection pool?**  
   *A:* A cache of pre-established database connections managed by `mysql2`, avoiding connection overhead per request.
10. **Q: What is ON DELETE CASCADE?**  
    *A:* A database constraint that automatically deletes all child rows (appliances, settings, reports) when the parent user is deleted.

---

# SHEET 10: COMMON MISTAKES & TRICKY EXAMINER TRAPS

1. **Trap: "Does your application read from a smart meter?"**  
   *Correct Response:* "No, sir. This is an educational mathematical modeling tool. It computes estimates based on rated wattages and user operating hours, not physical IoT hardware."
2. **Trap: "Where is the React state stored?"**  
   *Correct Response:* "Sir, our application does not use React. We use Vanilla ES6 JavaScript modules with native DOM state management and asynchronous `fetch()` calls."
3. **Trap: "Why don't you encrypt the passwords?"**  
   *Correct Response:* "Passwords must be hashed, not encrypted. Encryption is reversible with a key, whereas hashing with bcrypt is a one-way mathematical function that cannot be decrypted."
4. **Trap: "What if a user enters 25 hours per day?"**  
   *Correct Response:* "The system rejects it immediately. Client-side validation blocks the form, backend validation returns HTTP 400, and the MySQL database enforces a CHECK constraint restricting hours to $0.1 - 24.0$."
5. **Trap: "How do you prevent SQL injection if user enters ' OR '1'='1?"**  
   *Correct Response:* "All queries use prepared statements with parameterized inputs (`pool.execute(query, [params])`). MySQL treats user input strictly as literal string values, never as executable SQL commands."
