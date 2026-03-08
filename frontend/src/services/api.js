// API Service - centralized backend communication
// All backend API calls go through here

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper to make API requests
const apiCall = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, requiresAuth = true } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if required and available
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

    // If 401, token is invalid - clear it
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

// ========== AUTH ENDPOINTS ==========
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
};

// ========== DASHBOARD ENDPOINTS ==========
export const dashboardAPI = {
  getStats: () =>
    apiCall('/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    }),
};

// ========== HEALTH CHECK ==========
export const healthCheck = () =>
  apiCall('/health', {
    method: 'GET',
    requiresAuth: false,
  });
