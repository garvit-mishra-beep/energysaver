/**
 * EnergySaver - MySQL Database Connection Pool
 * Uses mysql2/promise for connection pooling and parameterised SQL execution.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./index');

let pool = null;

/**
 * Returns the active mysql2/promise pool instance.
 * Lazily initializes the connection pool on first invocation.
 */
function getPool() {
  if (!pool) {
    const poolConfig = {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: config.db.waitForConnections,
      connectionLimit: config.db.connectionLimit,
      queueLimit: config.db.queueLimit,
      charset: 'utf8mb4_unicode_ci',
      connectTimeout: 15000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    };
    if (config.db.ssl) {
      poolConfig.ssl = config.db.ssl;
    }
    pool = mysql.createPool(poolConfig);

    pool.on('error', (err) => {
      console.warn('[DATABASE POOL EVENT]', err.code || err.message);
    });
  }
  return pool;
}

/**
 * Explicit database connectivity readiness check.
 * Executes a simple ping query (SELECT 1).
 * Returns { ok: true } on success, or { ok: false, error: string } on failure.
 */
async function checkConnection() {
  try {
    const activePool = getPool();
    const connection = await activePool.getConnection();
    try {
      await connection.query('SELECT 1 AS readiness_check');
      return { ok: true };
    } finally {
      connection.release();
    }
  } catch (err) {
    return {
      ok: false,
      error: config.isProduction
        ? (err.code || 'Database connection error')
        : (err.code || err.message || 'Database connection error')
    };
  }
}

/**
 * Checks whether core tables exist in the database, and automatically applies
 * sql/schema.sql (using non-destructive CREATE TABLE IF NOT EXISTS) if uninitialized.
 */
async function ensureSchema() {
  try {
    const activePool = getPool();
    const [rows] = await activePool.query("SHOW TABLES LIKE 'users'");
    if (rows.length === 0) {
      console.log('[ENERGY SAVER] Fresh database detected. Applying schema tables...');
      const schemaPath = path.resolve(__dirname, '../../sql/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

      const dbOpts = {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        multipleStatements: true
      };
      if (config.db.ssl) dbOpts.ssl = config.db.ssl;
      const initConn = await mysql.createConnection(dbOpts);
      await initConn.query(schemaSql);
      await initConn.end();
      console.log('[ENERGY SAVER] Database schema initialized successfully.');
    }
  } catch (err) {
    console.warn('[ENERGY SAVER] Notice during automatic schema check:', err.message);
  }
}

/**
 * Closes the database pool cleanly during graceful server shutdown.
 */
async function closePool() {
  if (pool) {
    try {
      await pool.end();
    } catch (err) {
      console.error('[DATABASE] Error closing MySQL pool:', err.message);
    } finally {
      pool = null;
    }
  }
}

module.exports = {
  getPool,
  checkConnection,
  ensureSchema,
  closePool
};
