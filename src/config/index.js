/**
 * EnergySaver - Environment & Runtime Configuration
 * Validates required settings on startup and exports sanitized configuration.
 * Adheres strictly to Zero Secrets in Logs / Code policies.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Strict validation of session secret in production
const SESSION_SECRET = process.env.SESSION_SECRET || (isProduction ? '' : 'dev_fallback_secret_energy_saver_32chars_min');
if (isProduction && (!SESSION_SECRET || SESSION_SECRET.length < 32)) {
  console.error('[FATAL CONFIG ERROR] SESSION_SECRET must be set and at least 32 characters long in production mode.');
  process.exit(1);
}

// Helper to parse database connection URLs (e.g. MYSQL_PRIVATE_URL, MYSQL_URL, DATABASE_URL)
function parseDatabaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    const parsed = new URL(rawUrl);
    if (!['mysql:', 'mysql2:'].includes(parsed.protocol)) return null;
    return {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || ''),
      database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'energysaver_db'
    };
  } catch {
    return null;
  }
}

const rawDbUrl = process.env.MYSQL_PRIVATE_URL ||
                 process.env.DATABASE_PRIVATE_URL ||
                 process.env.MYSQL_URL ||
                 process.env.DATABASE_URL;
const urlConfig = parseDatabaseUrl(rawDbUrl);

function resolveHost() {
  const candidate = (process.env.DB_HOST || '').trim();
  const isUnresolvedRef = candidate.startsWith('${{') && candidate.endsWith('}}');
  const isLocal = candidate === 'localhost' || candidate === '127.0.0.1';

  // In production, override localhost or unresolved references with Railway private host / URL if available
  if (isProduction && (isLocal || isUnresolvedRef || !candidate)) {
    if (process.env.MYSQLHOST && !process.env.MYSQLHOST.startsWith('${{')) {
      if (isLocal) {
        console.warn(`[DATABASE CONFIG NOTICE] Overriding localhost DB_HOST ('${candidate}') with Railway private host '${process.env.MYSQLHOST}'.`);
      }
      return process.env.MYSQLHOST;
    }
    if (process.env.MYSQL_HOST && !process.env.MYSQL_HOST.startsWith('${{')) return process.env.MYSQL_HOST;
    if (urlConfig && urlConfig.host) {
      if (isLocal) {
        console.warn(`[DATABASE CONFIG NOTICE] Overriding localhost DB_HOST ('${candidate}') with database URL host '${urlConfig.host}'.`);
      }
      return urlConfig.host;
    }
  }

  if (candidate && !isUnresolvedRef) return candidate;
  if (process.env.MYSQLHOST && !process.env.MYSQLHOST.startsWith('${{')) return process.env.MYSQLHOST;
  if (process.env.MYSQL_HOST && !process.env.MYSQL_HOST.startsWith('${{')) return process.env.MYSQL_HOST;
  if (urlConfig && urlConfig.host) return urlConfig.host;

  return candidate || '127.0.0.1';
}

function resolvePort() {
  const p = (process.env.DB_PORT || '').trim();
  if (p && !p.startsWith('${{')) {
    const parsed = parseInt(p, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.MYSQLPORT && !process.env.MYSQLPORT.startsWith('${{')) {
    const parsed = parseInt(process.env.MYSQLPORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.MYSQL_PORT && !process.env.MYSQL_PORT.startsWith('${{')) {
    const parsed = parseInt(process.env.MYSQL_PORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (urlConfig && urlConfig.port) return urlConfig.port;
  return 3306;
}

function resolveUser() {
  const u = (process.env.DB_USER || '').trim();
  if (u && !u.startsWith('${{')) {
    if (isProduction && u === 'root' && process.env.MYSQLUSER && process.env.MYSQLUSER !== 'root') {
      return process.env.MYSQLUSER;
    }
    return u;
  }
  if (process.env.MYSQLUSER && !process.env.MYSQLUSER.startsWith('${{')) return process.env.MYSQLUSER;
  if (process.env.MYSQL_USER && !process.env.MYSQL_USER.startsWith('${{')) return process.env.MYSQL_USER;
  if (urlConfig && urlConfig.user) return urlConfig.user;
  return 'root';
}

function resolvePassword() {
  const pass = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
  const isUnresolvedRef = typeof pass === 'string' && pass.startsWith('${{') && pass.endsWith('}}');
  if (pass && !isUnresolvedRef) {
    if (isProduction && pass === 'your_secure_db_password_here') {
      if (process.env.MYSQLPASSWORD && !process.env.MYSQLPASSWORD.startsWith('${{')) {
        console.warn('[DATABASE CONFIG NOTICE] Overriding placeholder DB_PASSWORD with Railway MYSQLPASSWORD.');
        return process.env.MYSQLPASSWORD;
      }
      if (urlConfig && urlConfig.password) return urlConfig.password;
    }
    return pass;
  }
  if (process.env.MYSQLPASSWORD && !process.env.MYSQLPASSWORD.startsWith('${{')) return process.env.MYSQLPASSWORD;
  if (process.env.MYSQL_PASSWORD && !process.env.MYSQL_PASSWORD.startsWith('${{')) return process.env.MYSQL_PASSWORD;
  if (urlConfig && urlConfig.password) return urlConfig.password;
  return '';
}

function resolveDatabase() {
  const d = (process.env.DB_NAME || '').trim();
  if (d && !d.startsWith('${{')) {
    if (isProduction && d === 'energysaver_db' && process.env.MYSQLDATABASE && process.env.MYSQLDATABASE !== 'energysaver_db') {
      return process.env.MYSQLDATABASE;
    }
    return d;
  }
  if (process.env.MYSQLDATABASE && !process.env.MYSQLDATABASE.startsWith('${{')) return process.env.MYSQLDATABASE;
  if (process.env.MYSQL_DATABASE && !process.env.MYSQL_DATABASE.startsWith('${{')) return process.env.MYSQL_DATABASE;
  if (urlConfig && urlConfig.database) return urlConfig.database;
  return 'energysaver_db';
}

const resolvedHost = resolveHost();
const resolvedPort = resolvePort();
const resolvedUser = resolveUser();
const resolvedPassword = resolvePassword();
const resolvedDatabase = resolveDatabase();

if (isProduction) {
  if (resolvedHost === '127.0.0.1' || resolvedHost === 'localhost') {
    console.warn('[DATABASE CONFIG WARNING] In production mode, database host is set to localhost/127.0.0.1. Railway containers do not run MySQL locally. Ensure the MySQL service is linked or MYSQLHOST is configured.');
  }
  if (resolvedHost.startsWith('${{')) {
    console.warn(`[DATABASE CONFIG WARNING] Database host contains an unresolved Railway reference '${resolvedHost}'. Verify that your MySQL service name matches the reference in Railway dashboard.`);
  }
}

const config = {
  env: NODE_ENV,
  isProduction,
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT, 10) || 3000,
  trustProxy: process.env.TRUST_PROXY === 'true' || isProduction,

  // Database Connection Details (Supports local, Railway private network, and cloud URLs)
  db: {
    host: resolvedHost,
    port: resolvedPort,
    user: resolvedUser,
    password: resolvedPassword,
    database: resolvedDatabase,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    waitForConnections: true,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
      : undefined
  },

  // Session Settings
  session: {
    name: process.env.SESSION_NAME || 'energysaver_sid',
    secret: SESSION_SECRET,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true' || isProduction,
      maxAge: parseInt(process.env.SESSION_MAX_AGE_MS, 10) || 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  },

  // Authentication Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    maxAttempts: parseInt(process.env.RATE_LIMIT_MAX, 10) || 5
  }
};

module.exports = config;
