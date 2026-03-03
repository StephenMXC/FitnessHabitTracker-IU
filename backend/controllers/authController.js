const bcrypt = require('bcryptjs'); // importing bcryptjs for password hashing and verification.
const jwt = require('jsonwebtoken');// importing jsonwebtoken for generating and verifying JWT tokens.
const db = require('../database'); // importing the database connection.
const { JWT_SECRET } = require('../middleware/auth'); // importing JWT_SECRET from the auth middleware, 
//                                                       which is used for signing JWT tokens.

// the signup function, which will handle user registration.
exports.signup = (req, res) => {
  const { username, email, password } = req.body;// extracting username, email, and password 
  //                                                from the request body.

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Hash password
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

      // Generate JWT
      // yes, the token is generated here, within the callback function of the db.run method. 
      // This is because we need to ensure that the user has been successfully inserted into the database 
      // before we can generate a JWT token for that user. The this.lastID property gives us the ID of the newly inserted user, 
      // which we can then use as the payload for the JWT token. By generating the token inside the callback, we ensure that we have access to the correct user ID and that the token is only generated if the user was successfully created in the database.
      const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '30d' });
      res.status(201).json({ message: 'Signup successful', token, userId: this.lastID });
    }
  );
};


// the login function, which will handle user authentication.
exports.login = (req, res) => {
  const { username, password } = req.body; // extracting username and password from the request body.

  // Validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Find user
  // we find the id and password for a certain username.
  db.get('SELECT id, password FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.password); // comparing the provided password with the hashed password stored in the database using bcrypt's compareSync method.
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    // if the password is valid, we generate a JWT token for the user.
    // this token will include the user's ID as payload and will be signed using the JWT_SECRET. 
    // The token will also have an expiration time of 30 days. 
    // Finally, we send a JSON response back to the client that includes a success message, 
    // the generated token, and the user's ID.
    // when the user logs out, the token can be invalidated on the client side
    // by simply deleting it from local storage or wherever it's stored.
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ message: 'Login successful', token, userId: user.id });
  });
};


// in summary, this authController file defines the logic for user registration and authentication.
// The signup function handles user registration by validating input, hashing the password, 
// inserting the user into the database, and generating a JWT token for the new user.
// The login function handles user authentication by validating input, checking the username and 
// password against the database, 
// and generating a JWT token if the credentials are valid. 
// Both functions also handle errors and send appropriate JSON responses back to the client.