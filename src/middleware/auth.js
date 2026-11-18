/**
 * EnergySaver - Authentication Guard Middleware
 * Protects private endpoints by validating active session state.
 */

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please sign in to access this resource.'
      }
    });
  }

  next();
}

module.exports = {
  requireAuth
};
