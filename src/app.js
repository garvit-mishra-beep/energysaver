/**
 * EnergySaver - Express Application Factory
 * Serves frontend, validates sessions and CSRF tokens, provides health checks,
 * and mounts Authentication and User Settings routes.
 */

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const config = require('./config');
const { getPool, checkConnection } = require('./config/database');
const { apiNotFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const { csrfTokenProvider, csrfProtection, authRateLimiter } = require('./middleware/security');
const { requireAuth } = require('./middleware/auth');

const authController = require('./controllers/authController');
const settingsController = require('./controllers/settingsController');
const applianceController = require('./controllers/applianceController');
const dashboardController = require('./controllers/dashboardController');
const savingsController = require('./controllers/savingsController');
const reportController = require('./controllers/reportController');

function createApp() {
  const app = express();

  // Configure Trust Proxy if enabled in deployment configuration
  if (config.trustProxy) {
    app.set('trust proxy', 1);
  }

  // 1. Security Headers via Helmet with explicit CSP for Chart.js
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net'
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: config.isProduction ? [] : null
        }
      },
      crossOriginEmbedderPolicy: false
    })
  );

  // 2. Body Parsers with conservative request size limit (100kb)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 3. MySQL-Backed Persistent Session Store
  let sessionStore = null;
  try {
    sessionStore = new MySQLStore(
      {
        clearExpired: true,
        checkExpirationInterval: 900000, // 15 mins
        expiration: config.session.cookie.maxAge,
        createDatabaseTable: false, // Managed via sql/schema.sql
        schema: {
          tableName: 'sessions',
          columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
          }
        }
      },
      getPool()
    );

    sessionStore.on('error', (storeErr) => {
      console.warn('[SESSION STORE NOTICE] MySQL session store connection event:', storeErr.code || storeErr.message);
    });
  } catch (err) {
    console.warn('[SESSION] Initializing in-memory fallback for offline development mode:', err.message);
  }

  app.use(
    session({
      name: config.session.name,
      secret: config.session.secret,
      store: sessionStore || undefined,
      resave: false,
      saveUninitialized: false, // Do not persist empty unauthenticated sessions
      cookie: config.session.cookie
    })
  );

  // 4. Health Check Endpoints
  app.get('/health/live', (req, res) => {
    return res.status(200).json({
      status: 'UP',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  app.get('/health/ready', async (req, res) => {
    const dbStatus = await checkConnection();
    if (dbStatus.ok) {
      return res.status(200).json({
        status: 'READY',
        database: 'CONNECTED',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(503).json({
      status: 'UNAVAILABLE',
      database: 'DISCONNECTED',
      error: dbStatus.error,
      timestamp: new Date().toISOString()
    });
  });

  // 5. CSRF Token Provider Endpoint
  app.get('/api/csrf-token', csrfTokenProvider);

  // 6. Application Status Endpoint
  app.get('/api/status', (req, res) => {
    return res.status(200).json({
      success: true,
      data: {
        application: 'EnergySaver',
        phase: 'Phase 7 Verification & Academic Release (Foundations: Phase 2, 3, 4, 5 Complete; Fully Verified)',
        authenticated: Boolean(req.session && req.session.userId),
        user_id: req.session ? req.session.userId || null : null,
        timestamp: new Date().toISOString()
      }
    });
  });

  // 7. Authentication Routes
  // Public Auth Routes
  app.post('/api/auth/register', csrfProtection, authController.register);
  app.post('/api/auth/login', authRateLimiter(), csrfProtection, authController.login);
  app.post('/api/auth/logout', csrfProtection, authController.logout);

  // Protected Auth & Profile Routes
  app.get('/api/auth/me', requireAuth, authController.getCurrentUser);
  app.put('/api/auth/profile', requireAuth, csrfProtection, authController.updateProfile);
  app.put('/api/auth/password', requireAuth, csrfProtection, authController.changePassword);
  app.post('/api/auth/delete-account', requireAuth, csrfProtection, authController.deleteAccount);

  // 8. User Settings Routes (Protected)
  app.get('/api/settings', requireAuth, settingsController.getSettings);
  app.put('/api/settings', requireAuth, csrfProtection, settingsController.updateSettings);

  // 9. Appliance Inventory Routes (Protected)
  app.get('/api/appliances', requireAuth, applianceController.listAppliances);
  app.post('/api/appliances', requireAuth, csrfProtection, applianceController.createAppliance);
  app.put('/api/appliances/:id', requireAuth, csrfProtection, applianceController.updateAppliance);
  app.delete('/api/appliances/:id', requireAuth, csrfProtection, applianceController.deleteAppliance);
  app.post('/api/appliances/preview', requireAuth, csrfProtection, applianceController.previewAppliance);

  // 10. Dashboard Routes (Protected)
  app.get('/api/dashboard/summary', requireAuth, dashboardController.getSummary);

  // 11. Savings Planner Routes (Protected)
  app.post('/api/savings/simulate', requireAuth, csrfProtection, savingsController.simulateSavings);
  app.post('/api/savings/apply', requireAuth, csrfProtection, savingsController.applySavings);

  // 12. Historical Reports & Utility Bill Routes (Protected)
  app.post('/api/reports/snapshots', requireAuth, csrfProtection, reportController.saveSnapshot);
  app.get('/api/reports/snapshots', requireAuth, reportController.listSnapshots);
  app.get('/api/reports/snapshots/:id', requireAuth, reportController.getSnapshotDetails);
  app.post('/api/actual-bills', requireAuth, csrfProtection, reportController.logActualBill);
  app.get('/api/actual-bills', requireAuth, reportController.listActualBills);
  app.delete('/api/actual-bills/:id', requireAuth, csrfProtection, reportController.deleteActualBill);
  app.get('/api/reports/reconcile', requireAuth, reportController.reconcileBill);
  app.get('/api/reports/export-csv', requireAuth, reportController.exportCsv);

  // 10. Static Frontend Asset Serving
  const publicDir = path.resolve(__dirname, '../public');
  app.use(express.static(publicDir, {
    index: 'index.html',
    maxAge: config.isProduction ? '1d' : 0
  }));

  // 11. Route Handlers: 404 and Global Error Catch-All
  app.use(apiNotFoundHandler);
  app.use(globalErrorHandler);

  return app;
}

module.exports = { createApp };
