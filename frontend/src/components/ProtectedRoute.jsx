// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
// PURPOSE: Prevent unauthorized access to authenticated pages.
// LOGIC:
// - If user is logged in: render requested page
// - If user not logged in: redirect to login page
// - While loading: show loading message
// USAGE: <ProtectedRoute><Dashboard /></ProtectedRoute>
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ProtectedRoute/protected-route.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading message while checking authentication
  if (isLoading) {
    return <div className="loading-container">
      <h2>Loading...</h2>
    </div>;
  }

  // Show protected content if authenticated, otherwise redirect to login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
