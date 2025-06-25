import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they tried to access
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If a specific role is required, check permissions
  if (requiredRole && !hasPermission(requiredRole)) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the protected component
  return <>{children}</>;
}