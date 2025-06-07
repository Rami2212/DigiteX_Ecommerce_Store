import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiMapPin, 
  FiCreditCard, 
  FiCalendar,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
  FiDownload,
  FiMessageCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useOrder } from '../../../hooks/useOrder';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';

const Order = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, isLoading, getOrderById, cancelOrder } = useOrder();
  const { user, isAuthenticated } = useAuth();
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated]);

  const fetchOrderDetails = async () => {
    try {
      await getOrderById(orderId);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    }
  };

  const handleBack = () => {
    navigate('/user/orders');
  };

  const handleCancelOrder = async () => {
    if (!currentOrder?._id) return;
    
    setIsCancelling(true);
    try {
      await cancelOrder(currentOrder._id);
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRetryPayment = () => {
    navigate(`/retry-payment/${orderId}`);
  };

  const handleCompletePayment = () => {
    navigate(`/order-pending/${orderId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="h-6 w-6 text-green-600" />;
      case 'Shipped':
        return <FiTruck className="h-6 w-6 text-blue-600" />;
      case 'Processing':
        return <FiPackage className="h-6 w-6 text-purple-600" />;
      case 'Cancelled':
        return <FiX className="h-6 w-6 text-red-600" />;
      default:
        return <FiClock className="h-6 w-6 text-yellow-600" />;
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
      <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full ${className}`}>
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
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
        {paymentStatus || 'Unknown'}
      </span>
    );
  };

  const canCancelOrder = () => {
    return currentOrder && 
           !['Shipped', 'Delivered', 'Cancelled'].includes(currentOrder.status) &&
           currentOrder.paymentStatus !== 'Paid';
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

  // Handle case where orderId is not provided
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order ID Not Found
          </h1>
          <Button onClick={handleBack}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Handle case where order data is incomplete
  if (!currentOrder._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={handleBack}>
            Back to Orders
          </Button>
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
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<FiArrowLeft className="h-5 w-5" />}
              onClick={handleBack}
            >
              Back to Orders
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order #{currentOrder._id?.slice(-8)}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ordered on {new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon={<FiRefreshCw className="h-4 w-4" />}
              onClick={fetchOrderDetails}
            >
              Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Order Status Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Status</h2>
          {renderOrderStatus(currentOrder.status)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-2 rounded-lg bg-white dark:bg-gray-600 mr-4">
              <FiCreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Status</p>
              <div className="mt-1">{renderPaymentStatus(currentOrder.paymentStatus)}</div>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-2 rounded-lg bg-white dark:bg-gray-600 mr-4">
              <FiTruck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipping Method</p>
              <p className="text-gray-900 dark:text-white font-medium capitalize">
                {currentOrder.shippingMethod || 'Standard'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="p-2 rounded-lg bg-white dark:bg-gray-600 mr-4">
              <FiPackage className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
              <p className="text-gray-900 dark:text-white font-bold text-lg">
                Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {currentOrder.paymentStatus === 'Failed' && (
            <Button
              variant="primary"
              icon={<FiCreditCard className="h-4 w-4" />}
              onClick={handleRetryPayment}
            >
              Retry Payment
            </Button>
          )}
          
          {currentOrder.paymentStatus === 'Pending' && currentOrder.paymentMethod === 'stripe' && (
            <Button
              variant="primary"
              icon={<FiClock className="h-4 w-4" />}
              onClick={handleCompletePayment}
            >
              Complete Payment
            </Button>
          )}
          
          {canCancelOrder() && (
            <Button
              variant="outline"
              icon={<FiX className="h-4 w-4" />}
              onClick={handleCancelOrder}
              disabled={isCancelling}
              isLoading={isCancelling}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Cancel Order
            </Button>
          )}
          
          <Button
            variant="outline"
            icon={<FiMessageCircle className="h-4 w-4" />}
            onClick={() => navigate('/support')}
          >
            Contact Support
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiPackage className="h-5 w-5" />
              Order Items ({currentOrder.items?.length || 0})
            </h2>
            
            <div className="space-y-4">
              {currentOrder.items?.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>Quantity: {item.quantity}</span>
                      {item.selectedVariant?.color && (
                        <span className="ml-4">Color: {item.selectedVariant.color}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rs. {item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiMapPin className="h-5 w-5" />
              Delivery Address
            </h2>
            
            {currentOrder.shippingAddress ? (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white text-base">
                    {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
                  </p>
                  <p>{currentOrder.shippingAddress.addressLine1}</p>
                  {currentOrder.shippingAddress.addressLine2 && (
                    <p>{currentOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}
                  </p>
                  <p>{currentOrder.shippingAddress.country}</p>
                  <p className="pt-2 border-t border-gray-200 dark:border-gray-600 mt-3">
                    <span className="font-medium">Phone:</span> {currentOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No shipping address provided</p>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Timeline */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiCalendar className="h-5 w-5" />
              Order Timeline
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {currentOrder.paidAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Confirmed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(currentOrder.paidAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              {currentOrder.status === 'Processing' && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Processing</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Being prepared for shipment</p>
                  </div>
                </div>
              )}
              
              {currentOrder.status === 'Shipped' && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Shipped</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">On the way to you</p>
                  </div>
                </div>
              )}
              
              {currentOrder.deliveredAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Delivered</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(currentOrder.deliveredAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              {currentOrder.status === 'Cancelled' && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Cancelled</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(currentOrder.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiCreditCard className="h-5 w-5" />
              Payment Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {currentOrder.paymentMethod === 'stripe' ? 'Credit/Debit Card' : currentOrder.paymentMethod || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
                {renderPaymentStatus(currentOrder.paymentStatus)}
              </div>
              
              {currentOrder.paymentIntentId && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">Transaction ID</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                    {currentOrder.paymentIntentId.slice(-12)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Need Help */}
          <motion.div
            variants={itemVariants}
            className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              Have questions about your order? Our support team is here to help.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/support')}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30"
            >
              Contact Support
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Order;