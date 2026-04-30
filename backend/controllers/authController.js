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

  // === VALIDATION STEP ===
  // Check all required fields are present before processing
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Enforce minimum password length for security (prevents weak passwords)
  // Short passwords are easier to crack via brute force attacks
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // === SECURITY: PASSWORD HASHING ===
  // bcryptjs.hashSync() creates secure one-way hash of password
  // 10 salt rounds = good balance of security vs computational speed
  // Higher rounds = more secure but slower; lower = faster but less secure
  // CRITICAL: Never store plain text passwords in database
  const hashedPassword = bcrypt.hashSync(password, 10);

  // === DATABASE INSERTION ===
  // Insert new user with hashed password into database
  // ? placeholders prevent SQL injection attacks (parameterized queries)
  // this.lastID = auto-generated user ID from SQLite AUTOINCREMENT
  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        // Check if error is UNIQUE constraint violation (username/email exists)
        // SQLite throws this specific error when duplicate unique values detected
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      // === JWT TOKEN GENERATION ===
      // Create JWT token for client to store and use in future requests
      // Token contains userId payload which is encrypted/signed with JWT_SECRET
      // Expires in 30 days - after expiry, user must login again to get new token
      // This token is sent in Authorization header on all protected endpoint requests
      const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '30d' });
      
      // Return success response with token and userId
      // Frontend stores token in localStorage to automatically send with future API requests
      res.status(201).json({ message: 'Signup successful', token, userId: this.lastID });
    }
  );
};


// LOGIN ENDPOINT: Authenticate user and return JWT token
// Receives: { username, password }
// Returns: { token, userId } on success; error message on failure
exports.login = (req, res) => {
  const { username, password } = req.body;

  // === USER LOOKUP ===
  // Query database for user with given username
  // We only fetch id and password hash (no need for other fields like email)
  // Using ? placeholder prevents SQL injection attacks
  db.get('SELECT id, password FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // If no user found, return generic error message (security best practice)
    // Don't say "username not found" - prevents attackers from knowing which usernames exist
    // This is called "security through obscurity" for authentication
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // === PASSWORD VERIFICATION ===
    // Compare provided password with stored hashed password
    // bcryptjs.compareSync() safely compares plaintext password to hash
    // Never compare plaintext passwords directly to plaintext - always use bcryptjs
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordValid) {
      // Return same generic error as user not found (security best practice)
      // This prevents attackers from knowing which usernames have valid accounts
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // === JWT TOKEN GENERATION ===
    // Password is valid! Now create JWT token for authenticated session
    // Token contains user's ID and expires in 30 days
    // Frontend will store this in localStorage and include in all future requests
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    
    // Return token and userId for frontend to store and use
    // Frontend will: 1) store token in localStorage, 2) send token with every API request in Authorization header
    res.json({ message: 'Login successful', token, userId: user.id });
  });
};