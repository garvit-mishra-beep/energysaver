/**
 * EnergySaver - Global Error Handling Middleware
 * Ensures consistent JSON error responses and prevents secret/stack leakage to clients.
 */

const config = require('../config');

/**
 * 404 Handler for undefined API routes
 */
function apiNotFoundHandler(req, res, next) {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.path} not found`
      }
    });
  }
  // For non-API routes (HTML requests), let express.static or static router handle or return 404
  return res.status(404).send('Page not found');
}

/**
 * Global application error handler
 */
function globalErrorHandler(err, req, res, next) {
  // If response headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const isServerFault = statusCode >= 500;

  // Log error internally (without secrets)
  if (isServerFault) {
    console.error(`[SERVER ERROR] ${req.method} ${req.path}:`, err.message || err);
    if (!config.isProduction && err.stack) {
      console.error(err.stack);
    }
  }

  // Consistent API error response
  if (req.path.startsWith('/api') || req.xhr || req.headers.accept?.includes('application/json')) {
    const responsePayload = {
      success: false,
      error: {
        code: err.code || (isServerFault ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST'),
        message: isServerFault && config.isProduction
          ? 'An internal server error occurred. Please try again later.'
          : (err.message || 'An unexpected error occurred')
      }
    };

    if (err.field) {
      responsePayload.error.field = err.field;
    }

    return res.status(statusCode).json(responsePayload);
  }

  // Fallback generic HTML response for non-API page requests
  return res.status(statusCode).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Error ${statusCode} – EnergySaver</title>
      <style>
        body { font-family: -apple-system, sans-serif; background: #FBFBF9; color: #2D312E; padding: 3rem; text-align: center; }
        .card { max-width: 480px; margin: 0 auto; background: #fff; padding: 2rem; border: 1px solid #E2E2D8; border-radius: 6px; }
        a { color: #2E6F40; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Something went wrong (${statusCode})</h2>
        <p>${config.isProduction ? 'An unexpected error occurred.' : (err.message || 'Internal error')}</p>
        <p><a href="/index.html">&larr; Return to My Home</a></p>
      </div>
    </body>
    </html>
  `);
}

module.exports = {
  apiNotFoundHandler,
  globalErrorHandler
};
