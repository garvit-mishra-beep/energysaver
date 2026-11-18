/**
 * EnergySaver - Authentication Controller
 * Manages user registration, login with session regeneration, logout, session lookup,
 * password change with session invalidation, and cascading account deletion.
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { getPool } = require('../config/database');

// Standard bcrypt salt rounds
const BCRYPT_ROUNDS = 10;
// Maximum byte length supported by bcrypt without truncation issues
const MAX_PASSWORD_BYTES = 72;

/**
 * Normalizes email address (trims and converts to lowercase).
 */
function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Validates password length and UTF-8 byte boundary.
 */
function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  const byteLength = Buffer.byteLength(password, 'utf8');
  if (byteLength > MAX_PASSWORD_BYTES) {
    return { valid: false, message: 'Password exceeds maximum allowed length (72 bytes)' };
  }
  return { valid: true };
}

/**
 * Regenerates the express session as a Promise.
 */
function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Saves the express session as a Promise.
 */
function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Destroys the express session as a Promise.
 */
function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * POST /api/auth/register
 * Atomically creates a new user account and default user settings in MySQL.
 */
async function register(req, res, next) {
  try {
    const { email, password, display_name } = req.body;

    const cleanEmail = normalizeEmail(email);
    const cleanName = typeof display_name === 'string' ? display_name.trim() : '';

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'A valid email address is required', field: 'email' }
      });
    }

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_NAME', message: 'Display name is required (max 100 characters)', field: 'display_name' }
      });
    }

    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PASSWORD', message: passCheck.message, field: 'password' }
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Check for duplicate email
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      );

      if (existing.length > 0) {
        await connection.rollback();
        return res.status(409).json({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'Email is already registered', field: 'email' }
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

      // Insert User
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
        [cleanEmail, passwordHash, cleanName]
      );
      const userId = userResult.insertId;

      // Insert Default User Settings atomically
      await connection.execute(
        'INSERT INTO user_settings (user_id, electricity_rate, monthly_budget, currency_symbol, tariff_type) VALUES (?, ?, ?, ?, ?)',
        [userId, 8.0000, 3500.00, '₹', 'flat']
      );

      await connection.commit();

      // Establish authenticated session with session regeneration
      const existingCsrf = req.session.csrfToken || crypto.randomBytes(32).toString('hex');
      await regenerateSession(req);
      req.session.userId = userId;
      req.session.email = cleanEmail;
      req.session.displayName = cleanName;
      req.session.csrfToken = existingCsrf;
      await saveSession(req);

      return res.status(201).json({
        success: true,
        data: {
          id: userId,
          email: cleanEmail,
          display_name: cleanName
        },
        message: 'Account created successfully'
      });
    } catch (err) {
      await connection.rollback();
      // Handle MySQL unique key violation (ER_DUP_ENTRY) under race conditions
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'Email is already registered', field: 'email' }
        });
      }
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Validates credentials, regenerates session ID, and establishes authenticated session.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || typeof password !== 'string') {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, display_name FROM users WHERE email = ? LIMIT 1',
      [cleanEmail]
    );

    if (rows.length === 0) {
      // Use generic error message to prevent account enumeration
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    // Regenerate session to protect against session fixation attacks
    const existingCsrf = req.session.csrfToken || crypto.randomBytes(32).toString('hex');
    await regenerateSession(req);
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.displayName = user.display_name;
    req.session.csrfToken = existingCsrf;
    await saveSession(req);

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        display_name: user.display_name
      },
      message: 'Login successful'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Destroys session and instructs browser to clear the session cookie.
 */
async function logout(req, res, next) {
  try {
    const config = require('../config');
    const cookieName = config.session.name;

    if (req.session) {
      await destroySession(req);
    }
    res.clearCookie(cookieName, { path: '/' });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns current authenticated user profile.
 */
async function getCurrentUser(req, res, next) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, email, display_name, created_at FROM users WHERE id = ? LIMIT 1',
      [req.session.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Session user does not exist' }
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/auth/profile
 * Updates display name for authenticated user.
 */
async function updateProfile(req, res, next) {
  try {
    const { display_name } = req.body;
    const cleanName = typeof display_name === 'string' ? display_name.trim() : '';

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_NAME', message: 'Display name is required (max 100 characters)', field: 'display_name' }
      });
    }

    const pool = getPool();
    await pool.execute(
      'UPDATE users SET display_name = ? WHERE id = ?',
      [cleanName, req.session.userId]
    );

    req.session.displayName = cleanName;
    await saveSession(req);

    return res.status(200).json({
      success: true,
      data: {
        id: req.session.userId,
        email: req.session.email,
        display_name: cleanName
      },
      message: 'Profile updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/auth/password
 * Changes password; requires current password verification and regenerates session.
 */
async function changePassword(req, res, next) {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || typeof current_password !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INCORRECT_PASSWORD', message: 'Current password is required', field: 'current_password' }
      });
    }

    const passCheck = validatePassword(new_password);
    if (!passCheck.valid) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PASSWORD', message: passCheck.message, field: 'new_password' }
      });
    }

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
      [req.session.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not found' }
      });
    }

    const match = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!match) {
      return res.status(400).json({
        success: false,
        error: { code: 'INCORRECT_PASSWORD', message: 'Current password does not match', field: 'current_password' }
      });
    }

    const newHash = await bcrypt.hash(new_password, BCRYPT_ROUNDS);
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newHash, req.session.userId]
    );

    // Invalidate old session and regenerate with fresh session ID
    const userId = req.session.userId;
    const email = req.session.email;
    const displayName = req.session.displayName;
    const existingCsrf = req.session.csrfToken || crypto.randomBytes(32).toString('hex');

    await regenerateSession(req);
    req.session.userId = userId;
    req.session.email = email;
    req.session.displayName = displayName;
    req.session.csrfToken = existingCsrf;
    await saveSession(req);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/delete-account
 * Permanently deletes user account and all cascaded data in MySQL; destroys session.
 */
async function deleteAccount(req, res, next) {
  try {
    const { password, confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({
        success: false,
        error: { code: 'CONFIRMATION_REQUIRED', message: "Please type 'DELETE' to confirm account deletion" }
      });
    }

    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
      [req.session.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not found' }
      });
    }

    const match = await bcrypt.compare(password || '', rows[0].password_hash);
    if (!match) {
      return res.status(400).json({
        success: false,
        error: { code: 'INCORRECT_PASSWORD', message: 'Password confirmation failed' }
      });
    }

    const userId = req.session.userId;

    // Delete user; MySQL ON DELETE CASCADE removes user_settings, appliances, snapshots, and bills
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    // Destroy active session and clear cookie
    const config = require('../config');
    await destroySession(req);
    res.clearCookie(config.session.name, { path: '/' });

    return res.status(200).json({
      success: true,
      message: 'Account and all associated household records permanently erased'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount
};
