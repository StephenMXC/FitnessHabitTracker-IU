require('dotenv').config(); // Load environment variables from .env file

const express = require('express'); // this line imports the Express framework, which is a popular web app framework for node.js. It 
//                                     provides a simple way to create web servers and APIs. "require" is how we include external modules in Node.js,
//                                     similar to "import" in other languages. const express a variable that holds the imported Express module .
const cors = require('cors'); // imports the cors middleware, which allows your frontend to talk to the backend
//                               without running into cross-origin issues.
//                               CORS stands for Cross-Origin Resource Sharing, 
//                               and it's a security feature in browsers
//                               that restricts web pages from making requests
//                               to a different domain than the one that served
//                               the web page. By using this middleware, we can
//                               enable our frontend (which might be served from a different port or domain)
//                               to communicate with our backend API.
const db = require('./database'); // imports SQLite database setup. db now gives access to the database tables and methods for queries.

// these three lines import route files that define endpoints for authentication, habits and dashboard stats.
// These are like "sub-programs" that handle specific URLs. 
const authRoutes = require('./routes/auth');
const habitsRoutes = require('./routes/habits');
const dashboardRoutes = require('./routes/dashboard');
const { verifyToken } = require('./middleware/auth'); // Import auth middleware

const app = express(); // Creates an Express application instance. app is now the main server. Routes and middleware will be attached to it.
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Middleware
app.use(cors()); // adds cors support globally. allows frontend to make requests to teh backend from a different origin. 
app.use(express.json({ limit: '50mb' })); // Tells express to auto parse incoming JSON requests and accept payloads up to 50MB (for images)

// Routes
// These three lines mount the route modules (authRoutes, habitsRoutes, dashboardRoutes) 
// on specific URL paths. Example: a POST to /api/auth/signup is handled by authRoutes, a GET to /api/habits is handled by habitsRoutes, and a GET to /api/dashboard/stats is handled by dashboardRoutes.
// Express checks the paths, finds the correct route and calls the appropriate controller function.
app.use('/api/auth', authRoutes); 
app.use('/api/habits', habitsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start server
// This line starts the server and makes it listen on the defined
// PORT. When the server is up and running, 
// it logs a message to the console with the URL where it's accessible.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Health check - PROTECTED: only authenticated users can check health status
// This prevents information leakage about whether the backend is running
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