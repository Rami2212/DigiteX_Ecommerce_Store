// UserStatsPage.jsx - Fixed multiple loading issue
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlineGift,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineStar,
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCog
} from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import { useOrder } from '../../../hooks/useOrder';
import { useWishlist } from '../../../hooks/useWishlist';
import { UserStatsCalculations } from './UserStatsCalculations';

const UserStatsPage = () => {
  const { user } = useAuth();
  const { userOrders, getUserOrders } = useOrder();
  const { wishlist, getWishlist } = useWishlist();
  
  const [timeframe, setTimeframe] = useState('all');
  
  // Use useRef to track loading state without causing re-renders
  const loadedRef = useRef({ orders: false, wishlist: false });
  const [isLoading, setIsLoading] = useState(true);

  // Load data once on mount using useRef to prevent multiple calls
  useEffect(() => {
    const loadData = async () => {
      try {
        // Only load if not already loaded
        if (!loadedRef.current.orders) {
          await getUserOrders(1, 100);
          loadedRef.current.orders = true;
        }
        
        if (!loadedRef.current.wishlist) {
          await getWishlist();
          loadedRef.current.wishlist = true;
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array - runs only once on mount

  // Memoized stats calculation
  const stats = useMemo(() => {
    // Add debug logging to see when this recalculates
    console.log('Recalculating stats...', { 
      hasOrders: !!userOrders, 
      hasWishlist: !!wishlist, 
      timeframe 
    });

    if (userOrders !== undefined) {
      return UserStatsCalculations.calculateUserStats(
        userOrders, 
        wishlist, 
        user, 
        timeframe
      );
    }
    return {
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      totalItemsPurchased: 0,
      ordersByStatus: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      },
      ordersThisMonth: 0,
      ordersThisYear: 0,
      spentThisMonth: 0,
      spentThisYear: 0,
      favoriteShoppingDay: '',
      averageTimeBetweenOrders: 0,
      totalSavings: 0,
      discountOrders: 0,
      wishlistItems: 0,
      wishlistValue: 0,
      memberSince: null,
      accountAge: 0,
      orderHistory: []
    };
  }, [userOrders, wishlist, user, timeframe]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'text-blue-600' }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')} mr-4`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const OrderChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxAmount = Math.max(...data.map(d => d.amount));
    const chartHeight = 300;
    const chartPadding = { top: 20, right: 40, bottom: 60, left: 60 };

    return (
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order History</h2>
        
        <div className="relative overflow-x-auto">
          <svg 
            width="100%" 
            height={chartHeight + chartPadding.top + chartPadding.bottom}
            className="min-w-full"
            style={{ minWidth: `${data.length * 80}px` }}
          >
            {/* Y-axis grid lines and labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = chartPadding.top + (chartHeight * ratio);
              const value = maxAmount * (1 - ratio);
              return (
                <g key={index}>
                  <line
                    x1={chartPadding.left}
                    y1={y}
                    x2="95%"
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray={ratio === 1 ? "none" : "2,2"}
                  />
                  <text
                    x={chartPadding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    ${value.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* X-axis line */}
            <line
              x1={chartPadding.left}
              y1={chartHeight + chartPadding.top}
              x2="95%"
              y2={chartHeight + chartPadding.top}
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Y-axis line */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top}
              x2={chartPadding.left}
              y2={chartHeight + chartPadding.top}
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Bars */}
            {data.map((point, index) => {
              const barWidth = 60;
              const x = chartPadding.left + (index * (barWidth + 20)) + 10;
              const barHeight = (point.amount / maxAmount) * chartHeight;
              const y = chartHeight + chartPadding.top - barHeight;

              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#3b82f6"
                    rx="4"
                    className="hover:fill-blue-600 transition-colors cursor-pointer"
                  >
                    <title>{`${point.label}: ${point.orders} orders, ${UserStatsCalculations.formatCurrency(point.amount)}`}</title>
                  </rect>

                  {point.amount > 0 && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-700 dark:fill-gray-300 font-medium"
                    >
                      ${point.amount.toFixed(0)}
                    </text>
                  )}

                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + chartPadding.top + 20}
                    textAnchor="middle"
                    className="text-sm fill-gray-600 dark:fill-gray-400"
                  >
                    {point.label}
                  </text>

                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + chartPadding.top + 40}
                    textAnchor="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-500"
                  >
                    {point.orders} order{point.orders !== 1 ? 's' : ''}
                  </text>
                </g>
              );
            })}

            {/* Y-axis label */}
            <text
              x="20"
              y={chartHeight / 2 + chartPadding.top}
              textAnchor="middle"
              className="text-sm fill-gray-600 dark:fill-gray-400"
              transform={`rotate(-90, 20, ${chartHeight / 2 + chartPadding.top})`}
            >
              Amount ($)
            </text>
          </svg>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6 mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Statistics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your complete shopping analytics and insights
            </p>
          </div>
          <div className="flex items-center">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="month">This Month</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={HiOutlineShoppingBag}
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`${stats.ordersThisYear} this year`}
          color="text-blue-600"
        />
        <StatCard
          icon={HiOutlineCurrencyDollar}
          title="Total Spent"
          value={UserStatsCalculations.formatCurrency(stats.totalSpent)}
          subtitle={`${UserStatsCalculations.formatCurrency(stats.spentThisYear)} this year`}
          color="text-green-600"
        />
        <StatCard
          icon={HiOutlineChartBar}
          title="Average Order"
          value={UserStatsCalculations.formatCurrency(stats.averageOrderValue)}
          subtitle="Per order value"
          color="text-purple-600"
        />
        <StatCard
          icon={HiOutlineGift}
          title="Items Purchased"
          value={stats.totalItemsPurchased}
          subtitle="Total items"
          color="text-orange-600"
        />
      </div>

      {/* Full Width Order History Chart */}
      <motion.div variants={itemVariants}>
        <OrderChart data={stats.orderHistory} />
      </motion.div>

      {/* Two Column Layout: Status | Shopping Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Status</h2>
          <div className="space-y-2">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => {
              const statusConfig = {
                pending: { 
                  color: 'text-yellow-600 bg-yellow-100 border-yellow-200', 
                  icon: HiOutlineExclamationCircle,
                  label: 'Pending'
                },
                processing: { 
                  color: 'text-blue-600 bg-blue-100 border-blue-200', 
                  icon: HiOutlineCog,
                  label: 'Processing'
                },
                shipped: { 
                  color: 'text-purple-600 bg-purple-100 border-purple-200', 
                  icon: HiOutlineTruck,
                  label: 'Shipped'
                },
                delivered: { 
                  color: 'text-green-600 bg-green-100 border-green-200', 
                  icon: HiOutlineCheckCircle,
                  label: 'Delivered'
                },
                cancelled: { 
                  color: 'text-red-600 bg-red-100 border-red-200', 
                  icon: HiOutlineXCircle,
                  label: 'Cancelled'
                }
              };

              const config = statusConfig[status];
              const percentage = UserStatsCalculations.calculatePercentage(count, stats.totalOrders);

              return (
                <div 
                  key={status} 
                  className={`flex items-center justify-between p-2 px-4 rounded-lg border ${config.color}`}
                >
                  <div className="flex items-center space-x-4">
                    <config.icon className="h-6 w-6" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{config.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {percentage}% of total orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                    <p className="text-sm text-gray-500">orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Shopping Insights */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Shopping Insights</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <HiOutlineCalendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Favorite Shopping Day</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{stats.favoriteShoppingDay}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <HiOutlineClock className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Time Between Orders</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.averageTimeBetweenOrders} days
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <HiOutlineTag className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Savings</span>
              </div>
              <span className="font-medium text-green-600">{UserStatsCalculations.formatCurrency(stats.totalSavings)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <HiOutlineStar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Orders with Discounts</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{stats.discountOrders}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Two Column Layout: Wishlist Overview | Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wishlist Overview */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Wishlist Overview</h2>
            <Link 
              to="/user/wishlist"
              className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
            >
              View Wishlist
              <HiOutlineArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <HiOutlineHeart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.wishlistItems}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saved Items</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <HiOutlineCurrencyDollar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{UserStatsCalculations.formatCurrency(stats.wishlistValue)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
            </div>
          </div>
        </motion.div>

        {/* Account Information */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {UserStatsCalculations.formatDate(stats.memberSince)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Age</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.floor(stats.accountAge / 365)} years, {stats.accountAge % 365} days
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">This Month Orders</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.ordersThisMonth}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">This Month Spent</span>
              <span className="font-medium text-green-600">{UserStatsCalculations.formatCurrency(stats.spentThisMonth)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserStatsPage;