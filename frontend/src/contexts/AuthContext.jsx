import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext(null); // this creates a tunnel through which react pipes data through the component tree.
// it is like a TV channel that, prior to broadcasting, reserves a frequency for itself. The NULL value is there 
// for a component that tunes in before the Provider is set up (which is why useAuth() throws an error instead of silently returning null).

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (token exists) on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userId && username) {
      setUser({ userId, token, username });
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authAPI.login(username, password);
      const { token, userId } = response;

      // Store token, userId, and username in localStorage
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

  // Signup function
  const signup = async (username, email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authAPI.signup(username, email, password);
      const { token, userId } = response;

      // Store token, userId, and username in localStorage
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

  // Logout function
  const logout = () => {
    // Keep habit storage intact so data persists across sessions
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
    setError(null);
  };

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

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
