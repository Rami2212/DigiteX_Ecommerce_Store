import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiClock, FiArrowLeft, FiCreditCard, FiRefreshCw, FiInfo, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useOrder } from '../../../hooks/useOrder';
import { usePayment } from '../../../hooks/usePayment';

const OrderPendingPage = () => {
    const { orderId } = useParams(); // Get orderId from URL params
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { getOrderById, currentOrder, isLoading } = useOrder();
    const { confirmPayment } = usePayment();
    const [pollingCount, setPollingCount] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const maxPolls = 24; // Poll for 2 minutes (5 seconds × 24)

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
        
        // Check if we have payment_intent in URL (from Stripe redirect)
        const paymentIntent = searchParams.get('payment_intent');
        if (paymentIntent) {
            setPaymentIntentId(paymentIntent);
        }
    }, [orderId, searchParams]);

    // Auto-refresh to check for payment status updates
    useEffect(() => {
        if (currentOrder?.paymentMethod === 'stripe' && 
            currentOrder?.paymentStatus === 'Pending' && 
            pollingCount < maxPolls) {
            
            const timer = setTimeout(() => {
                // Try to confirm payment if we have paymentIntentId and payment is still pending
                if (paymentIntentId && pollingCount === 0) {
                    handlePaymentConfirmation();
                } else {
                    fetchOrderDetails();
                }
                setPollingCount(prev => prev + 1);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [currentOrder, pollingCount, maxPolls, paymentIntentId]);

    // Calculate time remaining for order reservation
    useEffect(() => {
        if (currentOrder?.createdAt) {
            const calculateTimeRemaining = () => {
                const orderTime = new Date(currentOrder.createdAt);
                const expiryTime = new Date(orderTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours
                const now = new Date();
                const timeDiff = expiryTime - now;

                if (timeDiff > 0) {
                    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeRemaining(`${hours}h ${minutes}m`);
                } else {
                    setTimeRemaining('Expired');
                }
            };

            calculateTimeRemaining();
            const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute
            return () => clearInterval(interval);
        }
    }, [currentOrder]);

    const handlePaymentConfirmation = async () => {
        if (!paymentIntentId) return;
        
        try {
            console.log('Attempting to confirm payment:', paymentIntentId);
            await confirmPayment(paymentIntentId);
            // Refresh order details after confirmation
            setTimeout(() => fetchOrderDetails(), 1000);
        } catch (error) {
            console.error('Payment confirmation failed:', error);
            // Continue polling anyway
            fetchOrderDetails();
        }
    };

    const fetchOrderDetails = async () => {
        if (!orderId) return;
        
        try {
            await getOrderById(orderId);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            // Don't show toast error on initial load, just log it
            if (pollingCount > 0) {
                console.log('Retrying order fetch failed, will try again...');
            }
        }
    };

    const handleCompletePayment = () => {
        // Navigate to checkout with retry parameter
        navigate(`/checkout?retry=${orderId}`);
    };

    const handleBackToCart = () => {
        // Navigate back to cart
        navigate('/cart');
    };

    const handleViewOrder = () => {
        // Navigate to order details
        navigate(`user/order/${orderId}`);
    };

    const handleRefresh = () => {
        setPollingCount(0);
        fetchOrderDetails();
    };

    const handleContinueShopping = () => {
        // Navigate to products
        navigate('/products');
    };

    // Handle case where orderId is not provided
    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Order ID Not Found
                    </h1>
                    <Button onClick={() => navigate('/user/orders')}>
                        View All Orders
                    </Button>
                </div>
            </div>
        );
    }

    // Show loading state while fetching order
    if (isLoading || !currentOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
                    <Button onClick={() => navigate('/user/orders')}>
                        View All Orders
                    </Button>
                </div>
            </div>
        );
    }

    // Redirect if payment is completed
    if (currentOrder?.paymentStatus === 'Paid') {
        navigate(`/order-success/${orderId}`);
        return null;
    }

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

    return (
        <motion.div
            className="py-12 bg-gray-50 dark:bg-gray-900 py-8 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<FiArrowLeft className="h-6 w-6" />}
                                onClick={handleBackToCart}
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <FiClock className="h-6 w-6 text-yellow-600" />
                                    Payment Pending
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Complete your payment to confirm the order
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiRefreshCw className="h-5 w-5" />}
                            onClick={handleRefresh}
                        >
                            Refresh
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Status Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                    <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Payment Required
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Your order is waiting for payment confirmation
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                        Order ID:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white font-mono">
                                        #{currentOrder._id?.slice(-8) || 'Loading...'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                        Amount Due:
                                    </span>
                                    <span className="text-lg font-bold text-primary">
                                        Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                        Payment Status:
                                    </span>
                                    <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                                        {currentOrder.paymentStatus || 'Unknown'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                        Order Status:
                                    </span>
                                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                                        {currentOrder.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Items */}
                        {currentOrder?.items && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FiPackage className="h-5 w-5 text-primary" />
                                    Order Items ({currentOrder.items.length})
                                </h3>
                                
                                <div className="space-y-3">
                                    {currentOrder.items.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                </h4>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Quantity: {item.quantity}
                                                    {item.selectedVariant?.color && (
                                                        <span className="ml-2">• Color: {item.selectedVariant.color}</span>
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

                                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Total Amount:
                                        </span>
                                        <span className="text-xl font-bold text-primary">
                                            Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Action Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    icon={<FiCreditCard className="w-4 h-4" />}
                                    onClick={handleCompletePayment}
                                >
                                    Complete Payment
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleViewOrder}
                                >
                                    View Order Details
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={handleContinueShopping}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </motion.div>

                        {/* Order Reservation Timer */}
                        {timeRemaining && (
                            <motion.div
                                variants={itemVariants}
                                className={`rounded-lg shadow-sm border p-6 ${
                                    timeRemaining === 'Expired'
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <FiAlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                                        timeRemaining === 'Expired'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-yellow-600 dark:text-yellow-400'
                                    }`} />
                                    <div>
                                        <h3 className={`text-sm font-medium mb-1 ${
                                            timeRemaining === 'Expired'
                                                ? 'text-red-900 dark:text-red-100'
                                                : 'text-yellow-900 dark:text-yellow-100'
                                        }`}>
                                            {timeRemaining === 'Expired' ? 'Reservation Expired' : 'Order Reservation'}
                                        </h3>
                                        {timeRemaining === 'Expired' ? (
                                            <p className="text-sm text-red-700 dark:text-red-300">
                                                This order has expired. Items may no longer be available.
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                                                    Your items are reserved for:
                                                </p>
                                                <div className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                                                    {timeRemaining}
                                                </div>
                                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                    Complete payment to secure your order
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Auto-refresh Status */}
                        {pollingCount < maxPolls && currentOrder?.paymentMethod === 'stripe' && currentOrder?.paymentStatus === 'Pending' && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4"
                            >
                                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                    <FiRefreshCw className="h-4 w-4 animate-spin" />
                                    <span>Auto-checking payment status... ({pollingCount + 1}/{maxPolls})</span>
                                </div>
                                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                                    We'll automatically update when payment is received
                                </p>
                            </motion.div>
                        )}

                        {/* Retry payment confirmation */}
                        {paymentIntentId && (
                            <motion.div
                                variants={itemVariants}
                                className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4"
                            >
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <FiInfo className="h-4 w-4" />
                                    <span>Payment intent detected</span>
                                </div>
                                <p className="text-xs text-green-500 dark:text-green-300 mt-1">
                                    Attempting to confirm your payment automatically...
                                </p>
                            </motion.div>
                        )}

                        {/* Help & Support */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Need Help?
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p>• Payment not processing? Try refreshing the page</p>
                                <p>• Having issues? Contact our support team</p>
                                <p>• Your order is safely reserved for 24 hours</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-4"
                                onClick={() => navigate('/support')}
                            >
                                Contact Support
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderPendingPage;