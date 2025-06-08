import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineChartBar
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useOrder } from '../../hooks/useOrder';
import { useWishlist } from '../../hooks/useWishlist';

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { userOrders, getUserOrders, userTotalOrders } = useOrder();
  const { wishlist, itemCount, getWishlist, updateItemCount } = useWishlist();

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    wishlistItems: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      getUserOrders(1, 10);
      getWishlist();
      updateItemCount();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userOrders && userOrders.length > 0) {
      const pendingCount = userOrders.filter(order => 
        ['pending', 'processing', 'shipped'].includes(order.status)
      ).length;
      
      const deliveredCount = userOrders.filter(order => 
        order.status === 'delivered'
      ).length;

      const totalSpent = userOrders.reduce((sum, order) => 
        sum + (order.totalAmount || 0), 0
      );

      setStats(prev => ({
        ...prev,
        totalOrders: userTotalOrders || userOrders.length,
        pendingOrders: pendingCount,
        deliveredOrders: deliveredCount,
        totalSpent: totalSpent,
        wishlistItems: itemCount || wishlist?.totalItems || 0
      }));
    }
  }, [userOrders, userTotalOrders, itemCount, wishlist]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const recentOrders = userOrders?.slice(0, 3) || [];

  const quickActions = [
    {
      name: 'user/my-Profile',
      icon: HiOutlineUser,
      path: 'Profile',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      name: 'View Orders',
      icon: HiOutlineShoppingBag,
      path: '/user/my-orders',
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    {
      name: 'Wishlist',
      icon: HiOutlineHeart,
      path: '/user/wishlist',
      color: 'bg-red-50 text-red-600 hover:bg-red-100'
    },
    {
      name: 'Stats',
      icon: HiOutlineChartBar,
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
          icon={HiOutlineClock}
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
              to="/user/my-orders" 
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        #{order.orderNumber || order._id.slice(-6)}
                      </h3>
                      <span className={`mt-7 mr-4 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <Link 
                      to={`/user/order/${order._id}`}
                      className="p-2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <HiOutlineEye className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <HiOutlineShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                <Link 
                  to="/products" 
                  className="text-primary hover:text-primary-dark text-sm font-medium mt-2 inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Spent</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${stats.totalSpent.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
              <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user?.isEmailVerified 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-yellow-600 bg-yellow-100'
              }`}>
                {user?.isEmailVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <Link 
                to="/user/my-profile" 
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