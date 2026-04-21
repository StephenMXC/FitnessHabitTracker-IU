// API Service - centralized backend communication layer.
// All backend API calls go through here. features:
// 1. handles all http requests
// 2. auto token management (stores jwt in localStorage)
// 3. auto error handling and 401 response.

const API_BASE_URL = 'http://localhost:5000/api';


// localStorage is a set of files on your ssd or hdd that are for the browser. 
// The browser reads and writes to those files on your behalf, but it acts as the gatekeeper — 
// JavaScript code talks to the browser API, and the browser handles the actual file I/O under the hood.

// Helper to get auth token from localStorage
// Retrieves the auth token from the browser's localStorage.
// Returns null if no token exists (e.g. user is not logged in).
const getAuthToken = () => {
  return localStorage.getItem('authToken'); 
};

// Helper function to make API requests.
// endpoint = the URL path e.g. "/users/1"
// options = optional config object. defaults to empty object {} if nothing is passed in.
const apiCall = async (endpoint, options = {}) => {

  // Destructuring: unpack these three properties out of the options object.
  // If options doesn't have them, use the default values on the right of each "=".
  // Equivalent to: const method = options.method ?? 'GET'; etc.
  const { method = 'GET', body = null, requiresAuth = true } = options;

  // Start building the headers object for the HTTP request.
  // 'Content-Type': 'application/json' tells the server we're sending JSON data.
  // ...options.headers spreads (merges) any extra headers the caller passed in.
  // If the caller passed a header with the same key, it overrides 'Content-Type'
  // because it comes second (last one wins).
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // If this endpoint requires authentication (which is true by default),
  // try to get the token from localStorage and attach it to the headers.
  // The "Bearer" format is a standard way to send auth tokens in HTTP requests.
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Build the config object that fetch() will use to make the HTTP request.
  // "method" and "headers" use shorthand -- same as writing method: method, headers: headers.
  const config = {
    method,
    headers,
  };

  // If a body was passed in (e.g. data for a POST request),
  // convert it from a JS object to a JSON string because HTTP requests
  // can only send text, not raw JS objects.
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    // Actually make the HTTP request. "await" pauses here until the server responds.
    // API_BASE_URL is something like "https://myapp.com/api", endpoint is like "/users/1".
    // So the full URL becomes e.g. "https://myapp.com/api/users/1".
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 401 means "Unauthorized" -- our token is expired or invalid.
    // So wipe the token and userId from localStorage to force the user to log in again.
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
    }

    // The response comes back as raw text. "await" pauses here while it
    // parses that text into a usable JS object.
    const data = await response.json();

    // response.ok is true for success status codes (200-299), false for errors (400, 500 etc).
    // If something went wrong, throw an error with the server's error message if it provided one,
    // or a generic message with the status code if it didn't.
    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }

    // If everything went fine, return the data to whoever called apiCall().
    return data;

  } catch (error) {
    // If anything in the try block threw an error, log it to the console
    // then re-throw it so the calling code can also handle it if needed.
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
