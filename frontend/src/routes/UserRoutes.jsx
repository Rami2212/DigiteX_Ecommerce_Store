import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

// Layouts
import UserLayout from '../layouts/UserLayout';

// User pages
// Import your user pages here

const UserRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          {/* Add other user routes here */}
          {/* Example:
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/orders" element={<UserOrders />} />
          */}
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

// Placeholder components until you create the actual pages
const UserDashboard = () => <div>User Dashboard</div>;
const UserProfile = () => <div>User Profile</div>;

export default UserRoutes;