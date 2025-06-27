import React, { useState, useRef, useEffect } from 'react';
import {
  FiMenu,
  FiUser,
  FiLogOut,
  FiSettings,
  FiBell,
  FiChevronDown,
  FiSearch
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../common/Logo';

const AdminHeader = ({ onToggleSidebar, sidebarOpen }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setNotificationMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Left side - Logo and menu toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <div className="flex items-center">
            <Logo size="small" />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Admin
            </span>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationMenuRef}>
            <button
              onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiBell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* Notifications dropdown */}
            {notificationMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">New user registered</p>
                        <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">System update available</p>
                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                      View all notifications
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user?.profileImage || '/default-avatar.png'}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {(user?.firstName || user?.lastName)
                      ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                      : 'Admin User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.email || 'admin@example.com'}
                  </div>
                </div>
              </div>
              <FiChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <a
                    href="/admin/my-profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiUser className="mr-3 h-4 w-4" />
                    My Profile
                  </a>
                  <a
                    href="/admin/edit-profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiSettings className="mr-3 h-4 w-4" />
                    Settings
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;