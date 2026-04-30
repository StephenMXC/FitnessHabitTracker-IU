// ============================================
// APP COMPONENT - MAIN APPLICATION ROUTER
// ============================================
// PURPOSE: Set up routing structure and layout management.
// ROUTES:
//   /login - Login page (public)
//   /signup - Signup page (public)
//   / - Dashboard (protected, shows with sidebar)
//   /habits - Habits page (protected, shows with sidebar)
// FLOW:
// 1. AuthProvider wraps entire app to manage authentication state
// 2. Router enables page navigation
// 3. AppRoutes handles all route definitions
// 4. LayoutWrapper conditionally shows sidebar for authenticated pages
// 5. ProtectedRoute component blocks non-authenticated users
// ============================================

import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Habits from "./pages/Habits/Habits";
import DefaultLayout from "./layout/DefaultLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layout wrapper - conditionally shows sidebar based on authentication
// Non-authenticated users see full-screen auth pages
// Authenticated users see sidebar + main content layout
function LayoutWrapper({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return children; // Show full-screen without sidebar
  }
  
  return <DefaultLayout>{children}</DefaultLayout>; // Show with sidebar
}

// Define all application routes
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* PUBLIC AUTH ROUTES - redirect to dashboard if already logged in */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />

      {/* PROTECTED DASHBOARD ROUTE */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Dashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* PROTECTED HABITS ROUTE */}
      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Habits />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK: 404 PAGE */}
      <Route path="/*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

// Main App component - set up authentication context and routing
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
