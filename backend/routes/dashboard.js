// ============================================
// DASHBOARD ROUTES
// ============================================
// PURPOSE: Define routes for dashboard statistics and daily completion tracking.
// ENDPOINTS:
//   GET /api/dashboard/stats - Get dashboard statistics (habits, completion rate, weekly progress)
//   POST /api/dashboard/mark-completion - Mark when user achieves 100% daily completion
// SECURITY: All routes require verifyToken middleware (JWT authentication)
// ============================================

const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth'); // Protect routes - require JWT token

const router = express.Router();

// Get dashboard statistics
router.get('/stats', verifyToken, dashboardController.getDashboardStats);

// Mark daily completion (when user completes all habits for a day)
router.post('/mark-completion', verifyToken, dashboardController.markDailyCompletion);

module.exports = router;
