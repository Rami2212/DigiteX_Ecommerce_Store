import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineCreditCard,
  HiOutlineLocationMarker,
  HiOutlineEye,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClipboardList
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    wishlistItems: 0,
    totalSpent: 0
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setStats({
      totalOrders: 12,
      pendingOrders: 2,
      deliveredOrders: 8,
      wishlistItems: 5,
      totalSpent: 2450.00
    });
  }, []);

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: 2,
      statusColor: 'text-green-600 bg-green-100'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'In Transit',
      total: 149.99,
      items: 1,
      statusColor: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 89.99,
      items: 1,
      statusColor: 'text-yellow-600 bg-yellow-100'
    }
  ];

  const quickActions = [
    {
      name: 'View Orders',
      icon: HiOutlineShoppingBag,
      path: '/user/orders',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      name: 'Wishlist',
      icon: HiOutlineHeart,
      path: '/user/wishlist',
      color: 'bg-red-50 text-red-600 hover:bg-red-100'
    },
    {
      name: 'Addresses',
      icon: HiOutlineLocationMarker,
      path: '/user/addresses',
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    {
      name: 'Payment Methods',
      icon: HiOutlineCreditCard,
      path: '/user/payment-methods',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
    }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'text-blue-600' }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')} mr-4`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-white">
          Welcome back, {user?.firstName || user?.name || 'User'}!
        </h1>
        <p className="">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={HiOutlineShoppingBag}
          title="Total Orders"
          value={stats.totalOrders}
          color="text-blue-600"
        />
        <StatCard
          icon={HiOutlineTruck}
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="In progress"
          color="text-yellow-600"
        />
        <StatCard
          icon={HiOutlineCheckCircle}
          title="Delivered Orders"
          value={stats.deliveredOrders}
          subtitle="Successfully delivered"
          color="text-green-600"
        />
        <StatCard
          icon={HiOutlineHeart}
          title="Wishlist Items"
          value={stats.wishlistItems}
          color="text-red-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.path}
                className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-200 ${action.color}`}
              >
                <Icon className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium text-center">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders and Account Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link 
              to="/user/orders" 
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{order.id}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.items} item{order.items > 1 ? 's' : ''} • {order.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${order.total}</p>
                  </div>
                  <Link 
                    to={`/user/orders/${order.id}`}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <HiOutlineEye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Spent</span>
              <span className="font-semibold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
              <span className="font-semibold text-gray-900 dark:text-white">Jan 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
              <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                Active
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <Link 
                to="/user/profile" 
                className="flex items-center text-primary hover:text-primary-dark text-sm font-medium"
              >
                <HiOutlineClipboardList className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;