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

// Create context for sharing auth state throughout app
const AuthContext = createContext(null);

// AUTH PROVIDER COMPONENT: Wrap app to provide auth functionality
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app load (restore from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userId && username) {
      setUser({ userId, token, username }); // User is already logged in
    }

    setIsLoading(false);
  }, []);

  // LOGIN FUNCTION: Authenticate user and store token
  const login = async (username, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authAPI.login(username, password);
      const { token, userId } = response;

      // Store token and user info in localStorage for persistence
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);

      setUser({ userId, token, username });
      return { success: true, userId };
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // SIGNUP FUNCTION: Register new user and store token
  const signup = async (username, email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authAPI.signup(username, email, password);
      const { token, userId } = response;

      // Store token and user info in localStorage for persistence
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);

      setUser({ userId, token, username });
      return { success: true, userId };
    } catch (err) {
      const errorMsg = err.message || 'Signup failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT FUNCTION: Clear authentication and session
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
    setError(null);
  };

  // Context value - all data/functions available to consumers
  const value = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// CUSTOM HOOK: Use auth context in any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
