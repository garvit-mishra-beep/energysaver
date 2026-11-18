/**
 * EnergySaver - MySQL Database Connection Pool
 * Uses mysql2/promise for connection pooling and parameterised SQL execution.
 */

const mysql = require('mysql2/promise');
const config = require('./index');

let pool = null;

/**
 * Returns the active mysql2/promise pool instance.
 * Lazily initializes the connection pool on first invocation.
 */
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: config.db.waitForConnections,
      connectionLimit: config.db.connectionLimit,
      queueLimit: config.db.queueLimit,
      charset: 'utf8mb4_unicode_ci'
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
      error: err.code || err.message || 'Database connection error'
    };
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
  closePool
};
