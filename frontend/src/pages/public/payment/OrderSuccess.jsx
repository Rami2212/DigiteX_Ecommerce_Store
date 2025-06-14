import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiPackage, FiClock, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useOrder } from '../../../hooks/useOrder';
import { usePayment } from '../../../hooks/usePayment'; // Add this import

const OrderSuccessPage = () => {
    const { orderId } = useParams(); // Get orderId from URL params
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Add this to get query params
    const { getOrderById, currentOrder, isLoading } = useOrder();
    const { confirmPayment } = usePayment(); // Add this hook
    const [pollingCount, setPollingCount] = useState(0);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const maxPolls = 12; // Poll for 1 minute (5 seconds × 12)

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

    // Poll for order status updates (for webhook delays)
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

    const handleViewOrder = () => {
        // Use navigate instead of window.location.href
        navigate(`/user/order/${orderId}`);
    };

    const handleContinueShopping = () => {
        // Use navigate instead of window.location.href
        navigate('/products');
    };

    const getStatusInfo = () => {
        if (!currentOrder) return { icon: FiClock, color: 'gray', message: 'Loading...' };

        if (currentOrder.paymentMethod === 'COD') {
            return {
                icon: FiCheckCircle,
                color: 'green',
                message: 'Order placed successfully! Pay when you receive your order.'
            };
        }

        switch (currentOrder.paymentStatus) {
            case 'Paid':
                return {
                    icon: FiCheckCircle,
                    color: 'green',
                    message: 'Payment successful! Your order is confirmed.'
                };
            case 'Processing':
                return {
                    icon: FiRefreshCw,
                    color: 'blue',
                    message: 'Payment is being processed. Please wait...'
                };
            case 'Pending':
                return {
                    icon: FiClock,
                    color: 'yellow',
                    message: 'Waiting for payment confirmation...'
                };
            case 'Failed':
                return {
                    icon: FiClock,
                    color: 'red',
                    message: 'Payment failed. Please try again.'
                };
            default:
                return {
                    icon: FiClock,
                    color: 'gray',
                    message: 'Processing your order...'
                };
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
                    <Button onClick={() => navigate('user/orders')}>
                        View All Orders
                    </Button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    return (
        <motion.div
            className="flex items-center py-12 justify-center bg-gray-50 dark:bg-gray-900 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-2xl w-full">
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    <motion.div
                        className={`w-20 h-20 bg-${statusInfo.color}-100 dark:bg-${statusInfo.color}-900 rounded-full flex items-center justify-center mx-auto mb-6`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                        <StatusIcon className={`w-10 h-10 text-${statusInfo.color}-600 dark:text-${statusInfo.color}-400 ${statusInfo.icon === FiRefreshCw ? 'animate-spin' : ''}`} />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        {currentOrder?.paymentStatus === 'Paid' || currentOrder?.paymentMethod === 'COD' 
                            ? 'Order Confirmed!' 
                            : 'Order Placed!'
                        }
                    </h1>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {statusInfo.message}
                    </p>

                    {currentOrder && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-left">
                            <div className="grid grid-cols-2 gap-4">
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
                                        Total:
                                    </span>
                                    <span className="text-sm font-bold text-primary">
                                        Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                        Payment:
                                    </span>
                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                        currentOrder.paymentStatus === 'Paid' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : currentOrder.paymentStatus === 'Processing'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}>
                                        {currentOrder.paymentStatus || 'Unknown'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                        Status:
                                    </span>
                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                        currentOrder.status === 'Confirmed' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : currentOrder.status === 'Processing'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}>
                                        {currentOrder.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Items Preview */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                    Items ({currentOrder.items?.length}):
                                </span>
                                <div className="space-y-1">
                                    {currentOrder.items?.slice(0, 3).map((item, index) => (
                                        <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.name} × {item.quantity}
                                        </div>
                                    ))}
                                    {currentOrder.items?.length > 3 && (
                                        <div className="text-sm text-gray-500 dark:text-gray-500">
                                            +{currentOrder.items.length - 3} more items
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            variant="primary"
                            className="w-full"
                            icon={<FiPackage className="w-4 h-4" />}
                            onClick={handleViewOrder}
                        >
                            View Order Details
                        </Button>
                        
                        <Button
                            variant="outline"
                            className="w-full"
                            icon={<FiArrowRight className="w-4 h-4" />}
                            onClick={handleContinueShopping}
                        >
                            Continue Shopping
                        </Button>
                    </div>

                    {/* Auto-refresh notice for pending payments */}
                    {currentOrder?.paymentMethod === 'stripe' && 
                     currentOrder?.paymentStatus === 'Pending' && 
                     pollingCount < maxPolls && (
                        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                <FiRefreshCw className="h-4 w-4 animate-spin" />
                                <span>Checking payment status... ({pollingCount + 1}/{maxPolls})</span>
                            </div>
                        </div>
                    )}

                    {/* Show retry payment option if payment failed */}
                    {currentOrder?.paymentMethod === 'stripe' && 
                     currentOrder?.paymentStatus === 'Failed' && (
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => navigate(`/checkout?retry=${orderId}`)}
                            >
                                Retry Payment
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default OrderSuccessPage;