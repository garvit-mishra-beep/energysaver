/**
 * EnergySaver - Database Schema Initializer Script
 * Executed via 'npm run db:init'
 * Safely creates database and tables using 'CREATE TABLE IF NOT EXISTS'
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config');

async function runInit() {
  console.log('--- EnergySaver Database Schema Initializer ---');
  console.log(`Connecting to MySQL host: ${config.db.host}:${config.db.port}...`);

  let rootConnection = null;
  try {
    // 1. Connect without database to ensure database exists
    rootConnection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password
    });

    console.log(`Ensuring database '${config.db.database}' exists...`);
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();

    // 2. Connect directly to target database
    const dbConnection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      multipleStatements: true
    });

    console.log(`Reading SQL schema from sql/schema.sql...`);
    const schemaSql = fs.readFileSync(path.resolve(__dirname, '../../sql/schema.sql'), 'utf-8');

    console.log(`Executing schema statements...`);
    await dbConnection.query(schemaSql);
    await dbConnection.end();

    console.log(`[SUCCESS] Database schema initialized successfully in '${config.db.database}'.`);
    process.exit(0);
  } catch (err) {
    console.error(`[ERROR] Failed to initialize database schema:`, err.message);
    if (rootConnection) await rootConnection.end().catch(() => {});
    process.exit(1);
  }
}

runInit();
