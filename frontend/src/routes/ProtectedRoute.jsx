import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if the route requires admin privileges
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user is authenticated and has the required role, render the children
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;