/**
 * EnergySaver - HTTP Server Entry Point
 * Starts HTTP listener, logs server startup, and manages graceful shutdown.
 */

const { createApp } = require('./app');
const config = require('./config');
const { checkConnection, closePool } = require('./config/database');

const app = createApp();

const server = app.listen(config.port, config.host, async () => {
  console.log(`[ENERGY SAVER] Server running at http://${config.host}:${config.port}`);
  console.log(`[ENERGY SAVER] Environment: ${config.env}`);
  console.log(`[ENERGY SAVER] Serving static frontend from: public/`);

  // Non-blocking database connectivity check on startup
  const dbStatus = await checkConnection();
  if (dbStatus.ok) {
    console.log(`[ENERGY SAVER] MySQL database connection verified (Host: ${config.db.host}:${config.db.port}, Database: ${config.db.database})`);
  } else {
    console.warn(`[ENERGY SAVER NOTICE] MySQL database is currently unreachable (${dbStatus.error}).`);
    console.warn(`[ENERGY SAVER NOTICE] Frontend remains 100% testable in Phase 1 Demo mode at http://localhost:${config.port}/index.html.`);
    console.warn(`[ENERGY SAVER NOTICE] Run 'npm run db:check' to test MySQL once your credentials are set in .env.`);
  }
});

// Graceful Shutdown Handler
let isShuttingDown = false;
async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n[ENERGY SAVER] Received ${signal}. Closing HTTP server and database pool...`);

  server.close(async () => {
    console.log('[ENERGY SAVER] HTTP server closed.');
    await closePool();
    console.log('[ENERGY SAVER] Database connection pool closed.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds if lingering connections exist
  setTimeout(() => {
    console.error('[ENERGY SAVER] Forcefully terminating after shutdown timeout.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = { server, app };
