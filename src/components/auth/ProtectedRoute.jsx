// src/components/auth/ProtectedRoute.jsx
// Wrapper for routes that require authentication

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', background: '#0f172a'
      }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, save intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based protection
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
