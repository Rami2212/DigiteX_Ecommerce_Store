import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineUser, 
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineCog,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineBell,
  HiOutlineQuestionMarkCircle,
  HiOutlineX,
  HiOutlineViewGrid,
  HiOutlineChartBar
} from 'react-icons/hi';

const UserSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/user/dashboard',
      icon: HiOutlineViewGrid,
    },
    {
      name: 'My Profile',
      path: '/user/my-profile',
      icon: HiOutlineUser,
    },
    {
      name: 'My Orders',
      path: '/user/my-orders',
      icon: HiOutlineShoppingBag,
    },
    {
      name: 'Wishlist',
      path: '/user/wishlist',
      icon: HiOutlineHeart,
    },
    {
      name: 'Statistics',
      path: '/user/stats',
      icon: HiOutlineChartBar,
    },
    {
      name: 'Notifications',
      path: '/user/notifications',
      icon: HiOutlineBell,
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`
        fixed top-[120px] left-0 h-[calc(100vh-120px)] w-64 bg-white dark:bg-gray-800 shadow-lg z-30 
        lg:static lg:z-auto lg:h-auto lg:w-full lg:shadow-none lg:border lg:border-gray-200 lg:dark:border-gray-700 lg:rounded-lg lg:top-0
        transform transition-transform duration-300 ease-in-out lg:transform-none overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar content */}
        <nav className="flex-1 px-4 py-6 space-y-2 lg:px-0 lg:py-0">
          <div className="mb-6 lg:mb-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider md:mt-5 mb-3 lg:px-4">
              Account
            </h3>
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 lg:px-4
                        ${isActive(item.path)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default UserSidebar;