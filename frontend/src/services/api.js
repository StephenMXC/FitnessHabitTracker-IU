// ============================================
// API SERVICE - CENTRALIZED BACKEND COMMUNICATION
// ============================================
// PURPOSE: Handle all HTTP requests to backend, manage JWT tokens, and error handling.
// FEATURES:
//   - Auto JWT token injection from localStorage
//   - Centralized error handling
//   - Automatic 401 token refresh
// ENDPOINTS: All grouped by feature (auth, habits, dashboard)
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

// === HELPER FUNCTION: Get JWT Token ===
// Retrieves JWT token from browser's localStorage
// Token was saved here after successful login/signup
// Used to authenticate requests to protected backend endpoints
const getAuthToken = () => {
  // localStorage.getItem() returns the token string or null if not found
  return localStorage.getItem('authToken');
};

// === CORE API CALL FUNCTION ===
// Generic function that handles all HTTP requests to backend
// Automatically injects JWT token, handles errors, and parses JSON responses
// Accepts: 
//   - endpoint: API path (e.g., '/auth/login', '/habits')
//   - options: {method, body, requiresAuth, headers}
// Returns: Parsed JSON response from server
const apiCall = async (endpoint, options = {}) => {
  // Destructure options with sensible defaults
  const { method = 'GET', body = null, requiresAuth = true } = options;

  // === BUILD REQUEST HEADERS ===
  const headers = {
    'Content-Type': 'application/json',  // Tell server we're sending JSON
    ...options.headers,                   // Allow custom headers from caller
  };

  // === AUTO-INJECT JWT TOKEN ===
  // If route requires authentication, add JWT token to Authorization header
  // Format: "Authorization: Bearer TOKEN"
  // Backend middleware extracts and verifies this token on protected routes
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // === BUILD FETCH CONFIG ===
  const config = {
    method,      // HTTP method: GET, POST, PUT, DELETE, etc.
    headers,     // Request headers including JWT token
  };

  // Add request body for POST/PUT requests
  if (body) {
    config.body = JSON.stringify(body);  // Convert JavaScript object to JSON string
  }

  try {
    // === MAKE HTTP REQUEST ===
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // === HANDLE 401 UNAUTHORIZED ===
    // If token is invalid/expired (401 error), clear localStorage
    // This forces user to login again on next page reload
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    }

    // === PARSE RESPONSE ===
    const data = await response.json();  // Convert JSON response to JavaScript object

    // === CHECK IF REQUEST WAS SUCCESSFUL ===
    // response.ok is false for 4xx/5xx status codes
    if (!response.ok) {
      // Throw error with server error message or generic message
      throw new Error(data.error || `API Error: ${response.status}`);
    }

    // Return parsed response data to caller
    return data;
  } catch (error) {
    // Log error to browser console for debugging
    console.error('API Error:', error.message);
    // Re-throw error so calling component can handle it
    throw error;
  }
};

// ========== AUTHENTICATION ENDPOINTS ==========
// Public endpoints for user registration and login
// These don't require JWT authentication (new users don't have tokens yet)
export const authAPI = {
  // User registration - create new account
  // Returns: { token, userId } to store in localStorage
  signup: (username, email, password) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: { username, email, password },
      requiresAuth: false,  // Public endpoint - no token required
    }),

  // User login - authenticate existing user
  // Returns: { token, userId } to store in localStorage
  login: (username, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { username, password },
      requiresAuth: false,  // Public endpoint - no token required
    }),
};

// ========== HABITS ENDPOINTS ==========
// Protected endpoints for habit management (CRUD operations)
// All require valid JWT token in Authorization header
export const habitsAPI = {
  // Get all habits for current user
  getHabits: () =>
    apiCall('/habits', {
      method: 'GET',
      requiresAuth: true,  // Requires JWT token
    }),

  // Create new habit for current user
  // name, category, description, image required in body
  createHabit: (name, category, description, image = null) =>
    apiCall('/habits', {
      method: 'POST',
      body: { name, category, description, image },
      requiresAuth: true,
    }),

  // Update existing habit by ID
  // Only works if habit belongs to current user
  updateHabit: (habitId, name, category, description, image = null) =>
    apiCall(`/habits/${habitId}`, {
      method: 'PUT',
      body: { name, category, description, image },
      requiresAuth: true,
    }),

  // Delete habit by ID
  // Only works if habit belongs to current user
  deleteHabit: (habitId) =>
    apiCall(`/habits/${habitId}`, {
      method: 'DELETE',
      requiresAuth: true,
    }),

  // Mark habit as complete or incomplete for today
  // completed: true = mark as done, false = mark as not done
  markHabitComplete: (habitId, completed) =>
    apiCall(`/habits/${habitId}/mark-complete`, {
      method: 'POST',
      body: { completed },
      requiresAuth: true,
    }),
};

// ========== DASHBOARD ENDPOINTS ==========
// Protected endpoints for dashboard statistics and tracking
// All require valid JWT token in Authorization header
export const dashboardAPI = {
  // Get dashboard statistics for current user
  // Returns: {totalHabits, completedToday, completionRate, habits[], weeklyCompletion[]}
  getStats: () =>
    apiCall('/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    }),

  // Mark daily completion - records when user completes all habits in a day (100%)
  // date: YYYY-MM-DD format
  // isFullyCompleted: true = all habits done, false = not all done
  markCompletion: (date, isFullyCompleted) =>
    apiCall('/dashboard/mark-completion', {
      method: 'POST',
      body: { date, isFullyCompleted },
      requiresAuth: true,
    }),
};

// ========== HEALTH CHECK ==========
// Simple endpoint to verify backend is running
// Used for debugging/monitoring purposes
export const healthCheck = () =>
  apiCall('/health', {
    method: 'GET',
    requiresAuth: false,  // Public endpoint
  });
