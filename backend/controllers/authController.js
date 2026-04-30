// ============================================
// AUTHENTICATION CONTROLLER
// ============================================
// PURPOSE: Handle user registration (signup) and login (authentication).
// FLOW:
//   Signup: Validate input → Hash password → Store in DB → Generate JWT → Return token
//   Login: Validate input → Find user → Verify password → Generate JWT → Return token
//
// RECEIVES: req.body with username, email, password
// RETURNS: JSON with token (for frontend to store and use in API requests)
// ============================================

const bcrypt = require('bcryptjs'); // Password hashing library
const jwt = require('jsonwebtoken'); // JWT token generation and verification
const db = require('../database'); // Database connection
const { JWT_SECRET } = require('../middleware/auth'); // Secret key for signing tokens

// SIGNUP ENDPOINT: Create new user account
// Receives: { username, email, password }
// Returns: { token, userId } on success; error message on failure
exports.signup = (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Hash password with 10 salt rounds for security
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert user into database
  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      // Generate JWT token with userId payload (expires in 30 days)
      // Token is generated after successful DB insertion to ensure we have the correct userId
      const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '30d' });
      res.status(201).json({ message: 'Signup successful', token, userId: this.lastID });
    }
  );
};


// LOGIN ENDPOINT: Authenticate user and return JWT token
// Receives: { username, password }
// Returns: { token, userId } on success; error message on failure
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Find user by username in database
  db.get('SELECT id, password FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token with userId payload (expires in 30 days)
    // Frontend will store this token and send it in Authorization header for protected routes
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ message: 'Login successful', token, userId: user.id });
  });
};