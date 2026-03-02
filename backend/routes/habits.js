// route file for habits endpoints. 
// defines routes for CRUD ops on habits and connects them to appropriate controller functions in habitsController.js.
// All routes are protected with verifyToken middleware to ensure only authenticated users can access them.

const express = require('express'); // importing express.
const habitsController = require('../controllers/habitsController');// importing habits controller to handle habit-related requests. 
// This file contains the logic for creating, reading, updating and deleting habits in the database.
const { verifyToken } = require('../middleware/auth'); // importing the verifyToken middleware to protect
//  the habit routes. only authenticated users can access
//  these routes. // without this middlewar, functionally, the controller will still work, but then everyone could access the routes and manipulate the data, 
// an obvious security issue.

const router = express.Router(); // new router instance. this allows defining routes in this file and exporting it to be used in server.js.

// routes for habits CRUD operations. Each route is protected with verifyToken middleware to ensure only authenticated users access the routes.
router.get('/', verifyToken, habitsController.getHabits);
router.post('/', verifyToken, habitsController.createHabit);
router.put('/:id', verifyToken, habitsController.updateHabit);
router.delete('/:id', verifyToken, habitsController.deleteHabit);

module.exports = router;


// In summary,
// this file defines
// the routes for managing 
// habits in the application. 
// It connects these routes to the 
// corresponding controller functions 
// that handle the business logic for 
// each operation. By using the verifyToken
// middleware, it ensures that only 
// authenticated users can perform actions 
// on their habits, thus maintaining the 
// security of the application.          