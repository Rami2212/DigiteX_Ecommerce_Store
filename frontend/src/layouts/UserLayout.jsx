import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import UserSidebar from '../components/user/UserSidebar';
import { useAuth } from '../hooks/useAuth';
import { HiOutlineMenu } from 'react-icons/hi';

const UserLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Don't redirect if we're still loading auth state
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/auth/login', { 
        replace: true,
        state: { from: location }
      });
      return;
    }
  }, [isAuthenticated, isLoading, navigate, location]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {/* Container to match header width */}
        <div className="container mx-auto px-4 flex flex-1">
          {/* Mobile header for sidebar toggle */}
          <div className="lg:hidden absolute top-[120px] left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-10 overflow-hidden">
            <button
              onClick={handleToggleSidebar}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <HiOutlineMenu className="h-6 w-6 mr-2" />
              <span className="font-medium">Account Menu</span>
            </button>
          </div>

          {/* Sidebar - 1/5 width on desktop, mobile overlay */}
          <div className="hidden lg:block w-1/5 pr-6 mt-8">
            <UserSidebar isOpen={true} onClose={handleCloseSidebar} />
          </div>

          {/* Mobile Sidebar Overlay */}
          <div className="lg:hidden">
            <UserSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
          </div>
          
          {/* Main content - 4/5 width on desktop, full width on mobile */}
          <main className="flex-1 lg:w-4/5 bg-gray-50 dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent pt-16 lg:pt-8">
            <div className="lg:pl-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;