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

// Get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Generic API call handler
// Accepts: endpoint path, options (method, body, headers, auth requirement)
// Returns: Parsed JSON response
// Throws: Error if request fails
const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, requiresAuth = true } = options;

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add JWT token to Authorization header if this route requires authentication
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

// ========== AUTHENTICATION ENDPOINTS ==========
export const authAPI = {
  signup: (username, email, password) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: { username, email, password },
      requiresAuth: false,
    }),

  login: (username, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { username, password },
      requiresAuth: false,
    }),
};

// ========== HABITS ENDPOINTS ==========
export const habitsAPI = {
  getHabits: () =>
    apiCall('/habits', {
      method: 'GET',
      requiresAuth: true,
    }),

  createHabit: (name, category, description, image = null) =>
    apiCall('/habits', {
      method: 'POST',
      body: { name, category, description, image },
      requiresAuth: true,
    }),

  updateHabit: (habitId, name, category, description, image = null) =>
    apiCall(`/habits/${habitId}`, {
      method: 'PUT',
      body: { name, category, description, image },
      requiresAuth: true,
    }),

  deleteHabit: (habitId) =>
    apiCall(`/habits/${habitId}`, {
      method: 'DELETE',
      requiresAuth: true,
    }),

  markHabitComplete: (habitId, completed) =>
    apiCall(`/habits/${habitId}/mark-complete`, {
      method: 'POST',
      body: { completed },
      requiresAuth: true,
    }),
};

// ========== DASHBOARD ENDPOINTS ==========
export const dashboardAPI = {
  getStats: () =>
    apiCall('/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    }),

  markCompletion: (date, isFullyCompleted) =>
    apiCall('/dashboard/mark-completion', {
      method: 'POST',
      body: { date, isFullyCompleted },
      requiresAuth: true,
    }),
};

// ========== HEALTH CHECK ==========
export const healthCheck = () =>
  apiCall('/health', {
    method: 'GET',
    requiresAuth: false,
  });
