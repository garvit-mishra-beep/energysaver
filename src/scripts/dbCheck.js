/**
 * EnergySaver - Database Connection & Health Verification Script
 * Executed via 'npm run db:check'
 */

const { checkConnection } = require('../config/database');
const config = require('../config');

async function runCheck() {
  console.log('--- EnergySaver Database Verification ---');
  console.log(`Target Host: ${config.db.host}:${config.db.port}`);
  console.log(`Database Name: ${config.db.database}`);
  console.log(`Database User: ${config.db.user}`);

  const result = await checkConnection();
  if (result.ok) {
    console.log('[SUCCESS] Database connectivity verified. Ping successful.');
    process.exit(0);
  } else {
    console.error(`[FAILURE] Database unreachable: ${result.error}`);
    console.error('Check your MySQL server status and verify credentials in .env.');
    process.exit(1);
  }
}

runCheck();
