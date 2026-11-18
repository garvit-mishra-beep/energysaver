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

const config = {
  env: NODE_ENV,
  isProduction,
  port: parseInt(process.env.PORT, 10) || 3000,
  trustProxy: process.env.TRUST_PROXY === 'true' || isProduction,

  // Database Connection Details
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'energysaver_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    waitForConnections: true,
    queueLimit: 0
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
