import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiEye, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiX,
  FiRefreshCw,
  FiShoppingBag
  } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { useOrder } from '../../../hooks/useOrder';
import { useAuth } from '../../../hooks/useAuth';

const MyOrders = () => {
  const { 
    userOrders, 
    isLoading, 
    userTotalPages, 
    userCurrentPage, 
    userTotalOrders,
    getUserOrders 
  } = useOrder();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentPageState, setCurrentPageState] = useState(1);
  const [limit] = useState(8);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, currentPageState]);

  const fetchOrders = () => {
    getUserOrders(currentPageState, limit);
  };

  const handlePageChange = (page) => {
    setCurrentPageState(page);
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="h-5 w-5 text-green-600" />;
      case 'Shipped':
        return <FiTruck className="h-5 w-5 text-blue-600" />;
      case 'Processing':
        return <FiPackage className="h-5 w-5 text-purple-600" />;
      case 'Cancelled':
        return <FiX className="h-5 w-5 text-red-600" />;
      default:
        return <FiClock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const renderOrderStatus = (status) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Processing': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Failed': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };

    const className = statusConfig[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
        {getStatusIcon(status)}
        {status || 'Unknown'}
      </span>
    );
  };

  const renderPaymentStatus = (paymentStatus) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Refunded': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };

    const className = statusConfig[paymentStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
        {paymentStatus || 'Unknown'}
      </span>
    );
  };

  const OrderCard = ({ order }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order #{order._id?.slice(-8) || 'N/A'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">
            Rs. {order.totalAmount?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {order.items?.length || 0} item(s)
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Order Status:</span>
          {renderOrderStatus(order.status)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment:</span>
          {renderPaymentStatus(order.paymentStatus)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method:</span>
          <span className="text-sm text-gray-900 dark:text-white capitalize">
            {order.paymentMethod === 'stripe' ? 'Card' : order.paymentMethod || 'N/A'}
          </span>
        </div>
      </div>

      {/* Order Items Preview */}
      {order.items && order.items.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Items:</h4>
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                {item.name} × {item.quantity}
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                +{order.items.length - 2} more items
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {order.paymentStatus === 'Failed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/retry-payment/${order._id}`)}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              Retry Payment
            </Button>
          )}
          {order.paymentStatus === 'Pending' && order.paymentMethod === 'stripe' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/order-pending/${order._id}`)}
              className="text-yellow-600 hover:text-yellow-600 dark:hover:text-yellow-900 border-yellow-300 hover:bg-yellow-50"
            >
              Complete Payment
            </Button>
          )}
        </div>
        <Link to={`/user/order/${order._id}`}>
          <Button
            size="sm"
            variant="outline"
            icon={<FiEye className="h-4 w-4" />}
          >
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );

  const renderPagination = () => {
    if (userTotalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= userTotalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === userCurrentPage
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-1 mt-8">
        <button
          onClick={() => handlePageChange(userCurrentPage - 1)}
          disabled={userCurrentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(userCurrentPage + 1)}
          disabled={userCurrentPage === userTotalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
              <FiShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {userTotalOrders > 0 
                  ? `${userTotalOrders} order${userTotalOrders !== 1 ? 's' : ''} found`
                  : 'No orders yet'
                }
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            icon={<FiRefreshCw className="h-4 w-4" />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Orders Grid */}
      {isLoading ? (
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </motion.div>
      ) : userOrders && userOrders.length > 0 ? (
        <>
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {userOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </motion.div>
          {renderPagination()}
        </>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center"
        >
          <FiPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start shopping to see your orders here.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyOrders;