import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../features/auth/authService.js';

/**
 * Protected Route component that redirects to login if user is not authenticated
 * and handles role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {Array} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} props.redirectTo - Path to redirect if role is not allowed
 * @returns {React.ReactElement} - Protected content or redirect
 */
export default function ProtectedRoute({ children, allowedRoles = [], redirectTo = '/dashboard' }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check user role
  if (allowedRoles.length > 0) {
    const userData = authService.getUserProfile();
    const userRole = userData?.role?.toUpperCase();
    
    // If user role is not in allowed roles, redirect
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to={redirectTo} replace />;
    }
  }
  
  return children;
}