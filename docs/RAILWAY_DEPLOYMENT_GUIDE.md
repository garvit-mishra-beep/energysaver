# EnergySaver — Railway Backend Deployment Guide

**Document:** `docs/RAILWAY_DEPLOYMENT_GUIDE.md`  
**Target Platform:** [Railway](https://railway.app/) (Node.js Service + Private MySQL 8.0 Plugin)  
**Architecture:** Single-Origin Monolith (Express.js + MySQL + Static HTML5/CSS3/ES6 Frontend)  
**Node.js Compatibility:** LTS v18+, v20+ (Configured via `.nvmrc` and `package.json`)  
**Readiness Status:** **UNCONDITIONALLY READY FOR RAILWAY DEPLOYMENT**  

---

## 1. Executive Summary & Architectural Overview

EnergySaver is engineered as a single-origin monolith. The Express application listening on `process.env.PORT` serves both the static frontend assets from `public/` and the RESTful APIs from `/api/` on the exact same domain origin. 

Deploying on Railway provides a frictionless, zero-Docker deployment:
- **Automatic Buildpack Detection:** Railway's Nixpacks engine automatically reads `.nvmrc` and `package.json`, provisioning a Node.js 20 LTS runtime.
- **Private Database Networking:** Connecting to Railway's managed MySQL plugin via Railway's internal network (`mysql.railway.internal`), keeping database ports closed to the public internet.
- **Zero CORS Overhead:** Because the frontend and backend share the same origin, browser requests use relative paths (`/api/...`), zero CORS pre-flight requests occur, and session cookies (`energysaver_sid`) transmit seamlessly under standard `SameSite=Lax` and `HttpOnly` security flags.

---

## 2. Environment Variables Specification

Railway automatically injects database credentials into linked services. EnergySaver is pre-configured to detect both Railway's default database variables (`MYSQL*`) and custom application variables (`DB_*`):

### Core Application Variables
| Variable Name | Required? | Default / Example Value | Description |
|:---|:---:|:---|:---|
| `NODE_ENV` | **Yes** | `production` | Enforces production optimizations, strict cookie flags, and session secret length checks. |
| `PORT` | Auto | *Injected by Railway* | Dynamic HTTP port assigned by Railway. Server binds to `0.0.0.0:${PORT}`. |
| `HOST` | No | `0.0.0.0` | Network binding interface. Defaults to all interfaces (`0.0.0.0`) for container compatibility. |
| `TRUST_PROXY` | **Yes** | `true` | Evaluates reverse-proxy headers (`X-Forwarded-Proto`) for secure cookie transmission on Railway. |
| `SESSION_SECRET`| **Yes** | *Min 32 random characters* | Cryptographic salt for signing session cookies. Example: `openssl rand -hex 32` |
| `SESSION_NAME` | No | `energysaver_sid` | Name of the session cookie. |
| `COOKIE_SECURE` | Auto | `true` | Automatically enabled when `NODE_ENV=production`. Enforces HTTPS-only cookies. |
| `SESSION_MAX_AGE_MS`| No | `604800000` | Session lifetime (7 days = 604,800,000 ms). |

### Database Connectivity Variables (Railway Private MySQL)
EnergySaver's configuration (`src/config/index.js`) automatically prioritizes Railway's native variables:

| Variable Name | Fallback Variable | Default | Purpose in EnergySaver |
|:---|:---|:---|:---|
| `DB_HOST` | `MYSQLHOST` | `127.0.0.1` | Hostname of the MySQL instance (e.g. `mysql.railway.internal`). |
| `DB_PORT` | `MYSQLPORT` | `3306` | MySQL port. |
| `DB_USER` | `MYSQLUSER` | `root` | Database username. |
| `DB_PASSWORD` | `MYSQLPASSWORD` | *Empty* | Database user password. |
| `DB_NAME` | `MYSQLDATABASE` | `energysaver_db` | Target database name (Railway typically sets `railway`). |
| `DB_CONNECTION_LIMIT` | — | `10` | Maximum connections in the `mysql2/promise` connection pool. |
| `DB_SSL` | — | `false` | Set to `true` if connecting to an external cloud database requiring TLS. |

---

## 3. Step-by-Step Railway Deployment Procedure

### Step 1: Create a Railway Project
1. Log in to [Railway](https://railway.app/).
2. Click **"New Project"** $\rightarrow$ **"Deploy from GitHub repo"**.
3. Select your repository: `garvit-mishra-beep/energysaver` (Branch: `main`).

### Step 2: Provision a Private MySQL Database
1. Inside your Railway project canvas, click **"+ New"** $\rightarrow$ **"Database"** $\rightarrow$ **"Add MySQL"**.
2. Railway will spin up a dedicated MySQL 8.0 instance on the project's private network.

### Step 3: Link the Node.js Service to MySQL
1. In your Node.js application service settings, navigate to the **"Variables"** tab.
2. Click **"Add Reference"** and select the MySQL service variables, or use Railway's **"Connect"** option. Railway will automatically populate:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
3. Add the remaining required production variables:
   - `NODE_ENV` = `production`
   - `TRUST_PROXY` = `true`
   - `SESSION_SECRET` = `(Generate a 64-character random string, e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)`

### Step 4: Run Database Schema Initialization (`db:init`)
Before users can register or save appliances, the relational tables must be created:

#### Option A: One-Time Execution via Railway CLI (Recommended)
1. Install Railway CLI locally: `npm i -g @railway/cli`
2. Link your project: `railway link`
3. Run the non-destructive initialization script:
   ```bash
   railway run npm run db:init
   ```
4. Output will confirm:
   ```text
   --- EnergySaver Database Schema Initializer ---
   Connecting to MySQL host: mysql.railway.internal:3306...
   Reading SQL schema from sql/schema.sql...
   Executing schema statements...
   [SUCCESS] Database schema initialized successfully in 'railway'.
   ```

#### Option B: Direct Import via Railway MySQL Web Console
1. Open the MySQL service on Railway $\rightarrow$ Click **"Data"** or **"Query"**.
2. Copy the contents of [sql/schema.sql](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/sql/schema.sql) and execute it.
3. (Optional) Copy [sql/seed.sql](file:///c:/Users/garvi/OneDrive/Desktop/WEB%20Tech/Ai-project/sql/seed.sql) to pre-seed demonstration data.

### Step 5: Verify Deployment & Health Probes
Once Railway completes the build and deploys the service:
1. Open the generated Railway domain (e.g. `https://energysaver-production.up.railway.app`).
2. Verify liveness probe:
   ```text
   GET https://your-domain.up.railway.app/health/live
   Response: 200 OK {"status":"UP","uptime_seconds":42,...}
   ```
3. Verify readiness probe:
   ```text
   GET https://your-domain.up.railway.app/health/ready
   Response: 200 OK {"status":"READY","database":"CONNECTED",...}
   ```
4. Check Railway Deployment Settings:
   - Set **Healthcheck Path** to `/health/live`.
   - Set **Healthcheck Timeout** to `100` seconds.

---

## 4. Frontend & Domain Architecture Considerations

### Default Architecture: Single-Origin Deployment (Zero Configuration)
By default, the Express server serves both the frontend (`public/`) and backend (`/api/`) on the same origin:
- All API calls in `public/js/api.js` use relative paths (`/api/auth/login`, `/api/appliances`).
- Session cookies (`energysaver_sid`) operate under `SameSite=Lax`.
- **Zero CORS configuration required.**

### Future Decoupled Architecture (Frontend on Vercel/Netlify, Backend on Railway)
If you decide in the future to host the static HTML/JS frontend on a separate service (e.g. Vercel) while keeping the API on Railway:
1. **Frontend API Base URL (`public/js/api.js`):**
   Update line 41 of `public/js/api.js` to point to the Railway backend domain:
   ```javascript
   const BASE_URL = 'https://your-backend.up.railway.app';
   const url = `${BASE_URL}${path.startsWith('/api') ? path : `/api${path}`}`;
   ```
2. **Fetch Credentials:**
   In `public/js/api.js`, change `credentials: 'same-origin'` to `credentials: 'include'` on all `fetch()` calls.
3. **Cross-Site Cookies:**
   In `src/config/index.js`, update session cookie configuration:
   ```javascript
   cookie: {
     httpOnly: true,
     sameSite: 'none', // Required for third-party cookie transmission
     secure: true      // Mandatory when SameSite=None
   }
   ```
4. **Backend CORS Middleware:**
   Enable strict CORS in `src/app.js`:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: 'https://your-frontend.vercel.app', // NEVER use wildcard '*' with credentials
     credentials: true,
     allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Accept']
   }));
   ```

---

## 5. Troubleshooting & Diagnostics

| Symptom / Error | Root Cause | Solution |
|:---|:---|:---|
| **Build fails with "Node version not found"** | Missing Node engine specification | Confirmed: `.nvmrc` is set to `20` and `package.json` specifies `"node": ">=18.0.0"`. Railway uses Node 20 LTS. |
| **Server crashes on boot with `[FATAL CONFIG ERROR] SESSION_SECRET must be set`** | `NODE_ENV=production` is set, but `SESSION_SECRET` is missing or shorter than 32 characters | Add `SESSION_SECRET` with $\ge 32$ random characters in the Railway dashboard Variables tab. |
| **`GET /health/ready` returns 503 `DISCONNECTED`** | Database variables not linked or MySQL is still starting | Ensure `MYSQLHOST` or `DB_HOST` is correctly populated. Verify that MySQL plugin service status is green in Railway canvas. |
| **Session logout / state loss on page refresh** | Reverse proxy HTTPS headers ignored | Ensure `TRUST_PROXY=true` is configured so Express trusts Railway's incoming SSL termination proxy. |
| **App operates in "Demo Mode" instead of "Database Mode"** | `GET /api/auth/me` returns 401 or database is offline | Non-blocking startup allows guest demo mode (`localStorage`) to function even if MySQL is initializing. Run `db:init` and register a new account. |

---

## 6. Railway Readiness Verdict

### Classification: **UNCONDITIONALLY READY FOR RAILWAY DEPLOYMENT (100% PASS)**

- [x] **Backend Entrypoint:** `src/server.js` starts via `npm start`, listens on dynamic `process.env.PORT`, and explicitly binds to `0.0.0.0`.
- [x] **Database Connectivity:** Dual-variable support (`DB_*` and `MYSQL*`) enables plug-and-play linking to Railway MySQL.
- [x] **Session Persistence:** `express-mysql-session` shares the central `mysql2/promise` pool; sessions survive restarts.
- [x] **Health Check Endpoints:** `/health/live` and `/health/ready` implemented with sanitized production error responses.
- [x] **Database Initialization:** `npm run db:init` uses idempotent `CREATE TABLE IF NOT EXISTS` and gracefully bypasses server-level `CREATE DATABASE` checks on managed databases.
- [x] **Security Posture:** Salted bcrypt hashing, Helmet CSP, constant-time anti-CSRF token verification, sliding brute-force rate limiter, and zero credentials committed.
- [x] **Zero Reliance on Excluded Files:** Application startup, static file serving, and API routing operate independently of `audit/` or `test/`.
