// This file defines the route for dashboard-related endpoints. 
//  It connects the GET /api/dashboard/stats endpoint to the getDashboardStats function in dashboardController.js. 
// The verifyToken middleware is used to protect this route, ensuring that only authenticated users can access their dashboard stats.

const express = require('express'); // importing express framework to create a router for dashboard endpoints
const dashboardController = require('../controllers/dashboardController'); // importing the dashboard controller for handling dashboard requests
const { verifyToken } = require('../middleware/auth');// importing the verifyToken middleware to protect the dashboard stats route. This ensures that only authenticated users can access their dashboard stats.

const router = express.Router(); // new router instance to define dashboard routes. This allows us to modularize our routes and keep the code organized. We will export this router and use it in server.js to mount it on the /api/dashboard path.

router.get('/stats', verifyToken, dashboardController.getDashboardStats); // defining a GET route for /stats. 
// When a GET request is made to /api/dashboard/stats, the verifyToken middleware will first 
// check if the user is authenticated. 
// If they are, it will call the getDashboardStats function in the dashboardController to 
// handle the request and return the user's dashboard statistics. without that middleware, anyone could access this endpoint 
// and see stats for any user, which would be a security issue.

module.exports = router;
