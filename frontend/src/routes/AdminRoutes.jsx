import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

// Layouts
import AdminLayout from '../layouts/AdminLayout';

// Admin pages
// Import your admin pages here

const AdminRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated or not an admin
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
          {/* Add other admin routes here */}
          {/* Example:
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/reports" element={<AdminReports />} />
          */}
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

// Placeholder components until you create the actual pages
const AdminDashboard = () => <div>Admin Dashboard</div>;
const AdminUsers = () => <div>Admin Users Management</div>;

export default AdminRoutes;