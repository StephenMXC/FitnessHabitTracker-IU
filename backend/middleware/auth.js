// middleware/auth.js
// this is conceptually connected to authController.js, but it is separated becasuse it is a different concern. authController.js is responsible for handling the logic of authentication (e.g., login, registration), while this file is responsible for verifying the JWTs that are issued by the authController.
// This file defines middleware for authentication using JSON Web Tokens (JWT). 
// JWTs are a way to securely transmit information between parties as a JSON object.
// They are commonly used for authentication in web applications.
// It exports a function to verify tokens and a secret key used for signing tokens. 
// This middleware will be used in protected routes to ensure only authenticated users can access them.

const jwt = require('jsonwebtoken'); // importing the jsonwebtoken library, which is used to create and verify JWTs.

// Get JWT_SECRET from environment variables (secure approach)
// Falls back to default only for development/testing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-for-production';

// This is the middleware function that will be used to protect routes. It checks for the presence of a JWT in 
// the authorization header of the incoming request, verifies it, and if valid, allows the request to proceed.
// The expected format of the authorization header is "Bearer TOKEN". If the token is missing or invalid,
// it responds with a 401 Unauthorized status and an error message.
// Without this function, anyone could access protected routes without authentication, which would be a security risk.

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { verifyToken, JWT_SECRET };



// In summary, 
// this middleware is 
// essential for securing routes 
// in the application by ensuring that
//  only authenticated users with valid 
// JWTs can access certain endpoints. It works
//  in conjunction with the authController.js,
//  which is responsible for issuing these tokens
//  upon successful authentication.