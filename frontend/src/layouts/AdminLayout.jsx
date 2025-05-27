import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Don't redirect if we're still loading auth state
    if (isLoading) return;

    // If not authenticated, redirect to admin login
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
      return;
    }

    // If authenticated but not admin, redirect to home
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }

    // If we're on /admin/login and already authenticated admin, redirect to dashboard
    if (location.pathname === '/admin/login') {
      navigate('/admin', { replace: true });
    }

    // set theme for light
    if (theme === 'dark') {
      toggle();
    }

  }, [isAuthenticated, isAdmin, isLoading, navigate, location.pathname, theme, toggle]);

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Show loading screen while checking authentication
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

  // Don't render layout if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <AdminHeader 
          onToggleSidebar={handleToggleSidebar} 
          sidebarOpen={sidebarOpen}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;