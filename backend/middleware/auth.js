// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
// PURPOSE: Verify JWT tokens on protected routes.
// SECURITY: Extracts JWT from Authorization header, verifies signature, and sets req.userId.
// FLOW: Check token exists → Verify signature → Extract userId → Allow route to proceed
// USAGE: Use verifyToken middleware on routes that require authentication
// ============================================

const jwt = require('jsonwebtoken'); // JWT library for creating/verifying tokens

// JWT secret key - used to sign and verify tokens
// In production, this MUST be in .env file for security
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-for-production';

// MIDDLEWARE: Verify JWT token and extract userId
// Used as middleware on protected routes: router.get('/route', verifyToken, handler)
// Expects Authorization header format: "Bearer <TOKEN>"
function verifyToken(req, res, next) {
  // Extract token from Authorization header (format: "Bearer TOKEN")
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token signature with JWT_SECRET and extract payload (userId)
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Set userId for use in route handlers
    next(); // Continue to next middleware/route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyToken, JWT_SECRET };