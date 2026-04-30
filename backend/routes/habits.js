// ============================================
// HABITS ROUTES
// ============================================
// PURPOSE: Define routes for habit management (CRUD operations).
// ENDPOINTS:
//   GET /api/habits - Get all habits for authenticated user
//   POST /api/habits - Create new habit
//   PUT /api/habits/:id - Update habit by ID
//   DELETE /api/habits/:id - Delete habit by ID
//   POST /api/habits/:id/mark-complete - Toggle habit completion status
// SECURITY: All routes require verifyToken middleware (JWT authentication)
// ============================================

const express = require('express');
const habitsController = require('../controllers/habitsController');
const { verifyToken } = require('../middleware/auth'); // Protect routes - require JWT token

const router = express.Router();

// All habit routes require authentication (verifyToken middleware)
router.get('/', verifyToken, habitsController.getHabits);
router.post('/', verifyToken, habitsController.createHabit);
router.put('/:id', verifyToken, habitsController.updateHabit);
router.delete('/:id', verifyToken, habitsController.deleteHabit);
router.post('/:id/mark-complete', verifyToken, habitsController.markHabitComplete);

module.exports = router;          