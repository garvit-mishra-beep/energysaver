# EnergySaver — One-Day Master Viva Preparation Plan
**Document:** `docs/ENERGYSAVER_ONE_DAY_STUDY_PLAN.md`  
**Target Date:** November 19, 2026 (Exam Day)  
**Author/Coach:** Senior Full-Stack Instructor & Viva Examiner  
**Estimated Time Needed:** 8 to 10 Hours (Full Plan) | 2 Hours (Emergency Crash Plan)

---

## HOW TO USE THIS STUDY PLAN

Do NOT try to memorize every single line of code. Software engineering examiners evaluate:
1. **System Architecture:** Do you understand how data flows from a button click to MySQL and back?
2. **Defensive Decisions:** Why did you choose bcrypt? Why parameterized queries? Why CSRF tokens?
3. **Mathematical Precision:** Can you solve an electricity calculation problem on the whiteboard?
4. **Code Navigation:** If an examiner asks, "Where is an appliance added?", can you immediately open `src/controllers/applianceController.js` line 196?

---

# 8–10 HOUR COMPREHENSIVE STUDY TIMETABLE

| Block | Time Allocation | Topic & Focus Area | Target Mastery |
|:---:|:---:|:---|:---|
| **Block 1** | 08:00 – 08:45 (45 min) | Overall Architecture & Folder Structure | Monolith pipeline, folder roles, dependencies |
| **Block 2** | 08:45 – 09:45 (60 min) | Electricity Calculation Engine & Formulas | Watts to kWh, flat cost, rounding, delta |
| **Block 3** | 09:45 – 10:45 (60 min) | Relational Database, Schema & SQL | 7 tables, foreign keys, cascade, 3NF |
| **Break** | 10:45 – 11:00 (15 min) | Refreshment & Mental Reset | |
| **Block 4** | 11:00 – 12:00 (60 min) | Backend Express Pipeline & Startup | server.js, app.js, middleware, error handling |
| **Block 5** | 12:00 – 13:00 (60 min) | Authentication, Sessions & Web Security | bcrypt, session store, CSRF, IDOR, rate limits |
| **Lunch** | 13:00 – 14:00 (60 min) | Rest & Nutrition | |
| **Block 6** | 14:00 – 15:00 (60 min) | Core Appliance Management (CRUD) | list, create, update, delete, 100-limit ceiling |
| **Block 7** | 15:00 – 16:00 (60 min) | Dashboard, What-If Savings & Reports | getSummary, simulateSavings, applySavings, snapshots |
| **Block 8** | 16:00 – 17:00 (60 min) | Frontend UI, CSS Tokens & Event Listeners | Warm Minimalist Editorial theme, sliders, room bar |
| **Break** | 17:00 – 17:30 (30 min) | Walk / Fresh Air | |
| **Block 9** | 17:30 – 18:30 (60 min) | Master Function Drill (Top 25 Functions) | Function signatures, inputs, outputs, memory tricks |
| **Block 10**| 18:30 – 19:30 (60 min) | Mock Viva Self-Examination | Practice speaking 30-sec, 2-min, 5-min answers aloud |

---

## DETAILED BREAKDOWN OF STUDY BLOCKS

### BLOCK 1: OVERALL ARCHITECTURE & FOLDER STRUCTURE (45 min)
- **Goal:** Be able to describe EnergySaver's architecture on a whiteboard in 60 seconds.
- **Files to Open:** `README.md`, `package.json`, `docs/ARCHITECTURE.md`.
- **Key Concepts to Master:**
  - Single-Origin Monolith: Express serves static HTML/CSS/JS from `public/` and JSON APIs from `/api` on port 3000.
  - Zero heavy frontend build toolchains (no Webpack, Vite, or React).
  - Folder roles: `public/` (client assets), `src/` (backend logic), `sql/` (database schema), `test/` (automated tests), `docs/` (specifications).
- **Self-Test 1:**
  1. *Q:* Why is there no CORS issue in EnergySaver?  
     *A:* Because the frontend HTML/JS and backend API routes are hosted on the exact same origin (`http://localhost:3000`).
  2. *Q:* Which file starts the server listener?  
     *A:* `src/server.js`.

---

### BLOCK 2: CALCULATION ENGINE & WHITEBOARD MATH (60 min)
- **Goal:** Solve any electricity calculation immediately on paper without using a calculator.
- **Files to Open:** `src/services/calculator.js`, `docs/CALCULATIONS.md`.
- **Formulas to Memorize:**
  1. $	ext{Daily kWh} = (	ext{Watts} 	imes 	ext{Quantity} 	imes 	ext{Hours}) / 1000$
  2. $	ext{Monthly kWh} = 	ext{Daily kWh} 	imes 	ext{Days}$
  3. $	ext{Estimated Bill} = 	ext{Monthly kWh} 	imes 	ext{Rate}$
  4. $	ext{Delta} = 	ext{Unrounded Baseline} - 	ext{Unrounded Proposed}$
- **Hands-On Whiteboard Exercise:**
  - *Problem:* A 1500W Inverter AC runs for 6 hours/day, 30 days/month at ₹8.00/kWh.
  - *Step 1:* Daily kWh = $(1500 	imes 1 	imes 6) / 1000 = 9.0	ext{ kWh/day}$.
  - *Step 2:* Monthly kWh = $9.0 	imes 30 = 270.0	ext{ kWh/month}$.
  - *Step 3:* Monthly Cost = $270.0 	imes 8 = ₹2,160.00$.
- **Self-Test 2:**
  1. *Q:* Why do we divide by 1000?  
     *A:* Because 1 kilowatt equals 1000 watts.
  2. *Q:* How did you resolve the cumulative 1-paisa rounding error?  
     *A:* By retaining full IEEE-754 64-bit precision during intermediate steps and subtracting unrounded scenario totals before rounding the delta.

---

### BLOCK 3: RELATIONAL DATABASE, MYSQL 8.0 & SQL (60 min)
- **Goal:** Draw the database schema and explain table relationships from memory.
- **Files to Open:** `sql/schema.sql`, `docs/DATABASE.md`, `docs/ENERGYSAVER_API_AND_DATABASE_GUIDE.md`.
- **Diagram to Memorize:**
  - `users` (1:1) $ightarrow$ `user_settings`
  - `users` (1:N) $ightarrow$ `appliances`
  - `users` (1:N) $ightarrow$ `report_snapshots` (1:N) $ightarrow$ `report_snapshot_items`
  - `users` (1:N) $ightarrow$ `actual_bills`
- **Key Concepts:**
  - `ON DELETE CASCADE`: Deleting a user purges all their appliances, settings, and snapshots automatically.
  - `CHECK` constraints: `chk_appliance_hours` restricts daily hours between 0.1 and 24.0.
  - Parameterized queries: Prepared statements prevent SQL Injection.
- **Self-Test 3:**
  1. *Q:* What happens to appliances if a user is deleted?  
     *A:* They are automatically cascade-deleted by MySQL foreign key rules.
  2. *Q:* Why are snapshot items duplicated in a separate table?  
     *A:* To guarantee historical immutability; future appliance updates never alter past reports.

---

### BLOCK 4: BACKEND EXPRESS PIPELINE & STARTUP (60 min)
- **Goal:** Trace an incoming request through Express middleware.
- **Files to Open:** `src/server.js`, `src/app.js`, `src/middleware/errorHandler.js`.
- **Middleware Execution Order:**
  1. `helmet` (sets security headers)
  2. `express.json({ limit: '100kb' })` (parses JSON body)
  3. `session` with `express-mysql-session` (loads session from MySQL)
  4. Health checks & CSRF token endpoints
  5. Route-specific guards: `requireAuth`, `csrfProtection`, `authRateLimiter`
  6. Controller action
  7. `express.static('public')`
  8. `apiNotFoundHandler` (404)
  9. `globalErrorHandler` (500)
- **Self-Test 4:**
  1. *Q:* What does `next()` do?  
     *A:* Passes control to the next middleware in the pipeline.
  2. *Q:* What does `next(err)` do?  
     *A:* Skips all remaining route handlers and invokes the 4-parameter global error handler.

---

### BLOCK 5: AUTHENTICATION, SESSIONS & SECURITY (60 min)
- **Goal:** Defend your security architecture against OWASP Top 10 questions.
- **Files to Open:** `src/controllers/authController.js`, `src/middleware/security.js`, `src/middleware/auth.js`.
- **Topics to Master:**
  - Password hashing: `bcrypt.hash(password, 10)` (one-way salted hash, work factor 10).
  - Session Fixation: `req.session.regenerate()` generates a fresh session ID upon login/register.
  - CSRF: `csrfProtection` validates `X-CSRF-Token` using `crypto.timingSafeEqual()`.
  - IDOR: Every query strictly binds `WHERE user_id = req.session.userId`.
  - Rate Limiting: 5 attempts per 15 minutes per IP with automated 5-minute memory pruning.
- **Self-Test 5:**
  1. *Q:* Why do we use timingSafeEqual instead of `===` for CSRF tokens?  
     *A:* To prevent timing attacks that measure byte-by-byte string comparison latency.
  2. *Q:* What cookie flags are set on the session?  
     *A:* `HttpOnly`, `SameSite=Lax`, and dynamic `Secure`.

---

### BLOCK 6: APPLIANCE MANAGEMENT (CRUD) (60 min)
- **Goal:** Explain how appliances are created, validated, updated, and deleted.
- **Files to Open:** `src/controllers/applianceController.js`, `public/js/appliances.js`.
- **Key Mechanics:**
  - Validation: Watts ($1-10000$), Qty ($1-50$), Hours ($0.1-24$), Days ($1-31$).
  - Inventory Ceiling: Rejects insert if user already owns 100 appliances (CWE-770 DoS defense).
  - Ownership: `UPDATE appliances SET ... WHERE id = ? AND user_id = ?`.
- **Self-Test 6:**
  1. *Q:* Where is the 100-appliance ceiling checked?  
     *A:* In `applianceController.createAppliance` line 211 via `SELECT COUNT(*) FROM appliances`.
  2. *Q:* What HTTP status code is returned on successful creation?  
     *A:* HTTP 201 Created.

---

### BLOCK 7: DASHBOARD, SAVINGS & REPORTS (60 min)
- **Goal:** Explain the calculation aggregation, savings simulation, and bill reconciliation.
- **Files to Open:** `src/controllers/dashboardController.js`, `src/controllers/savingsController.js`, `src/controllers/reportController.js`.
- **Key Concepts:**
  - Dashboard: `getSummary` aggregates total kWh, monthly cost, budget utilization, top consumer, and room shares.
  - What-If Savings: `simulateSavings` clones appliances in memory, modifies proposed runtimes, and computes delta without database writes.
  - Snapshots: `saveSnapshot` wraps parent insert and frozen child items in a MySQL transaction (`conn.beginTransaction()`).
  - Reconciliation: `reconcileBill` compares snapshot against actual bill and flags date mismatches.
  - CSV Export: `exportCsv` sanitizes formula cells starting with `=`, `+`, `-`, `@` with an apostrophe.
- **Self-Test 7:**
  1. *Q:* Does simulateSavings write to MySQL?  
     *A:* No, it is 100% read-only and computes the comparison delta in memory.
  2. *Q:* Why is a transaction used in saveSnapshot?  
     *A:* To guarantee atomicity—either the snapshot header and all its items are saved together, or none are.

---

### BLOCK 8: FRONTEND UI & EDITORIAL THEME (60 min)
- **Goal:** Explain the visual design system, custom sliders, and DOM events.
- **Files to Open:** `public/index.html`, `public/css/editorial-tokens.css`, `public/js/dashboard.js`.
- **Key UI Components:**
  - Warm Minimalist Editorial palette: Oatmeal (`#F9F6F0`), Botanical Ink (`#1C2420`), Forest Green (`#2E6F40`).
  - Segmented Room Bar: 24px continuous flexbox progress bar with dynamic percentages.
  - Tactile Sliders: `input` event updates estimated cost label in real time without network calls.
  - Floating Bottom Nav: Fixed pill with ARIA navigation landmark.
  - 10 Vector SVG illustrations in `appliance-illustrations.js`.
- **Self-Test 8:**
  1. *Q:* Which DOM event updates the slider preview?  
     *A:* The `input` event.
  2. *Q:* How does the app ensure zero horizontal overflow?  
     *A:* CSS Grid `minmax(0, 1fr)` and `min-width: 0` on card containers.

---

### BLOCK 9: MASTER FUNCTION DRILL (TOP 25 FUNCTIONS) (60 min)
- **Goal:** Memorize the top 25 functions listed in `docs/ENERGYSAVER_LAST_MINUTE_REVISION.md` Sheet 3.
- **Study Technique:** Cover the function description and speak aloud its purpose, file path, and return value.

---

### BLOCK 10: MOCK VIVA PRACTICE (60 min)
- **Goal:** Practice answering questions aloud with confidence and clarity.
- **Exercise:** Review questions from `docs/ENERGYSAVER_VIVA_QUESTION_BANK.md` across all 6 levels.
- **Practice Spoken Explanations:**
  - 30-Second Elevator Pitch
  - 2-Minute Architecture Summary
  - 5-Minute Technical Defense

---

# 2-HOUR EMERGENCY CRASH PLAN (LAST MINUTE)

If you only have 2 hours before your exam, study ONLY these high-impact items:

| Time | Duration | Priority Topic | Essential Activity |
|:---:|:---:|:---|:---|
| **00:00 – 00:20** | 20 min | **Formulas & Whiteboard Math** | Memorize Daily kWh, Monthly kWh, Flat Cost, and Delta. Solve one AC example on paper. |
| **00:20 – 00:40** | 20 min | **Database Schema (ERD)** | Draw the 7 tables and foreign key relationships. Understand `ON DELETE CASCADE`. |
| **00:40 – 01:00** | 20 min | **Security Defenses** | Memorize: bcrypt (work factor 10), timingSafeEqual CSRF, WHERE user_id = ?, 5 attempts rate limit. |
| **01:00 – 01:25** | 25 min | **Lifecycle of an Appliance Add** | Trace: Form Submit $ightarrow$ api.js $ightarrow$ POST /api/appliances $ightarrow$ requireAuth $ightarrow$ csrfProtection $ightarrow$ createAppliance $ightarrow$ MySQL INSERT $ightarrow$ Table Render. |
| **01:25 – 01:45** | 20 min | **Key Architectural Concepts** | Understand: Zero Silent Commits, Dual Storage Modes (localStorage vs MySQL), Immutable Snapshots. |
| **01:45 – 02:00** | 15 min | **Review Quick Revision Sheets** | Read Sheets 1 through 10 in `docs/ENERGYSAVER_LAST_MINUTE_REVISION.md`. |
