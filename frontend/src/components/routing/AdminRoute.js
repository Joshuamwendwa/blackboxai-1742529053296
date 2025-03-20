import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }}
      replace 
    />;
  }

  // If authenticated but not admin, redirect to home
  if (!isAdmin()) {
    return <Navigate 
      to="/"
      replace 
      state={{ 
        error: "You don't have permission to access this area" 
      }}
    />;
  }

  // If authenticated and admin, render child routes
  return <Outlet />;
}

export default AdminRoute;