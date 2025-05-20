import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import admin components
import AdminLayout from '../layouts/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';

const AdminRoutes = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Admin login route - accessible when not authenticated */}
      <Route 
        path="/login" 
        element={
          isAuthenticated && isAdmin ? (
            <Navigate to="/admin" replace />
          ) : (
            <AdminLogin />
          )
        } 
      />
      
      {/* Protected admin routes */}
      <Route 
        path="/*" 
        element={
          isAuthenticated && isAdmin ? (
            <AdminLayout />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      >
        {/* Default admin dashboard */}
        <Route index element={<AdminDashboard />} />
        
        {/* Other admin routes */}
        <Route path="users" element={<div>Users Management</div>} />
        <Route path="users/new" element={<div>Add New User</div>} />
        <Route path="content/*" element={<div>Content Management</div>} />
        <Route path="media/*" element={<div>Media Management</div>} />
        <Route path="settings/*" element={<div>Settings</div>} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;