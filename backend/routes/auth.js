// ============================================
// AUTH ROUTES
// ============================================
// PURPOSE: Define routes for user authentication (signup and login).
// ENDPOINTS:
//   POST /api/auth/signup - Register new user account
//   POST /api/auth/login - Authenticate and get JWT token
// NO AUTHENTICATION REQUIRED: These are public endpoints
// ============================================

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Signup endpoint - Register new user
router.post('/signup', authController.signup);

// Login endpoint - Authenticate user and receive JWT
router.post('/login', authController.login);

module.exports = router;
