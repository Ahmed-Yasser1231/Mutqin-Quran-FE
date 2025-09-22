import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../features/auth/authService.js';

/**
 * Protected Route component that redirects to login if user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactElement} - Protected content or redirect
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}