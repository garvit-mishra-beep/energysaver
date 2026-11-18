/**
 * EnergySaver - CSRF & Rate Limiting Middleware
 * 1. Double Submit Cookie / Session-Linked CSRF Protection
 * 2. In-Memory Login Rate Limiter (Max 5 attempts / 15 minutes per IP)
 */

const crypto = require('crypto');
const config = require('../config');

/**
 * Ensures a CSRF secret token is stored in the user's session and provides it to the client.
 * Provides endpoint GET /api/csrf-token.
 */
function csrfTokenProvider(req, res) {
  if (!req.session) {
    return res.status(500).json({
      success: false,
      error: { code: 'SESSION_UNAVAILABLE', message: 'Session store unavailable' }
    });
  }

  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  return res.json({
    success: true,
    data: {
      csrfToken: req.session.csrfToken
    }
  });
}

/**
 * Validates CSRF token on state-changing requests (POST, PUT, DELETE, PATCH).
 * The token may be submitted via:
 * - Header: 'x-csrf-token' or 'csrf-token'
 * - Request Body: '_csrf'
 */
function csrfProtection(req, res, next) {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Ensure session exists
  if (!req.session || !req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_MISSING',
        message: 'CSRF token missing from session. Please fetch /api/csrf-token first.'
      }
    });
  }

  const clientToken = req.headers['x-csrf-token'] || req.headers['csrf-token'] || (req.body && req.body._csrf);

  if (!clientToken || clientToken !== req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_INVALID',
        message: 'Invalid or missing CSRF token'
      }
    });
  }

  next();
}

/**
 * In-Memory Rate Limiter for Authentication Endpoints (e.g., Login)
 * Defaults to config.rateLimit (e.g., max 5 failed attempts per 15 minutes window per IP).
 * Only failed attempts (HTTP 401) increment the counter. Successful logins (HTTP 200) reset the counter.
 */
const rateLimitMap = new Map();

// Periodic cleanup timer to prevent memory accumulation from abandoned IPs (unref'd to prevent keeping event loop open)
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
const sweepTimer = setInterval(() => {
  const now = Date.now();
  const defaultWindow = (config.rateLimit && config.rateLimit.windowMs) || 15 * 60 * 1000;
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.startTime > defaultWindow) {
      rateLimitMap.delete(ip);
    }
  }
}, SWEEP_INTERVAL_MS);

if (sweepTimer.unref) {
  sweepTimer.unref();
}

function resetRateLimits(ip) {
  if (ip) {
    rateLimitMap.delete(ip);
  } else {
    rateLimitMap.clear();
  }
}

function authRateLimiter(options = {}) {
  const windowMs = options.windowMs || (config.rateLimit && config.rateLimit.windowMs) || 15 * 60 * 1000;
  const maxAttempts = options.maxAttempts || (config.rateLimit && config.rateLimit.maxAttempts) || 5;

  return function (req, res, next) {
    const ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown-ip';
    const now = Date.now();

    const record = rateLimitMap.get(ip);
    if (record) {
      if (now - record.startTime > windowMs) {
        rateLimitMap.delete(ip);
      } else if (record.count >= maxAttempts) {
        const retryAfterSec = Math.ceil((record.startTime + windowMs - now) / 1000);
        res.setHeader('Retry-After', retryAfterSec);
        return res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many authentication attempts. Please try again in ${retryAfterSec} seconds.`
          }
        });
      }
    }

    // Intercept response finish to track outcomes
    res.on('finish', () => {
      // 401 Unauthorized indicates invalid credentials / failed attempt
      if (res.statusCode === 401) {
        const current = rateLimitMap.get(ip);
        const currentTime = Date.now();
        if (!current || currentTime - current.startTime > windowMs) {
          rateLimitMap.set(ip, { count: 1, startTime: currentTime });
        } else {
          current.count += 1;
        }
      } else if (res.statusCode === 200) {
        // Successful login resets failure counter for this IP
        rateLimitMap.delete(ip);
      }
    });

    next();
  };
}

module.exports = {
  csrfTokenProvider,
  csrfProtection,
  authRateLimiter,
  resetRateLimits,
  _rateLimitMap: rateLimitMap
};
