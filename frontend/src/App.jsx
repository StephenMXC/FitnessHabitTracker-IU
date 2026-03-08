import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Habits from "./pages/Habits/Habits";
import DefaultLayout from "./layout/DefaultLayout";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layout wrapper component
function LayoutWrapper({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Don't show sidebar on login/signup pages
  if (!isAuthenticated) {
    return children;
  }
  
  return <DefaultLayout>{children}</DefaultLayout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />

      {/* Protected Routes */}
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

      {/* 404 */}
      <Route path="/*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

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
