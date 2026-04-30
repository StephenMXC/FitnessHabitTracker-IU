// ============================================
// AUTH CONTEXT - GLOBAL AUTHENTICATION STATE
// ============================================
// PURPOSE: Manage login, signup, logout and share auth state across entire app.
// FLOW:
// 1. AuthProvider wraps app and provides auth functions/state
// 2. useAuth() hook lets components access authentication data
// 3. Persists user session in localStorage for page reloads
// PROVIDES: { user, isLoading, error, login, signup, logout, isAuthenticated }
// ============================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

// === CREATE CONTEXT ===
// Context is a React feature for sharing state without prop drilling
// AuthContext will hold authentication state (user, token, loading, error)
// Any component can access this context using useAuth() hook
const AuthContext = createContext(null);

// === AUTH PROVIDER COMPONENT ===
// Wrap your entire app with <AuthProvider> to provide auth functionality everywhere
// This component manages login, signup, logout and persists user session
export function AuthProvider({ children }) {
  // === STATE VARIABLES ===
  const [user, setUser] = useState(null);                  // Current logged-in user data
  const [isLoading, setIsLoading] = useState(true);        // Loading state for async operations
  const [error, setError] = useState(null);                // Error messages from auth operations

  // === INITIALIZE ON APP LOAD ===
  // Check if user is already logged in from previous session (stored in localStorage)
  // This runs once when component mounts
  useEffect(() => {
    // Try to restore session from localStorage
    // If user was logged in before, these values will be present
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    // If all three values exist, user is already authenticated
    // Set user state so app treats them as logged in
    if (token && userId && username) {
      setUser({ userId, token, username });
    }

    // Mark loading as complete (whether user was found or not)
    setIsLoading(false);
  }, []);

  // === LOGIN FUNCTION ===
  // Authenticate user with username and password
  // On success: saves token to localStorage and sets user state
  // On failure: sets error message and returns error object
  const login = async (username, password) => {
    setError(null);              // Clear any previous errors
    setIsLoading(true);          // Show loading state

    try {
      // Call backend login endpoint
      // Returns { token, userId } on success
      const response = await authAPI.login(username, password);
      const { token, userId } = response;

      // === PERSIST TO LOCALSTORAGE ===
      // Save auth data so user stays logged in across page reloads
      // These values are checked on app load (see useEffect above)
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);

      // Update React state to trigger re-renders
      // All components using useAuth() will now see this user as logged in
      setUser({ userId, token, username });
      return { success: true, userId };
    } catch (err) {
      // Set error message for UI to display
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      // Always stop loading, whether success or failure
      setIsLoading(false);
    }
  };

  // === SIGNUP FUNCTION ===
  // Register new user account
  // On success: saves token to localStorage and sets user state
  // On failure: sets error message and returns error object
  const signup = async (username, email, password) => {
    setError(null);              // Clear any previous errors
    setIsLoading(true);          // Show loading state

    try {
      // Call backend signup endpoint
      // Returns { token, userId } on success
      const response = await authAPI.signup(username, email, password);
      const { token, userId } = response;

      // === PERSIST TO LOCALSTORAGE ===
      // Save auth data same as login
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);

      // Update React state to trigger re-renders
      setUser({ userId, token, username });
      return { success: true, userId };
    } catch (err) {
      // Set error message for UI to display
      const errorMsg = err.message || 'Signup failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      // Always stop loading, whether success or failure
      setIsLoading(false);
    }
  };

  // === LOGOUT FUNCTION ===
  // Clear authentication and end user session
  // Removes token from localStorage and clears user state
  const logout = () => {
    // Remove all auth-related data from localStorage
    // User will need to login again on next visit
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    // Clear React state to trigger re-renders
    // App will treat user as logged out
    setUser(null);
    setError(null);
  };

  // === CONTEXT VALUE ===
  // Package all auth state and functions to share with consumers
  const value = {
    user,                      // Current logged-in user or null
    isLoading,                 // True while login/signup is processing
    error,                     // Error message from last failed operation
    login,                     // Function to login
    signup,                    // Function to signup
    logout,                    // Function to logout
    isAuthenticated: !!user,   // Boolean: true if user is logged in (!!user converts to boolean)
  };

  // === PROVIDE CONTEXT ===
  // AuthContext.Provider makes 'value' available to all child components
  // Use useAuth() hook in any child component to access this value
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// === CUSTOM HOOK: useAuth ===
// Call this hook from any component to get auth state and functions
// Example: const { user, isAuthenticated, login } = useAuth();
// Throws error if used outside AuthProvider (must be in app tree)
export function useAuth() {
  const context = useContext(AuthContext);
  // Ensure hook is used within AuthProvider
  // If called outside AuthProvider, context will be null
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
