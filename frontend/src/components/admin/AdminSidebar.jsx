import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiImage,
  FiSettings,
  FiShield,
  FiMail,
  FiPackage,
  FiChevronDown,
  FiChevronRight,
  FiX
} from 'react-icons/fi';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: FiHome,
      path: '/admin',
      exact: true
    },
    {
      title: 'Users',
      icon: FiUsers,
      path: '/admin/users',
      children: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Add New User', path: '/admin/add-user' },
      ]
    },
    {
      title: 'Categories',
      icon: FiFileText,
      path: '/admin/Categories',
      children: [
        { title: 'All Categories', path: '/admin/categories' },
        { title: 'Add New Category', path: '/admin/add-category' }
      ]
    },
    {
      title: 'Media',
      icon: FiImage,
      path: '/admin/media',
      children: [
        { title: 'Library', path: '/admin/media' },
        { title: 'Add New', path: '/admin/media/upload' }
      ]
    },
    {
      title: 'Products',
      icon: FiPackage,
      path: '/admin/products',
      children: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Add Product', path: '/admin/products/new' },
        { title: 'Categories', path: '/admin/products/categories' },
        { title: 'Orders', path: '/admin/products/orders' }
      ]
    },
    {
      title: 'Analytics',
      icon: FiSettings,
      path: '/admin/analytics',
      children: [
        { title: 'Dashboard', path: '/admin/analytics' },
        { title: 'Reports', path: '/admin/analytics/reports' },
        { title: 'Traffic', path: '/admin/analytics/traffic' }
      ]
    },
    {
      title: 'Messages',
      icon: FiMail,
      path: '/admin/messages'
    },
    {
      title: 'Security',
      icon: FiShield,
      path: '/admin/security',
      children: [
        { title: 'Access Logs', path: '/admin/security/logs' },
        { title: 'Permissions', path: '/admin/security/permissions' },
        { title: 'Backups', path: '/admin/security/backups' }
      ]
    },
    {
      title: 'Settings',
      icon: FiSettings,
      path: '/admin/settings',
      children: [
        { title: 'General', path: '/admin/settings/general' },
        { title: 'Appearance', path: '/admin/settings/appearance' },
        { title: 'Email', path: '/admin/settings/email' },
        { title: 'API', path: '/admin/settings/api' }
      ]
    }
  ];

  const [expandedItems, setExpandedItems] = React.useState(new Set());

  const toggleExpanded = (title) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedItems(newExpanded);
  };

  const isItemActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const isChildActive = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  React.useEffect(() => {
    // Auto-expand menu items that have active children
    menuItems.forEach(item => {
      if (item.children && isChildActive(item.children)) {
        setExpandedItems(prev => new Set(prev).add(item.title));
      }
    });
  }, [location.pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-slate-900 text-white transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 lg:hidden">
          <span className="text-lg font-semibold">Admin Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.title);
            const isActive = isItemActive(item);
            const hasActiveChild = hasChildren && isChildActive(item.children);

            return (
              <div key={item.title}>
                {/* Main menu item */}
                <div className="relative">
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isActive || hasActiveChild
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </div>
                      {isExpanded ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </NavLink>
                  )}
                </div>

                {/* Submenu */}
                {hasChildren && isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `
                          block px-3 py-2 rounded-md text-sm transition-colors
                          ${isActive
                            ? 'bg-blue-500 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }
                        `}
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800 border-t border-slate-700">
          <div className="text-center text-xs text-slate-400">
            <p>© 2025 Your App</p>
            <p>Admin Panel v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;