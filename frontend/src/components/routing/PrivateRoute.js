import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login with return url
  if (!isAuthenticated()) {
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }}
      replace 
    />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}

export default PrivateRoute;