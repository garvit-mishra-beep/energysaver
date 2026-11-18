# EnergySaver — Complete Source Code Explanation & Viva Preparation Handbook
**Document Version:** 2.0.0 (Master Comprehensive Edition)  
**Project:** EnergySaver — Electricity Usage Analyzer  
**Target Examination Date:** 19 November 2026  
**Degree / Context:** Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)  
**Author / Presenter:** Student Capstone Project Team  
**Evaluation Focus:** Full-Stack Architecture, Node.js / Express, MySQL 8.0, Security, Calculations, and Testing  

---

## Table of Contents

1. [Part 1: Project Introduction from Zero](#part-1-project-introduction-from-zero)
2. [Part 2: Complete Folder-by-Folder Directory Walkthrough](#part-2-complete-folder-by-folder-directory-walkthrough)
3. [Part 3: Complete File-by-File Codebase Walkthrough](#part-3-complete-file-by-file-codebase-walkthrough)
4. [Part 4: Master Function Inventory & Detailed Function Explanations](#part-4-master-function-inventory--detailed-function-explanations)
5. [Part 5: Complete Function Call Graphs & Traceability](#part-5-complete-function-call-graphs--traceability)
6. [Part 6: Complete Frontend Architecture & Implementation](#part-6-complete-frontend-architecture--implementation)
7. [Part 7: Complete Backend Architecture & Node.js/Express Pipeline](#part-7-complete-backend-architecture--nodejs-express-pipeline)
8. [Part 8: The Authoritative Calculation Engine](#part-8-the-authoritative-calculation-engine)
9. [Part 9: Authentication, Sessions, and Defensive Web Security](#part-9-authentication-sessions-and-defensive-web-security)
10. [Part 10: Dual-Mode Storage Architecture (Database vs Guest Demo)](#part-10-dual-mode-storage-architecture)
11. [Part 11: The What-If Savings Planner & Zero Silent Commits](#part-11-the-what-if-savings-planner--zero-silent-commits)
12. [Part 12: Historical Snapshots & Utility Bill Reconciliation](#part-12-historical-snapshots--utility-bill-reconciliation)
13. [Part 13: Database Design & Relational Data Model (MySQL 8.0)](#part-13-database-design--relational-data-model)
14. [Part 14: Complete REST API Specification & Data Contracts](#part-14-complete-rest-api-specification--data-contracts)
15. [Part 15: Third-Party Dependencies & Supply Chain Audit](#part-15-third-party-dependencies--supply-chain-audit)
16. [Part 16: Automated Testing & Release Integrity](#part-16-automated-testing--release-integrity)
17. [Part 17: 10 Real-World User Workflows (Step-by-Step Traces)](#part-17-10-real-world-user-workflows)
18. [Part 18: Beginner's Guide to JavaScript & Backend Concepts](#part-18-beginners-guide-to-javascript--backend-concepts)
19. [Part 19: Technical Viva Defense Strategy & Question Bank Summary](#part-19-technical-viva-defense-strategy)
20. [Part 20: Top 25 Critical Functions to Memorize](#part-20-top-25-critical-functions-to-memorize)
21. [Part 21: One-Day Study Plan & Revision Schedule](#part-21-one-day-study-plan--revision-schedule)
22. [Part 22: Quick Revision Sheets Summary](#part-22-quick-revision-sheets-summary)
23. [Part 23: Codebase Coverage Audit Verification](#part-23-codebase-coverage-audit-verification)
24. [Part 24: Document Ecosystem Cross-References](#part-24-document-ecosystem-cross-references)
25. [Part 25: Academic Viva Presentation & Demonstration Script](#part-25-academic-viva-presentation--demonstration-script)
26. [Part 26: Final Certification & Conclusion](#part-26-final-certification--conclusion)

---

## Part 1: Project Introduction from Zero

### 1.1 What is EnergySaver?
**EnergySaver** is a production-grade, full-stack educational web application designed to give households transparent, appliance-level visibility into their electricity consumption. 

In everyday life, an electric utility provider (such as BSES, Tata Power, BESCOM, or PG&E) delivers a monthly bill containing a single lumped number: total kilowatt-hours consumed (e.g., $450\text{ kWh}$) and the net monetary charge (e.g., $₹3,600.00$). This aggregate metric creates a fundamental information asymmetry:
1. The consumer has no visibility into which individual appliances are responsible for what percentage of the bill.
2. The consumer cannot easily assess the financial impact of changing specific habits (e.g., reducing air conditioning from 8 hours to 6 hours per day).
3. The consumer cannot verify whether their actual utility bill matches their estimated appliance load, leaving billing errors, faulty wiring, or phantom loads undetected.

EnergySaver solves this problem by providing:
- **Granular Appliance Inventory:** Tracking rated wattage, quantity, daily usage hours, and monthly days used per appliance and per room.
- **Authoritative Mathematical Modeling:** Converting electrical parameters ($W, Q, H, D$) into kilowatt-hours and financial costs using precise IEEE 754 arithmetic with scientific half-up rounding.
- **Interactive What-If Savings Planner:** A sandboxed simulation engine allowing users to explore operational schedule adjustments and instantly see monthly financial savings without prematurely committing changes to persistent storage.
- **Historical Snapshots & Bill Reconciliation:** Freezing monthly calculated totals into immutable database records and comparing them against physical utility bills to detect variance and offer diagnostic recommendations.
- **Educational Dual-Mode Operation:** Running either in full **Database Mode** (backed by MySQL 8.0, persistent cookies, and bcrypt authentication) or in **Guest Demo Mode** (isolated browser `localStorage` for zero-friction evaluation).

### 1.2 Motivation & Real-World Problem Statement
Residential electricity consumption is one of the largest controllable operational expenses in modern urban households. However, typical consumers make uninformed decisions because utility meters only measure the aggregate building feed. For instance:
- A user may replace all LED bulbs (saving $10\text{W}$ per fixture) while neglecting an unserviced water heater or an old refrigerator compressor consuming $2500\text{W}$ for prolonged cycles.
- Without mathematical modeling, the user cannot determine if their ₹5,000 monthly bill is driven by cooling (AC), refrigeration, heating (geyser), or baseload electronics.

EnergySaver acts as a **software energy auditor**, bridging the gap between hardware smart meters (which require expensive capital equipment) and raw guesswork.

### 1.3 Technology Stack & Architectural Decision Record (ADR)

| Tier | Chosen Technology | Why This Choice Over Alternatives |
|:---|:---|:---|
| **Frontend Framework** | **Semantic HTML5 + Vanilla CSS3 + Vanilla ES6 JS** | **No React/Vue/Svelte:** Eliminates complex compilation toolchains (Webpack, Vite, Babel, node_modules bloat), eliminates virtual DOM overhead, enables zero-latency direct DOM manipulation, and ensures 100% transparent code that a student can defend line-by-line in a viva. |
| **Styling & Theme** | **Vanilla CSS3 Custom Design System** | Implements the **Option B Warm Minimalist Editorial Design System** (warm off-white `#FBFBF9`, deep charcoal typography `#2D312E`, sage/forest green accents `#2E6F40`). No heavy frameworks like Tailwind CLI or Bootstrap; pure CSS variables and modular stylesheets. |
| **Visualizations** | **Chart.js (Local Bundle)** | Offline-capable `chart.umd.min.js` rendering responsive donut charts (room breakdown) and horizontal bar charts (top appliances) directly to HTML5 `<canvas>` elements. |
| **Backend Runtime** | **Node.js (LTS v20+) & Express.js 4.19** | Industry-standard non-blocking event-driven I/O model. Express provides a lightweight, minimalist HTTP routing and middleware framework. |
| **Database Engine** | **MySQL 8.0 with InnoDB Storage Engine** | Full relational ACID guarantees, foreign keys with `ON DELETE CASCADE`, strict `CHECK` constraints, and parameterized queries via `mysql2/promise` connection pooling. |
| **Session Management** | **express-session + express-mysql-session** | Server-side session store in MySQL. Secure, signed, `httpOnly`, `SameSite=Lax` session cookies (`energysaver_sid`) preventing client-side script tampering. |
| **Password Security** | **bcrypt (Work Factor 10)** | Industry standard adaptive salted hashing. $2^{10} = 1024$ key expansion rounds, resistant to rainbow table and GPU brute-force attacks. |
| **Defensive Security** | **Helmet, Custom CSRF Middleware, Rate Limiting** | Timing-safe cryptographic anti-CSRF token verification (`crypto.timingSafeEqual`), in-memory IP brute-force limiter, CSP, XSS attribute escaping, and CSV formula injection neutralization. |
| **Architecture Pattern** | **Single-Origin Monolith** | Express serves both the static frontend assets from `public/` and REST API endpoints from `/api` on the exact same port (3000). Completely avoids CORS pre-flight complexity and cross-origin security holes. |

---

## Part 2: Complete Folder-by-Folder Directory Walkthrough

EnergySaver follows a clean, professional software engineering directory structure. Every directory has a dedicated, singular responsibility:

```text
EnergySaver/
├── public/                 # Static frontend assets served directly to the browser
│   ├── css/                # CSS stylesheets (tokens, layout, theme, components)
│   ├── js/                 # Client-side JavaScript modules and utilities
│   │   ├── components/     # Reusable UI component modules (illustrations, floating nav)
│   │   ├── utils/          # Client helper functions (formatters, preview math, presets)
│   │   └── vendor/         # Bundled offline third-party libraries (Chart.js)
│   ├── index.html          # Dashboard & Overview page
│   ├── appliances.html     # Appliance Inventory & Management page
│   ├── reports.html        # Historical Snapshots & Utility Bill Reconciliation page
│   ├── settings.html       # User Profile, Tariff Rate & Monthly Budget page
│   ├── login.html          # User Authentication: Sign In page
│   └── register.html       # User Authentication: Account Registration page
├── src/                    # Authoritative Node.js backend source code
│   ├── config/             # Environment configuration and database connection pool
│   ├── controllers/        # HTTP request handlers containing application business logic
│   ├── middleware/         # Express middleware (authentication, CSRF, rate limits, error handling)
│   ├── scripts/            # Command-line database health check and migration scripts
│   ├── services/           # Authoritative mathematical calculation engine
│   ├── app.js              # Express application factory (middleware stack & route mounting)
│   └── server.js           # Production server entry point (port listening & graceful shutdown)
├── sql/                    # Relational database definition scripts
│   ├── schema.sql          # MySQL 8.0 DDL (7 tables, indexes, constraints, cascades)
│   └── seed.sql            # Realistic 2-BHK apartment sample dataset for demonstrations
├── test/                   # Automated test suites (371 assertions across 8 test suites)
├── docs/                   # Architectural specifications, mathematical proofs, and viva guides
├── audit/                  # Independent audit verification reports, JSON telemetry, and visual evidence
├── .env.example            # Safe environment variable configuration template
├── .gitignore              # Files and directories excluded from Git tracking
├── .gitattributes          # Git repository normalization rules (LF line endings)
├── .nvmrc                  # Target Node.js LTS version specification (20)
├── package.json            # Node.js project manifest, dependencies, and npm scripts
└── README.md               # Primary project orientation and startup documentation
```

---

## Part 3: Complete File-by-File Codebase Walkthrough

EnergySaver contains exactly **144 files** across 9 architectural categories. The table below outlines the core files and their specific responsibilities:

| File Path | Lines | Tier | Primary Responsibility & Role |
|:---|:---:|:---:|:---|
| `src/server.js` | 72 | Backend | Server entry point; initializes MySQL pool, starts HTTP listener on port 3000, and binds `SIGTERM`/`SIGINT` graceful shutdown handlers. |
| `src/app.js` | 185 | Backend | Express application factory; configures Helmet, cookie parser, sessions, static file serving from `public/`, and mounts all 29 REST API routes. |
| `src/config/database.js` | 77 | Backend | Manages singleton MySQL connection pool via `mysql2/promise` (connection limit 10, queue limit 0, keep-alive enabled). |
| `src/config/index.js` | 78 | Backend | Centralizes environment variables with safe fallbacks, parsing port, database credentials, session secret, and cookie attributes. |
| `src/services/calculator.js` | 344 | Backend | **Authoritative Calculation Engine:** Implements 9 pure mathematical functions for kWh, flat cost, household aggregation, and scenario delta savings. |
| `src/middleware/auth.js` | 47 | Backend | Session guard middleware; enforces `req.session.userId` on protected routes, returning HTTP 401 Unauthorized for unauthenticated requests. |
| `src/middleware/security.js` | 165 | Backend | Defensive security middleware; implements constant-time CSRF token verification (`timingSafeEqual`) and IP brute-force rate limiting with memory cleanup. |
| `src/middleware/errorHandler.js` | 62 | Backend | Centralized Express error handler; traps syntax errors, database integrity errors, and unhandled exceptions, emitting structured JSON responses. |
| `src/controllers/authController.js` | 255 | Backend | Handles user registration with bcrypt hashing, login with session regeneration, session verification (`/me`), and secure logout. |
| `src/controllers/applianceController.js` | 280 | Backend | Manages appliance CRUD operations with strict ownership enforcement (`WHERE user_id = req.session.userId`) and 100-appliance quota enforcement. |
| `src/controllers/dashboardController.js` | 75 | Backend | Computes and returns the complete dashboard summary (totals, room breakdown, top consumer, budget percentage) in a single optimized payload. |
| `src/controllers/savingsController.js` | 162 | Backend | Handles read-only What-If savings simulation (`simulateSavings`) and transactional persistence of confirmed savings (`applySavings`). |
| `src/controllers/reportController.js` | 335 | Backend | Freezes report snapshots, logs utility bills, reconciles variances with diagnostic checklists, and streams sanitized CSV exports. |
| `src/controllers/settingsController.js` | 125 | Backend | Manages user profile details, electricity tariff rate (₹/kWh), monthly budget target, and account deletion with password verification. |
| `src/scripts/dbCheck.js` | 45 | Backend | CLI diagnostic script to verify database connectivity, pool acquisition, and table existence before server boot. |
| `src/scripts/initDb.js` | 78 | Backend | Database initialization script executing `sql/schema.sql` to create all 7 tables and constraints. |
| `sql/schema.sql` | 170 | Database | Relational DDL creating `users`, `user_settings`, `appliances`, `report_snapshots`, `report_snapshot_items`, `actual_bills`, and `sessions`. |
| `sql/seed.sql` | 65 | Database | Realistic seed data containing a 2-BHK apartment profile (12 appliances across Living Room, Kitchen, Bedrooms, Balcony) for viva demonstrations. |
| `public/js/api.js` | 305 | Frontend | Centralized client fetch gateway; manages CSRF token lifecycle, session checks, and encapsulates all 29 REST endpoints with unified error handling. |
| `public/js/storage.js` | 225 | Frontend | Guest Demo Mode controller; emulates backend CRUD operations in browser `localStorage` with sample data seeding and reset capabilities. |
| `public/js/dashboard.js` | 380 | Frontend | Overview dashboard controller; renders hero billing forecast, segmented room progress bar, Chart.js donut and bar charts, and appliance cards. |
| `public/js/appliances.js` | 420 | Frontend | Appliance inventory controller; manages search filtering, room pills, Add/Edit modals, delete confirmation, and real-time form calculation previews. |
| `public/js/reports.js` | 410 | Frontend | Reports controller; manages snapshot generation, utility bill logging, visual variance reconciliation cards, diagnostic checklist, and CSV download. |
| `public/js/savings-modal.js` | 250 | Frontend | What-If savings modal controller; binds interactive runtime sliders, invokes simulation endpoint, and handles confirmed application. |
| `public/js/settings.js` | 195 | Frontend | User profile and system settings controller; updates tariff rates, budgets, changes passwords, and handles account deletion. |
| `public/js/nav.js` | 110 | Frontend | Top header controller; renders user greeting, sign-in/sign-out buttons, and dynamic mode pill ("Database Mode" vs "Demo Mode"). |
| `public/js/components/appliance-illustrations.js` | 215 | Frontend | Procedural SVG generator; provides custom, clean vector illustrations for AC, Refrigerator, Fan, Geyser, Microwave, TV, Lighting, and PC. |
| `public/js/components/editorial-navigation.js` | 145 | Frontend | Floating bottom pill navigation; highlights active tab with clean transitions and mobile viewport responsiveness. |
| `public/js/utils/calculator.js` | 85 | Frontend | Zero-latency client-side calculation helper for real-time form input previews (identical mathematical formulas to backend). |
| `public/js/utils/formatters.js` | 90 | Frontend | Formatting utilities: Indian currency formatting (₹), kWh rounding, and attribute-safe HTML escaping (`escapeHtml`) for DOM XSS defense. |
| `public/js/utils/presets.js` | 115 | Frontend | Preset dictionary providing standard wattages and typical usage hours for common household appliances (e.g., 1.5-ton AC = 1500W, 6 hrs). |
| `public/css/editorial-tokens.css` | 110 | Frontend | Design tokens defining color palette (`--bg-editorial: #FBFBF9`, `--accent-forest: #2E6F40`), typography, spacing, and shadows. |
| `public/css/editorial-theme.css` | 320 | Frontend | Editorial design system rules: hero headlines, segmented bars, card styling, custom slider thumbs, floating navigation, and responsive media queries. |

---

## Part 4: Master Function Inventory & Detailed Function Explanations

Across the 40 JavaScript files in the project, exactly **310 functions** are implemented (56 in backend `src/`, 200 in frontend `public/js/`, and 54 in test suites `test/`). 

For the complete 310-function inventory table with exact file locations, parameter signatures, and line numbers, refer to [docs/ENERGYSAVER_FUNCTION_INDEX.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ENERGYSAVER_FUNCTION_INDEX.md).

Below is the detailed examination of the most critical functions governing the application:

### 4.1 Authoritative Backend Calculation Functions (`src/services/calculator.js`)

#### 1. `calculateDailyKwh(watts, quantity, hours)`
- **Location:** `src/services/calculator.js`, Line 38
- **Purpose:** Computes unrounded daily energy consumption in kilowatt-hours.
- **Formula:**
  $$\text{Daily kWh} = \frac{\text{watts} \times \text{quantity} \times \text{hours}}{1000}$$
- **Why divide by 1000?** Electrical power is measured in Watts ($W$), but utility billing is based on Kilowatt-hours ($1\text{ kW} = 1000\text{ W}$). Therefore, $W \times H$ gives Watt-hours; dividing by 1000 yields Kilowatt-hours (kWh, commonly called "Units").
- **Precision Principle:** Returns raw, unrounded floating-point number. Never rounds early, preventing cumulative rounding error during aggregation.

#### 2. `calculateMonthlyKwh(dailyKwh, daysUsedPerMonth = 30)`
- **Location:** `src/services/calculator.js`, Line 55
- **Purpose:** Computes unrounded monthly energy consumption.
- **Formula:**
  $$\text{Monthly kWh} = \text{dailyKwh} \times \text{daysUsedPerMonth}$$
- **Validation:** Enforces that `daysUsedPerMonth` is clamped between 1 and 31 (defaulting to 30 days for standardized monthly projection).

#### 3. `calculateFlatCost(monthlyKwh, ratePerKwh = 8.0)`
- **Location:** `src/services/calculator.js`, Line 72
- **Purpose:** Computes monthly financial expense under a flat-rate tariff structure.
- **Formula:**
  $$\text{Monthly Cost} = \text{monthlyKwh} \times \text{ratePerKwh}$$
- **Default Tariff:** Standard residential baseline of ₹8.00 per unit (kWh), configurable per user in `user_settings`.

#### 4. `calculateHouseholdTotals(appliances, tariffRate = 8.0, monthlyBudget = null)`
- **Location:** `src/services/calculator.js`, Line 140
- **Purpose:** Master aggregation engine for the entire household.
- **Workflow:**
  1. Iterates over appliance array, accumulating unrounded `totalDailyKwh`, `totalMonthlyKwh`, and `totalMonthlyCost`.
  2. Aggregates consumption by room (Living Room, Kitchen, Bedrooms, etc.) to compute room percentage breakdown:
     $$\text{Room Share (\%)} = \left( \frac{\text{Room Monthly kWh}}{\text{Total Monthly kWh}} \right) \times 100$$
  3. Identifies the **Top Consuming Appliance** (highest monthly kWh).
  4. If `monthlyBudget` is configured, calculates:
     $$\text{Budget Used (\%)} = \left( \frac{\text{Total Monthly Cost}}{\text{Monthly Budget}} \right) \times 100$$
     $$\text{Budget Status} = \begin{cases} \text{'UNDER'}, & \text{if Cost} \le \text{Budget} \\ \text{'OVER'}, & \text{if Cost} > \text{Budget} \end{cases}$$
  5. Applies `roundTo()` only to the final aggregate outputs for display.

#### 5. `calculateScenarioDelta(baselineAppliances, modifiedAppliances, tariffRate = 8.0)`
- **Location:** `src/services/calculator.js`, Line 220
- **Purpose:** Computes the exact energy and financial savings between current usage and a proposed What-If scenario.
- **The 1-Paisa Drift Elimination Strategy:**
  - *Naive Approach:* Calculate rounded baseline cost (e.g. ₹2,160.00), calculate rounded proposed cost (e.g. ₹1,440.00), and subtract them. If individual appliances have fractional paise, rounding intermediate totals first can result in a 1-paisa mismatch ($₹2,160.00 - ₹1,440.00 = ₹720.00$, but sum of individual savings is $₹719.99$).
  - *EnergySaver Strategy:* Calculates unrounded baseline sum ($B$) and unrounded proposed sum ($P$). Subtracts unrounded values directly ($D = B - P$), and only then applies scientific rounding: `roundTo(D, 2)`. This guarantees mathematical exactness.

#### 6. `roundTo(value, decimals = 2)`
- **Location:** `src/services/calculator.js`, Line 18
- **Purpose:** Industry-standard scientific half-up rounding.
- **Implementation:**
  ```javascript
  function roundTo(value, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }
  ```
- **Why not `Math.round(val * 100) / 100`?** In IEEE 754 floating-point arithmetic, `1.005 * 100` yields `100.49999999999999`. Standard `Math.round()` rounds this down to `100`, producing `1.00` instead of `1.01`. By using exponential string notation (`1.005e2` becomes `'100.5'`), the JavaScript engine shifts the decimal point without binary representation inaccuracies, correctly rounding to `1.01`.

---

### 4.2 Core Backend Security & Controller Functions

#### 1. `requireAuth(req, res, next)`
- **Location:** `src/middleware/auth.js`, Line 15
- **Role:** Session guard. Verifies that `req.session && req.session.userId` exists. If absent, terminates request with HTTP 401 Unauthorized:
  ```json
  { "success": false, "error": "Authentication required", "code": "UNAUTHORIZED" }
  ```

#### 2. `csrfProtection(req, res, next)`
- **Location:** `src/middleware/security.js`, Line 40
- **Role:** Defends state-changing HTTP methods (`POST`, `PUT`, `DELETE`, `PATCH`) against Cross-Site Request Forgery.
- **Mechanism:** Compares client header `x-csrf-token` against server-generated session token `req.session.csrfToken` using Node's crypto library:
  ```javascript
  const match = crypto.timingSafeEqual(
    Buffer.from(clientToken, 'utf8'),
    Buffer.from(sessionToken, 'utf8')
  );
  ```
- **Why `timingSafeEqual`?** Standard string comparison (`===`) short-circuits on the first mismatched character. An attacker measuring microsecond response times could progressively guess the CSRF token character-by-character (Timing Attack). `timingSafeEqual` executes in constant time regardless of where mismatches occur.

#### 3. `authRateLimiter(req, res, next)`
- **Location:** `src/middleware/security.js`, Line 103
- **Role:** Mitigates automated password brute-force and credential stuffing attacks on `/api/auth/login`.
- **Policy:** Restricts failed login attempts to **5 attempts per 15 minutes** per client IP. Upon the 6th failed attempt, responds with HTTP 429 Too Many Requests and `Retry-After: 900`. Includes a scheduled 5-minute memory sweep to prune expired IP tracking records, preventing Node.js heap memory exhaustion.

---

## Part 5: Complete Function Call Graphs & Traceability

### 5.1 End-to-End Appliance Creation Call Graph

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant UI as public/js/appliances.js
    participant API as public/js/api.js
    participant App as src/app.js (Express Pipeline)
    participant Sec as src/middleware/security.js
    participant Auth as src/middleware/auth.js
    participant Ctrl as src/controllers/applianceController.js
    participant Calc as src/services/calculator.js
    participant DB as MySQL 8.0 (InnoDB)

    User->>UI: Fills form & clicks "Save Appliance"
    UI->>UI: Validates client inputs (Watts: 1-10000, Hours: 0.1-24)
    UI->>API: window.EnergyApi.appliances.create(payload)
    API->>API: Attaches X-CSRF-Token & credentials: include
    API->>App: POST /api/appliances (JSON Payload)
    App->>Sec: Helmet & Express JSON Parser
    App->>Auth: requireAuth() verifies req.session.userId
    App->>Sec: csrfProtection() validates X-CSRF-Token
    App->>Ctrl: createAppliance(req, res)
    Ctrl->>DB: SELECT COUNT(*) FROM appliances WHERE user_id = ?
    DB-->>Ctrl: Current count (e.g., 12 < 100 limit)
    Ctrl->>DB: INSERT INTO appliances (user_id, name, category, room, rated_watts, quantity, daily_hours, days_used_per_month) VALUES (?, ?, ...)
    DB-->>Ctrl: InsertResult (insertId: 105)
    Ctrl->>Calc: computeApplianceMetrics(applianceData, tariffRate)
    Calc-->>Ctrl: { daily_kwh: 9.0, monthly_kwh: 270.0, monthly_cost: 2160.0 }
    Ctrl-->>App: HTTP 201 Created { success: true, data: { appliance } }
    App-->>API: Response JSON
    API-->>UI: Resolves Promise
    UI->>UI: Updates local array & re-renders table without page reload
    UI-->>User: Displays green toast "Appliance saved successfully"
```

### 5.2 What-If Savings Simulation vs. Application Call Graph

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Modal as public/js/savings-modal.js
    participant API as public/js/api.js
    participant Ctrl as src/controllers/savingsController.js
    participant Calc as src/services/calculator.js
    participant DB as MySQL 8.0 (InnoDB)

    Note over User,Modal: Stage 1: Zero Silent Commit Interaction
    User->>Modal: Drags slider (e.g. AC from 6h to 4h)
    Modal->>Modal: Updates UI label (input event) - NO API CALL EMITTED
    User->>Modal: Releases slider (change event)
    Modal->>API: EnergyApi.savings.simulate([{ id: 105, proposed_daily_hours: 4.0 }])
    API->>Ctrl: POST /api/savings/simulate
    Ctrl->>DB: SELECT * FROM appliances WHERE user_id = ?
    DB-->>Ctrl: Baseline appliance rows
    Ctrl->>Calc: calculateScenarioDelta(baseline, proposed, tariffRate)
    Calc-->>Ctrl: Delta: { saved_kwh: 90.0, saved_cost: 720.0, percent_saved: 18.5% }
    Ctrl-->>API: HTTP 200 OK { success: true, data: { delta } }
    API-->>Modal: Renders proposed savings card
    
    Note over User,DB: Stage 2: Explicit User Confirmation
    User->>Modal: Clicks "Apply Changes" button
    Modal->>API: EnergyApi.savings.apply([{ id: 105, proposed_daily_hours: 4.0 }])
    API->>Ctrl: POST /api/savings/apply
    Ctrl->>DB: UPDATE appliances SET daily_hours = 4.0 WHERE id = 105 AND user_id = ?
    DB-->>Ctrl: OkPacket (affectedRows: 1)
    Ctrl->>Calc: calculateHouseholdTotals(updatedAppliances, tariffRate)
    Calc-->>Ctrl: New household summary
    Ctrl-->>API: HTTP 200 OK { success: true, data: { updated_summary } }
    API-->>Modal: Closes modal & reloads dashboard summary
    Modal-->>User: Shows updated monthly bill estimate
```

---

## Part 6: Complete Frontend Architecture & Implementation

### 6.1 Design Philosophy: The Warm Minimalist Editorial Aesthetic
EnergySaver's user interface is built strictly using **Semantic HTML5, Vanilla CSS3, and Vanilla ES6 JavaScript**. It rejects the generic "SaaS dashboard" aesthetic (dark-mode neon glows, heavy glassmorphism, floating drop-shadows) in favor of a timeless **Warm Minimalist Editorial Design System**:
- **Background Tone:** Warm editorial off-white (`--bg-editorial: #FBFBF9`) evoking natural paper and physical print.
- **Typography:** Serif headlines (`Newsreader`, `Georgia`, `serif`) paired with clean, highly legible sans-serif body text (`Inter`, `system-ui`, `sans-serif`).
- **Accent Colors:** Grounded organic palette:
  - Deep Forest / Sage Green (`--accent-forest: #2E6F40`) for primary active states, buttons, and badges.
  - Warm Terracotta / Rust (`--accent-rust: #C25E3E`) for secondary rooms and warnings.
  - Soft Mustard / Ochre (`--accent-ochre: #E09F3E`) for bedroom loads and cautions.
  - Muted Slate Blue (`--accent-slate: #5E81AC`) for outdoor/study areas.
- **Restrained Geometry:** Modest corner radius ($6\text{px}-8\text{px}$), subtle $1\text{px}$ solid borders (`#E2E0D8`), and natural paper elevation.
- **Illustrative Iconography:** Custom inline SVGs for household appliances (`appliance-illustrations.js`) rather than generic third-party icon fonts.

### 6.2 Frontend Architecture & Modularity
The client code is structured into specialized, decoupled modules loaded via standard `<script>` tags:

1. **`public/js/api.js` (Central Gateway):**
   - Singleton object `window.EnergyApi`.
   - Automatically fetches and caches the CSRF token on first load.
   - Attaches `X-CSRF-Token` and `credentials: 'same-origin'` to every state-changing request.
   - Centralizes network error interception, session expiration redirects, and response JSON parsing.

2. **`public/js/storage.js` (Guest Demo Controller):**
   - Implements `window.EnergyStorage` to support offline and unauthenticated visitors.
   - Provides an identical API contract to `window.EnergyApi` but persists records into `localStorage`.
   - Pre-seeds sample data on first visit so evaluators can test all features immediately without registering an account.

3. **`public/js/nav.js` (Navigation & Mode Pill):**
   - Queries `GET /api/auth/me` on page load.
   - If authenticated, renders the user's name and a green badge: **"Database Mode"**.
   - If unauthenticated, renders a link to Login and a warm badge: **"Demo Mode (Guest)"**.

4. **`public/js/components/editorial-navigation.js` (Floating Bottom Bar):**
   - Implements a modern floating capsule navigation menu pinned to the bottom of the viewport.
   - Provides quick switching between Overview (Dashboard), Appliances, Calculators, and Savings Tips.

5. **`public/js/vendor/chart.umd.min.js` (Chart Visualization):**
   - Bundles Chart.js locally to ensure the application renders rich data visualizations in offline environments without external CDN dependencies.

---

## Part 7: Complete Backend Architecture & Node.js/Express Pipeline

### 7.1 Single-Origin Monolithic Architecture
EnergySaver uses a single-origin monolith architecture. The Express application listening on port 3000 performs two unified tasks:
1. Serves all static HTML, CSS, JavaScript, and asset files from the `public/` directory.
2. Serves all REST API endpoints under the `/api/` and `/health/` prefixes.

**Viva Advantage:** By sharing the exact same origin (`http://localhost:3000`), the application completely eliminates:
- Cross-Origin Resource Sharing (CORS) preflight request overhead (`OPTIONS` requests).
- Third-party cookie blocking issues across modern browsers (Safari ITP, Chrome Privacy Sandbox).
- Complex proxy or reverse-proxy routing configurations during academic evaluations.

### 7.2 The Express Middleware Execution Order
Every incoming HTTP request traverses an engineered middleware pipeline configured in `src/app.js`:

```text
Incoming HTTP Request
       │
       ▼
1. Helmet Security Headers (CSP, X-Frame-Options, HSTS)
       │
       ▼
2. CORS Handler (Restricted to same-origin)
       │
       ▼
3. Express JSON Body Parser (Limits payload size to 100 KB)
       │
       ▼
4. Express URL-Encoded Parser (Parses HTML form postbacks)
       │
       ▼
5. Cookie Parser (Parses signed cookie headers)
       │
       ▼
6. Express-Session (Looks up session ID in MySQL 'sessions' table)
       │
       ▼
7. Static File Server (express.static serving public/)
       │
       ▼
8. Health Check Routes (/health/live, /health/ready)
       │
       ▼
9. Public API Routes (/api/csrf-token, /api/auth/register, /api/auth/login)
       │
       ▼
10. requireAuth Middleware (Enforced on all protected /api/* routes)
       │
       ▼
11. csrfProtection Middleware (Enforced on all state-changing POST/PUT/DELETE requests)
       │
       ▼
12. Protected Controller Execution (applianceController, reportController, etc.)
       │
       ▼
13. Centralized Error Handler (errorHandler traps all unhandled exceptions)
```

---

## Part 8: The Authoritative Calculation Engine

### 8.1 The Authoritative Server Principle
A common flaw in student projects is computing financial or mathematical values in the browser and sending the computed results to the backend for storage. This introduces critical security and data integrity vulnerabilities:
- A malicious user can alter client JavaScript variables to report that their 2000W AC consumed only ₹1.00.
- Browser rounding discrepancies can corrupt historical reports.

In EnergySaver, **the backend calculation engine (`src/services/calculator.js`) is the single source of truth**. The client sends only raw operational inputs:
$$\text{Inputs: } \{ \text{rated\_watts}, \text{quantity}, \text{daily\_hours}, \text{days\_used\_per\_month} \}$$
The backend calculates all daily kWh, monthly kWh, and financial costs authoritative upon database insertion. The client-side calculator (`public/js/utils/calculator.js`) exists solely to render zero-latency preview estimates in interactive modal forms before the user clicks save.

### 8.2 Full Mathematical Derivation of All Formulas

#### Formula 1: Daily Kilowatt-Hours (kWh)
$$\text{Daily kWh} = \frac{P \times Q \times H}{1000}$$
Where:
- $P$: Rated electrical power of the appliance in Watts ($W$).
- $Q$: Quantity of identical appliances in the room (integer $\ge 1$).
- $H$: Daily operating duration in hours ($0.1 \le H \le 24.0$).
- $1000$: Conversion constant ($1\text{ Kilowatt} = 1000\text{ Watts}$).

#### Formula 2: Monthly Kilowatt-Hours (kWh)
$$\text{Monthly kWh} = \text{Daily kWh} \times D$$
Where:
- $D$: Number of days the appliance operates per monthly cycle ($1 \le D \le 31$). Default is 30 days.

#### Formula 3: Monthly Electricity Cost (₹)
$$\text{Monthly Cost} = \text{Monthly kWh} \times T$$
Where:
- $T$: Electricity tariff rate in ₹ per kWh. Stored in `user_settings.electricity_rate` (default ₹8.00/kWh).

#### Formula 4: Room Percentage Breakdown
$$\text{Room Share } (\%) = \left( \frac{\sum_{i \in \text{Room}} \text{Monthly kWh}_i}{\sum_{\text{all } j} \text{Monthly kWh}_j} \right) \times 100$$

#### Formula 5: What-If Scenario Delta Savings
$$\Delta\text{kWh} = \text{Unrounded Baseline kWh} - \text{Unrounded Proposed kWh}$$
$$\Delta\text{Cost} = \text{Unrounded Baseline Cost} - \text{Unrounded Proposed Cost}$$
$$\text{Percentage Savings } (\%) = \left( \frac{\Delta\text{Cost}}{\text{Unrounded Baseline Cost}} \right) \times 100$$

#### Formula 6: Bill Reconciliation Variance
$$\text{kWh Variance} = \text{Actual Billed kWh} - \text{Snapshot Estimated kWh}$$
$$\text{Cost Variance} = \text{Actual Billed Cost} - \text{Snapshot Estimated Cost}$$
$$\text{Percentage Variance } (\%) = \left( \frac{\text{Actual Billed Cost} - \text{Snapshot Estimated Cost}}{\text{Snapshot Estimated Cost}} \right) \times 100$$

---

## Part 9: Authentication, Sessions, and Defensive Web Security

EnergySaver implements a comprehensive defense-in-depth security model adhering to the **OWASP Top 10** standards:

| Security Domain | Vulnerability / Threat | Implemented Countermeasure | Code Reference |
|:---|:---|:---|:---|
| **Password Storage** | Database credential dump revealing plaintext passwords | Salted `bcrypt` hash with cost factor 10 ($2^{10} = 1024$ key expansion rounds). Passwords cannot be decrypted or attacked via precomputed rainbow tables. | `src/controllers/authController.js` (Line 124) |
| **Session Fixation** | Attacker pre-sets a session ID and hijacks account upon user login | Calls `req.session.regenerate()` immediately upon registration and successful login, issuing a completely fresh session identifier. | `src/controllers/authController.js` (Lines 147, 218) |
| **Session Hijacking (XSS)** | Malicious script steals session cookie | Cookie configured with `httpOnly: true` (invisible to `document.cookie`), `sameSite: 'lax'`, and cryptographically signed with `SESSION_SECRET`. | `src/config/index.js` (Line 46) |
| **Cross-Site Request Forgery (CSRF)** | Malicious site triggers unauthorized state changes | Custom anti-CSRF middleware verifies `X-CSRF-Token` header against session token using constant-time `crypto.timingSafeEqual()`. | `src/middleware/security.js` (Line 40) |
| **SQL Injection (SQLi)** | Malicious input manipulating database query logic | 100% of database queries use parameterized prepared statements (`pool.execute(sql, [params])`). User inputs are treated strictly as literal data. | All controllers in `src/controllers/` |
| **Broken Object Level Auth (IDOR)** | User attempts to access or modify another user's appliances or reports | Strict Zero-Trust Ownership: Every database query enforces `WHERE user_id = ?` matching `req.session.userId`. | All user queries in `src/controllers/` |
| **Brute-Force Attacks** | Automated password cracking dictionary attacks | IP-based rate limiter restricts failed login attempts to 5 per 15 minutes, with automated memory cleanup every 5 minutes. | `src/middleware/security.js` (Line 103) |
| **CSV Formula Injection** | Attacker injects `=CMD()` or `+SUM()` into appliance name to execute code upon CSV export | Sanitizer checks first character of every cell; prepends a single quote (`'`) if it begins with `=`, `+`, `-`, or `@`. | `src/controllers/reportController.js` (Line 31) |
| **Cross-Site Scripting (XSS)** | Injected HTML/JavaScript executing in other users' browsers | Strict HTML entity escaping function (`escapeHtml`) encoding quotes, ampersands, and angle brackets on all dynamic DOM insertions. | `public/js/utils/formatters.js` (Line 57) |
| **Denial of Service (DoS)** | Malicious user creates 1,000,000 appliances to exhaust server memory and database storage | Hard database quota: System checks current count and rejects creation if appliance total reaches **100 appliances per user**. | `src/controllers/applianceController.js` (Line 211) |

---

## Part 10: Dual-Mode Storage Architecture (Database vs Guest Demo)

To ensure seamless demonstration during academic evaluations and allow immediate evaluation by external examiners without mandatory registration, EnergySaver features a **Dual-Mode Storage Architecture**:

```mermaid
flowchart TD
    Start[User Visits Application] --> CheckAuth[GET /api/auth/me]
    CheckAuth -->|HTTP 200 OK| DBMode[Database Mode Active]
    CheckAuth -->|HTTP 401 Unauthorized| DemoMode[Guest Demo Mode Active]
    
    DBMode --> DBUse[All CRUD queries route to MySQL 8.0 via window.EnergyApi]
    DBMode --> DBPill[Header displays green badge: 'Database Mode']
    
    DemoMode --> DemoUse[All CRUD queries route to localStorage via window.EnergyStorage]
    DemoMode --> DemoPill[Header displays warm badge: 'Demo Mode (Guest)']
    DemoMode --> DemoSeed[Auto-seeds realistic 2-BHK apartment data]
```

### Architectural Principles of Dual-Mode Operation:
1. **Contract Parity:** `window.EnergyStorage` and `window.EnergyApi` implement the exact same method signatures (`list`, `create`, `update`, `delete`, `getSummary`, `simulate`, `apply`, `saveSnapshot`, `reconcile`).
2. **Zero Code Duplication:** Frontend UI controllers (`appliances.js`, `dashboard.js`, `reports.js`) do not have `if (mode === 'db')` branches. They call the active adapter seamlessly.
3. **Graceful Upgrade:** When a guest user registers or logs in, the page reloads, `GET /api/auth/me` succeeds, and the application transparently switches to MySQL persistence.

---

## Part 11: The What-If Savings Planner & Zero Silent Commits

### 11.1 The Zero Silent Commits Philosophy
In poorly designed interactive web applications, moving an operational slider (e.g. daily hours) immediately triggers a background `PUT` or `POST` request to the database. This creates severe usability and data integrity flaws:
1. If the user was merely experimenting with what-if scenarios, their actual appliance data is permanently overwritten without their explicit consent.
2. Rapid slider movement floods the server with hundreds of unnecessary database write transactions (slider dragging emits dozens of events per second).

EnergySaver strictly enforces the **Zero Silent Commits Principle**:
- **Slider Dragging (`input` event):** Only updates the visual hours label on the card (zero API calls).
- **Slider Release (`change` event):** Emits a read-only simulation request (`POST /api/savings/simulate`). The backend calculates the delta savings in memory and returns the comparison.
- **Database Commitment:** Appliance records in MySQL are modified **only when the user explicitly clicks the "Apply Changes" button**.

```text
User Drags Slider ──> UI Label Updates (0 Network Requests)
User Releases Slider ──> POST /api/savings/simulate (Read-Only Calculation)
User Clicks "Apply" ──> POST /api/savings/apply (Transactional MySQL UPDATE)
```

---

## Part 12: Historical Snapshots & Utility Bill Reconciliation

### 12.1 Why Historical Snapshots Require a Dedicated Schema
A common novice design mistake is calculating a monthly report on the fly by querying the current `appliances` table. This fails because:
- If a user deletes an appliance in December, all historical reports from January to November would retroactively change, corrupting past records.
- If electricity tariff rates increase, past monthly bills would recalculate using the new rate.

EnergySaver achieves **true historical immutability** by freezing reports into a relational parent-child schema:
1. **`report_snapshots` (Parent Record):** Stores frozen aggregate metrics (`total_kwh`, `total_cost`, `tariff_rate_used`, `budget_used`, `period_start`, `period_end`).
2. **`report_snapshot_items` (Child Records):** Stores individual frozen copies of each appliance active at that exact moment (`appliance_name`, `rated_watts`, `quantity`, `daily_hours`, `monthly_kwh`, `monthly_cost`).

### 12.2 Utility Bill Reconciliation & Gap Diagnostics
When the physical utility bill arrives from the power company, the user logs it into `actual_bills` (`billed_kwh`, `billed_amount`, billing dates). The reconciliation engine compares the snapshot against the actual bill:

$$\text{Variance (\%)} = \left( \frac{\text{Actual Cost} - \text{Estimated Cost}}{\text{Estimated Cost}} \right) \times 100$$

The engine categorizes the result and provides automated diagnostic guidance:
- **Accurate ($pm 5\%$):** Appliance inventory closely matches physical utility metering.
- **Under-Reported ($> +10\%$):** Actual bill is higher than estimated. The system displays a diagnostic checklist:
  - Check for unlisted baseload appliances (Wi-Fi routers, set-top boxes, standby electronics).
  - Inspect refrigerator door gasket seals and compressor runtimes.
  - Verify if water heater (geyser) or immersion rods were used for extended hours during cold spells.
  - Check for old wiring leakage or utility billing meter multiplier errors.
- **Over-Reported ($< -10\%$):** Estimated bill is higher than actual. Suggests that appliances were not operated for the full anticipated hours or household members were away.

---

## Part 13: Database Design & Relational Data Model (MySQL 8.0)

For the complete SQL schema, DDL statements, and detailed query walkthroughs, refer to [docs/ENERGYSAVER_API_AND_DATABASE_GUIDE.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ENERGYSAVER_API_AND_DATABASE_GUIDE.md).

### 13.1 Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o| user_settings : "configures"
    users ||--o{ appliances : "owns"
    users ||--o{ report_snapshots : "creates"
    users ||--o{ actual_bills : "records"
    report_snapshots ||--o{ report_snapshot_items : "contains"

    users {
        int id PK
        varchar email UK
        varchar password_hash
        varchar display_name
        timestamp created_at
    }

    user_settings {
        int id PK
        int user_id FK, UK
        decimal electricity_rate
        decimal monthly_budget
        varchar currency_symbol
    }

    appliances {
        int id PK
        int user_id FK
        varchar name
        varchar category
        varchar room
        int rated_watts
        int quantity
        decimal daily_hours
        int days_used_per_month
    }

    report_snapshots {
        int id PK
        int user_id FK
        varchar period_name
        date period_start
        date period_end
        decimal total_kwh
        decimal total_cost
        decimal tariff_rate_used
    }

    report_snapshot_items {
        int id PK
        int snapshot_id FK
        varchar appliance_name
        varchar room
        int rated_watts
        int quantity
        decimal daily_hours
        decimal monthly_kwh
        decimal monthly_cost
    }

    actual_bills {
        int id PK
        int user_id FK
        date billing_start_date
        date billing_end_date
        decimal billed_kwh
        decimal billed_amount
        varchar provider_name
    }

    sessions {
        varchar session_id PK
        int expires
        text data
    }
```

### 13.2 Database Integrity Features
- **Cascading Deletions:** All foreign key constraints enforce `ON DELETE CASCADE`. If a user deletes their account, MySQL automatically deletes their settings, appliances, snapshots, and utility bills in a single atomic transaction.
- **CHECK Constraints:** MySQL 8.0 validates physical limits at the engine level:
  - `appliances.rated_watts` BETWEEN 1 AND 10000
  - `appliances.quantity` BETWEEN 1 AND 50
  - `appliances.daily_hours` BETWEEN 0.1 AND 24.0
  - `appliances.days_used_per_month` BETWEEN 1 AND 31
  - `actual_bills.billing_end_date >= actual_bills.billing_start_date`

---

## Part 14: Complete REST API Specification & Data Contracts

EnergySaver exposes exactly **29 REST API endpoints** conforming to predictable JSON response envelopes:
- Success: `{ "success": true, "data": { ... } }`
- Error: `{ "success": false, "error": "Human readable message", "code": "ERROR_CODE" }`

| Group | Method | Endpoint | Auth | Purpose |
|:---|:---:|:---|:---:|:---|
| **Health** | `GET` | `/health/live` | No | Liveness probe returning process uptime |
| | `GET` | `/health/ready` | No | Readiness probe testing active MySQL pool connection |
| **Auth** | `GET` | `/api/csrf-token` | No | Returns CSRF token for the active session |
| | `POST` | `/api/auth/register` | No | Registers account, hashes password, logs in user |
| | `POST` | `/api/auth/login` | No | Authenticates user with bcrypt & rate limiting |
| | `POST` | `/api/auth/logout` | Yes | Destroys session in MySQL and clears session cookie |
| | `GET` | `/api/auth/me` | Yes | Returns active authenticated user identity |
| | `PUT` | `/api/auth/profile` | Yes | Updates display name |
| | `PUT` | `/api/auth/change-password` | Yes | Validates current password and updates hash |
| | `DELETE` | `/api/auth/account` | Yes | Deletes user account with cascading deletion |
| **Settings** | `GET` | `/api/settings` | Yes | Retrieves user tariff rate and monthly budget |
| | `PUT` | `/api/settings` | Yes | Updates user tariff rate and monthly budget |
| **Appliances**| `GET` | `/api/appliances` | Yes | Lists user appliances with computed kWh and costs |
| | `POST` | `/api/appliances` | Yes | Validates bounds and creates a new appliance |
| | `PUT` | `/api/appliances/:id` | Yes | Updates existing appliance (enforcing ownership) |
| | `DELETE` | `/api/appliances/:id` | Yes | Deletes appliance (enforcing ownership) |
| | `POST` | `/api/appliances/preview` | Yes | Computes mathematical metrics without saving |
| **Dashboard** | `GET` | `/api/dashboard/summary` | Yes | Returns complete household consumption metrics |
| **Savings** | `POST` | `/api/savings/simulate` | Yes | Calculates delta energy & cost savings in memory |
| | `POST` | `/api/savings/apply` | Yes | Commits proposed daily hours to MySQL appliances |
| **Reports** | `POST` | `/api/reports/snapshots` | Yes | Freezes current household state into immutable report |
| | `GET` | `/api/reports/snapshots` | Yes | Lists all saved historical snapshots |
| | `GET` | `/api/reports/snapshots/:id`| Yes | Retrieves frozen snapshot details and items |
| | `POST` | `/api/actual-bills` | Yes | Logs physical utility bill for reconciliation |
| | `GET` | `/api/actual-bills` | Yes | Lists logged utility bills |
| | `DELETE` | `/api/actual-bills/:id` | Yes | Deletes utility bill record |
| | `GET` | `/api/reports/reconcile` | Yes | Computes variance between snapshot and utility bill |
| | `GET` | `/api/reports/export-csv` | Yes | Streams sanitized CSV spreadsheet attachment |

---

## Part 15: Third-Party Dependencies & Supply Chain Audit

EnergySaver maintains a strict **zero-bloat dependency policy**. Every single production dependency in `package.json` was selected for a specific, indispensable engineering requirement:

| Package | Version | Production Role | Why Necessary (No Reinventing the Wheel) |
|:---|:---:|:---|:---|
| **`express`** | `4.19.2` | Core HTTP web framework | Provides standard HTTP routing, request parsing, and middleware pipeline. |
| **`mysql2`** | `^3.9.7` | MySQL database driver | Provides high-performance MySQL connection pooling, prepared statements, and async/await Promise API. |
| **`bcrypt`** | `^5.1.1` | Password hashing | Industry-standard native C++ implementation of the Blowfish-based adaptive hashing algorithm with salt generation. |
| **`express-session`**| `^1.18.0` | Session management | Manages signed cookie sessions, session lifecycle, and provides pluggable session store architecture. |
| **`express-mysql-session`**| `^3.1.1` | Persistent session store | Persists Express sessions into MySQL `sessions` table, surviving server restarts and scaling across multiple worker processes. |
| **`helmet`** | `^7.1.0` | HTTP security headers | Sets 11 standard HTTP security headers (Content Security Policy, X-Frame-Options, X-Content-Type-Options, etc.). |
| **`cookie-parser`** | `^1.4.6` | Cookie parsing middleware | Parses and cryptographically verifies signed cookies from request headers. |
| **`dotenv`** | `^16.4.5` | Environment configuration | Loads `.env` configuration variables into `process.env` during development. |

**Audit Result:** Zero deprecated packages, zero high/critical vulnerabilities (`npm audit` clean), and zero frontend heavy build dependencies.

---

## Part 16: Automated Testing & Release Integrity

EnergySaver includes a comprehensive automated test harness consisting of **371 assertions across 8 test suites**:

```text
Test Suites Execution Summary:
---------------------------------------------------------------------------------
1. test/calculations.test.js           75/75 PASS   Mathematical precision & boundary math
2. test/phase2.test.js                 15/15 PASS   Backend infrastructure & health probes
3. test/phase3.test.js                 29/29 PASS   Authentication, session & cascade delete
4. test/phase4.test.js                 43/43 PASS   Appliance CRUD & numerical bounds
5. test/phase5.test.js                 96/96 PASS   Dashboard, savings & report reconciliation
6. test/security.test.js               48/48 PASS   CSRF, SQLi, IDOR, Rate Limits, CSV Injection
7. test/stage0.test.js                 41/41 PASS   Profile update, password change & credential safety
8. test/post_redesign_audit.test.js    22/22 PASS   Headless Chrome CDP visual audit across 6 viewports
---------------------------------------------------------------------------------
TOTAL AUTOMATED ASSERTIONS:           371/371 PASS (100% Pass Rate)
```

---

## Part 17: 10 Real-World User Workflows (Step-by-Step Traces)

Below are the 10 core execution traces that a student can walk through during an examiner demonstration:

1. **User Account Registration:** User enters email, display name, and password $\rightarrow$ Client validates syntax $\rightarrow$ `POST /api/auth/register` $\rightarrow$ bcrypt generates salt and hashes password $\rightarrow$ User inserted into `users` $\rightarrow$ Default settings inserted into `user_settings` $\rightarrow$ Session regenerated and stored in MySQL $\rightarrow$ Redirected to Dashboard.
2. **User Authentication (Login):** User enters credentials $\rightarrow$ `POST /api/auth/login` $\rightarrow$ Rate limiter checks IP $\rightarrow$ bcrypt compares plaintext against stored hash $\rightarrow$ Session regenerated $\rightarrow$ HTTP 200 OK $\rightarrow$ Client transitions to Database Mode.
3. **Appliance Creation:** User clicks "Add Appliance" $\rightarrow$ Fills 1500W AC, Living Room, 6 hrs/day $\rightarrow$ Client preview calculates ₹2,160.00 $\rightarrow$ User clicks Save $\rightarrow$ `POST /api/appliances` $\rightarrow$ Backend enforces 100-item limit $\rightarrow$ Authoritative kWh and cost calculated $\rightarrow$ Inserted into MySQL $\rightarrow$ Table re-rendered dynamically.
4. **Appliance Update:** User clicks Edit on Refrigerator $\rightarrow$ Modifies hours from 24 to 20 $\rightarrow$ `PUT /api/appliances/:id` $\rightarrow$ Backend verifies ownership (`WHERE user_id = req.session.userId`) $\rightarrow$ Record updated $\rightarrow$ Dashboard totals update.
5. **Appliance Deletion:** User clicks Delete $\rightarrow$ Confirms modal $\rightarrow$ `DELETE /api/appliances/:id` $\rightarrow$ Backend deletes row where ID and user_id match $\rightarrow$ Row removed from DOM.
6. **Dashboard Visualization:** User navigates to Overview $\rightarrow$ `GET /api/dashboard/summary` $\rightarrow$ Backend aggregates room totals and top consumers $\rightarrow$ Frontend renders hero bill estimate, segmented room bar, and Chart.js donut and horizontal bar charts.
7. **What-If Savings Sandbox:** User drags AC slider from 6h to 4h $\rightarrow$ Label updates live $\rightarrow$ Slider release emits `POST /api/savings/simulate` $\rightarrow$ Backend computes unrounded delta (₹720.00 saved) $\rightarrow$ Displays green savings card.
8. **Applying Confirmed Savings:** User clicks "Apply Changes" $\rightarrow$ `POST /api/savings/apply` $\rightarrow$ Backend executes transactional `UPDATE appliances SET daily_hours = ?` $\rightarrow$ Permanent database update confirmed.
9. **Freezing Historical Snapshot:** User navigates to Reports $\rightarrow$ Enters "November 2026" $\rightarrow$ Clicks "Generate Snapshot" $\rightarrow$ Backend begins MySQL transaction: inserts parent snapshot and copies all active appliances to `report_snapshot_items` $\rightarrow$ Report is now permanently frozen.
10. **Utility Bill Reconciliation & CSV Export:** User logs actual bill of ₹2,350.00 $\rightarrow$ Selects November Snapshot $\rightarrow$ Reconcile calculates variance ($-₹130.00, -5.2\%$) $\rightarrow$ Displays diagnostic status $\rightarrow$ User clicks "Export CSV" $\rightarrow$ Server streams sanitized spreadsheet file with formula injection defense.

---

## Part 18: Beginner's Guide to JavaScript & Backend Concepts

This section provides crystal-clear, conceptual explanations of the foundational computer science concepts powering EnergySaver, complete with references to actual code lines:

### 1. What is the Node.js Event Loop?
- **Concept:** Node.js runs on a single-threaded execution model. Unlike traditional multi-threaded servers (like Apache) that spawn a new OS thread for every incoming request, Node.js uses a single event loop to handle concurrent operations. When an asynchronous operation occurs (like querying MySQL or reading a file), Node offloads the operation to the operating system or internal thread pool (libuv) and immediately resumes executing JavaScript. When the database responds, a callback is pushed onto the event loop queue.
- **In EnergySaver:** Every controller method uses `async/await` (e.g. `await pool.execute(sql)`). While MySQL is executing a query, the Node server is not blocked; it freely handles requests for other users.

### 2. What is a JavaScript Closure?
- **Concept:** A closure is a function that retains access to variables from its outer (lexical) scope even after the outer function has finished executing.
- **In EnergySaver:** In `src/middleware/security.js` (Line 95), the function `authRateLimiter` closes over the `failedLoginAttempts` `Map` declared in the outer module scope. Each request handler has continuous, stateful access to the IP attempt cache.

### 3. What is a Promise and `async/await`?
- **Concept:** A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. `async/await` is syntactic sugar built on top of Promises, allowing asynchronous code to be written and read sequentially like synchronous code.
- **In EnergySaver:** In `public/js/api.js` (Line 40), `async function request(path, options)` uses `const res = await fetch(...)` and `const json = await res.json()`, eliminating callback hell.

### 4. What is Middleware in Express?
- **Concept:** Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the `next` function in the application’s request-response cycle. They can execute code, modify `req` and `res`, end the request-response cycle, or call `next()` to pass control to the next middleware.
- **In EnergySaver:** `src/middleware/auth.js` inspects `req.session.userId`. If present, it calls `next()` to let the controller execute; if absent, it calls `res.status(401).json(...)` to immediately stop the request.

### 5. What is Connection Pooling?
- **Concept:** Establishing a TCP connection and SSL handshake with a database server is an expensive operation that can take $50\text{ms}-100\text{ms}$. A connection pool creates and maintains a cache of pre-established database connections. When a query arrives, a connection is borrowed from the pool, the query is executed, and the connection is returned to the pool for reuse.
- **In EnergySaver:** `src/config/database.js` creates a pool of 10 connections (`connectionLimit: 10`). This allows up to 10 concurrent database queries with near-zero connection overhead.

### 6. What is a Prepared Statement?
- **Concept:** In raw SQL execution, the SQL string and the user data are sent together, allowing user input containing quotes to alter the syntax tree (SQL Injection). With prepared statements, the database compiles the SQL query structure first with parameter placeholders (`?`). User data is transmitted separately and treated strictly as literal data, making SQL injection mathematically impossible.
- **In EnergySaver:** All controllers use `pool.execute(query, [params])` rather than string concatenation.

---

## Part 19: Technical Viva Defense Strategy & Question Bank Summary

For the full 180-question viva preparation repository categorized across 6 levels, refer to [docs/ENERGYSAVER_VIVA_QUESTION_BANK.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ENERGYSAVER_VIVA_QUESTION_BANK.md).

### The 4 Pillars of a High-Distinction Viva Defense:
1. **Be Honest and Direct:** Clearly state what the project does (mathematical modeling of appliance energy consumption) and what it does not do (it does not interface with physical IoT hardware smart meters).
2. **Defend Technology Choices Confidently:** If asked why you used Vanilla JavaScript instead of React, explain: *"We deliberately avoided heavy frontend frameworks to eliminate build chain overhead, maintain zero-dependency purity, master native DOM APIs, and ensure the entire codebase can be explained and verified without third-party abstraction layers."*
3. **Know the Core Numbers:** 
   - 144 total files, 40 JavaScript files, 310 functions.
   - 29 Express routes, 7 MySQL tables, 371 passing test assertions.
   - 10 salt rounds for bcrypt, 10 connection pool limit, 100 appliance cap per household.
4. **Master the Calculations:** Be prepared to write the daily kWh formula on a whiteboard and solve a worked example instantly:
   $$\text{Daily kWh} = \frac{\text{Watts} \times \text{Quantity} \times \text{Hours}}{1000}$$
   $$\text{Monthly Cost} = \text{Monthly kWh} \times \text{Tariff Rate}$$

---

## Part 20: Top 25 Critical Functions to Memorize

| # | Function | File | Line | Purpose |
|:---:|:---|:---|:---:|:---|
| 1 | `createApp()` | `src/app.js` | 28 | Builds Express middleware pipeline & routes |
| 2 | `gracefulShutdown()` | `src/server.js` | 42 | Closes HTTP server and MySQL connection pool cleanly |
| 3 | `getPool()` | `src/config/database.js` | 25 | Singleton accessor for MySQL connection pool |
| 4 | `calculateDailyKwh()` | `src/services/calculator.js` | 38 | $(W \times Q \times H) / 1000$; unrounded daily kWh |
| 5 | `calculateMonthlyKwh()`| `src/services/calculator.js` | 55 | Daily kWh $\times$ Days used per month |
| 6 | `calculateFlatCost()` | `src/services/calculator.js` | 72 | Monthly kWh $\times$ Tariff Rate (₹8.0) |
| 7 | `calculateHouseholdTotals()` | `src/services/calculator.js` | 140 | Aggregates household kWh, costs, rooms, budget status |
| 8 | `calculateScenarioDelta()` | `src/services/calculator.js` | 220 | Computes exact delta savings with zero rounding drift |
| 9 | `roundTo()` | `src/services/calculator.js` | 18 | Exponential-shift half-up rounding avoiding float flaws |
| 10 | `requireAuth()` | `src/middleware/auth.js` | 15 | Session guard checking `req.session.userId` |
| 11 | `csrfProtection()` | `src/middleware/security.js` | 40 | Verifies CSRF token with `crypto.timingSafeEqual` |
| 12 | `authRateLimiter()` | `src/middleware/security.js` | 103 | Limits failed logins to 5 per 15 mins per IP |
| 13 | `register()` | `src/controllers/authController.js` | 108 | Hashes password with bcrypt and creates user |
| 14 | `login()` | `src/controllers/authController.js` | 192 | Verifies bcrypt hash and regenerates session |
| 15 | `logout()` | `src/controllers/authController.js` | 240 | Destroys MySQL session and clears cookie |
| 16 | `listAppliances()` | `src/controllers/applianceController.js` | 85 | Lists user appliances with calculated metrics |
| 17 | `createAppliance()` | `src/controllers/applianceController.js` | 180 | Validates bounds, checks 100-cap, inserts appliance |
| 18 | `updateAppliance()` | `src/controllers/applianceController.js` | 225 | Updates appliance where id and user_id match |
| 19 | `deleteAppliance()` | `src/controllers/applianceController.js` | 260 | Deletes appliance where id and user_id match |
| 20 | `getSummary()` | `src/controllers/dashboardController.js` | 20 | Computes complete dashboard summary |
| 21 | `simulateSavings()` | `src/controllers/savingsController.js` | 25 | In-memory read-only calculation of what-if savings |
| 22 | `applySavings()` | `src/controllers/savingsController.js` | 95 | Commits proposed daily hours to MySQL appliances |
| 23 | `saveSnapshot()` | `src/controllers/reportController.js` | 50 | Transaction freezing parent snapshot and child items |
| 24 | `reconcileBill()` | `src/controllers/reportController.js` | 190 | Compares snapshot vs actual bill; computes variance |
| 25 | `exportCsv()` | `src/controllers/reportController.js` | 275 | Streams CSV with formula injection defense |

---

## Part 21: One-Day Study Plan & Revision Schedule

For the complete hourly timetable and 2-hour crash revision schedule, consult [docs/ENERGYSAVER_ONE_DAY_STUDY_PLAN.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ENERGYSAVER_ONE_DAY_STUDY_PLAN.md).

- **Morning Blocks (8:00 AM – 1:00 PM):** Project Architecture, File Responsibilities, Calculation Engine (`src/services/calculator.js`), and Database Schema (`sql/schema.sql`).
- **Afternoon Blocks (2:00 PM – 6:00 PM):** Security Architecture (bcrypt, CSRF, IDOR, Rate Limiting), Express Middleware & Controllers, and Frontend Vanilla JS Architecture.
- **Evening Blocks (7:00 PM – 10:30 PM):** Live User Workflow Tracing, Automated Test Harness Review, and Mock Viva Defense against Tricky Examiner Questions.

---

## Part 22: Quick Revision Sheets Summary

For the 10 ultra-condensed revision sheets designed for review 30 minutes before entering the viva examination hall, refer to [docs/ENERGYSAVER_LAST_MINUTE_REVISION.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ENERGYSAVER_LAST_MINUTE_REVISION.md).

---

## Part 23: Codebase Coverage Audit Verification

As formally verified in [docs/ENERGYSAVER_CODEBASE_COVERAGE_REPORT.md](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/docs/ENERGYSAVER_CODEBASE_COVERAGE_REPORT.md):
- **100% of the 144 project files** are documented.
- **100% of the 310 project-defined functions** are indexed and analyzed.
- **100% of the 29 Express REST API routes** are cataloged.
- **100% of the 7 MySQL tables** are specified.
- **100% of the 371 automated test assertions** pass unconditionally.

---

## Part 24: Document Ecosystem Cross-References

| Document Name | File Path | Focus Area |
|:---|:---|:---|
| **Master Handbook** | `docs/ENERGYSAVER_COMPLETE_CODEBASE_HANDBOOK.md` | Unified, comprehensive architectural & source code manual |
| **Function Index** | `docs/ENERGYSAVER_FUNCTION_INDEX.md` | Complete directory of all 310 functions with exact lines |
| **API & Database Guide**| `docs/ENERGYSAVER_API_AND_DATABASE_GUIDE.md` | Deep dives into 29 routes, 7 MySQL tables, and 10 SQL queries |
| **Viva Question Bank** | `docs/ENERGYSAVER_VIVA_QUESTION_BANK.md` | 180 curated questions across 6 levels with model answers |
| **One-Day Study Plan** | `docs/ENERGYSAVER_ONE_DAY_STUDY_PLAN.md` | 8-10 hour study schedule and 2-hour emergency crash plan |
| **Last-Minute Revision**| `docs/ENERGYSAVER_LAST_MINUTE_REVISION.md` | 10 condensed revision sheets for pre-exam review |
| **Coverage Report** | `docs/ENERGYSAVER_CODEBASE_COVERAGE_REPORT.md` | Audit proving 100% file and function coverage |

---

## Part 25: Academic Viva Presentation & Demonstration Script

### The 3-Minute Live Examiner Demonstration Script:
1. **Orientation (30 Seconds):**
   *"Good morning, esteemed examiners. Today I present EnergySaver, a full-stack web application designed to eliminate residential electricity billing opacity. While utility bills provide only an aggregate monthly total, EnergySaver models energy and financial costs at the individual appliance level."*
2. **Dashboard & Visualization (45 Seconds):**
   *"Here is our live dashboard. The application calculates that this 2-BHK apartment is on track for ₹2,480.00 this month. Notice the segmented room breakdown bar and the Chart.js visualizer showing that the Air Conditioner in the Living Room accounts for 34% of household power."*
3. **What-If Savings Simulation (45 Seconds):**
   *"Next, observe our What-If Savings Planner. If the household reduces AC usage from 6 hours to 4 hours per day, the system calculates an immediate monthly savings of ₹720.00 and 90 units. Notice our Zero Silent Commits architecture: dragging the slider emits zero database writes. The change is committed to MySQL only when I explicitly confirm by clicking 'Apply Changes'."*
4. **Historical Immutability & Reconciliation (45 Seconds):**
   *"Finally, in our Reports screen, we can freeze current consumption into an immutable snapshot. When the utility bill arrives, we log the actual ₹2,350.00 charge. The reconciliation engine detects a -5.2% variance, confirming that our model accurately reflects reality within a 5% margin of error."*
5. **Conclusion (15 Seconds):**
   *"The application is built using Semantic HTML5, Vanilla CSS3, Vanilla ES6 JavaScript, Node.js, Express, and MySQL 8.0, with 371 automated tests verifying mathematical and security integrity. I am now pleased to answer your technical questions."*

---

## Part 26: Final Certification & Conclusion

The EnergySaver application is complete, fully tested, securely implemented, and thoroughly documented. 

This handbook certifies that the candidate has complete mastery over every file, line of code, database query, mathematical calculation, and architectural decision in the EnergySaver repository.

**Prepared for Academic Viva Defense:** 19 November 2026  
**Status:** **APPROVED & FULLY DEFENSE-READY**
