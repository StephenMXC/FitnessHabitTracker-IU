// ============================================
// FITNESS TRACKER - BACKEND SERVER
// ============================================
// ENTRY POINT: Sets up Express server, configures middleware, and mounts all API routes.
// 
// PROGRAM FLOW:
// 1. Load environment variables from .env file (JWT_SECRET, PORT, etc.)
// 2. Import Express framework and required middleware
// 3. Import database connection
// 4. Import route handlers for auth, habits, and dashboard endpoints
// 5. Create Express app instance and configure middleware
// 6. Mount routes at specific paths (/api/auth, /api/habits, /api/dashboard)
// 7. Start server on specified port
//
// COMMUNICATION:
// - Frontend communicates with this backend via HTTP requests
// - Backend queries SQLite database for user and habit data
// - All protected routes require JWT token verification
// ============================================

require('dotenv').config(); // Load environment variables from .env file (JWT_SECRET, PORT, etc.)

const express = require('express'); // Web framework for building HTTP APIs
const cors = require('cors'); // Middleware to allow cross-origin requests from frontend
const db = require('./database'); // SQLite database connection for querying/storing data

// Import route handlers: each file defines endpoints for specific features
const authRoutes = require('./routes/auth'); // POST /login, POST /signup
const habitsRoutes = require('./routes/habits'); // GET/POST/PUT/DELETE /habits
const dashboardRoutes = require('./routes/dashboard'); // GET /stats, POST /mark-completion
const { verifyToken } = require('./middleware/auth'); // Middleware to verify JWT tokens on protected routes

const app = express(); // Create Express application instance
const PORT = process.env.PORT || 5000; // Server port from .env or default to 5000

// MIDDLEWARE CONFIGURATION
app.use(cors()); // Enable CORS - allows frontend from different origin to communicate with backend
app.use(express.json({ limit: '50mb' })); // Parse incoming JSON requests up to 50MB (for habit images)

// ROUTE MOUNTING
// Mount route handlers at specific API paths:
// - /api/auth: authentication endpoints (login, signup)
// - /api/habits: habit CRUD operations (create, read, update, delete)
// - /api/dashboard: dashboard statistics and completion tracking
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// HEALTH CHECK ENDPOINT (Protected)
// Verifies backend is running. Only authenticated users can access (requires valid JWT token).
app.get('/api/health', verifyToken, (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handling middleware
// This is to catch any errors that happen in routes. So it prints the error to the console, sends a 500 internal server error JSON response to client. Without this, Express would crash on unhandled errors.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});




// In summary, backend starts, express listens on port 5000,
//  middleware runs for every request: 
// cors + json parsing, when requests 
// hit a route, they are forwarded to 
// the approporiate controller, 
// controller interacts with database,
//  computes response, response sent back 
// as JSON, if errors happen, the error handler catches it and sends a 500.