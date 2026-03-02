// This is the route file for authentication-related endpoints.
// It defines the routes for user signup and login, and connects them to the appropriate controller functions
// in authController.js. When a POST request is made to /api/auth/signup, the signup function
// in authController will handle it.

const express = require('express');
const authController = require('../controllers/authController'); // importing authController, defined in controllers/authController.js, which contains the logic for handling signup and login requests. 

const router = express.Router(); // new router instance. allows defining routes. done just below.

router.post('/signup', authController.signup); // defines post route for /signup, calling signup from authcontroller.
router.post('/login', authController.login); // defines post for /login, calling login from authcontroller.

module.exports = router;
