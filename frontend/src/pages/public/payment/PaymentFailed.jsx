import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiXCircle, FiArrowLeft, FiRefreshCw, FiCreditCard, FiAlertTriangle, FiHelpCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useOrder } from '../../../hooks/useOrder';

const PaymentFailedPage = () => {
    const { orderId } = useParams(); // Get orderId from URL params
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { getOrderById, currentOrder, isLoading } = useOrder();
    const [failureReason, setFailureReason] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
        
        // Check for error details in URL params
        const errorMessage = searchParams.get('error');
        const errorType = searchParams.get('error_type');
        if (errorMessage) {
            setFailureReason({ message: errorMessage, type: errorType });
        }
    }, [orderId, searchParams]);

    const fetchOrderDetails = async () => {
        if (!orderId) return;
        
        try {
            await getOrderById(orderId);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        }
    };

    const handleRetryPayment = () => {
        // Navigate back to retry payment page
        navigate(`/retry-payment/${orderId}`);
    };

    const handleBackToCheckout = () => {
        // Navigate back to checkout
        navigate('/checkout');
    };

    const handleViewOrder = () => {
        // Navigate to order details
        navigate(`/user/order/${orderId}`);
    };

    const handleBackToOrders = () => {
        // Navigate to orders list
        navigate('/user/orders');
    };

    const handleContactSupport = () => {
        // Navigate to support page
        navigate('/support');
    };

    const getFailureMessage = () => {
        if (failureReason?.message) {
            return failureReason.message;
        }
        
        // Default message based on order status
        if (currentOrder?.paymentStatus === 'Failed') {
            return "Unfortunately, your payment could not be processed. Your order is still reserved and you can try again.";
        }
        
        return "There was an issue processing your payment. Please try again or contact support if the problem persists.";
    };

    const getCommonFailureReasons = () => {
        const reasons = [
            "Insufficient funds in your account",
            "Incorrect card details entered",
            "Card expired or has been blocked",
            "Network connectivity issues",
            "Bank declined the transaction",
            "Card not enabled for online payments"
        ];
        
        return reasons;
    };

    // Handle case where orderId is not provided
    if (!orderId) {
        return (
            <div className="py-12 flex items-center justify-center">
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
            <div className="py-12 flex items-center justify-center">
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
            <div className="py-12 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Order Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The order you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <Button onClick={handleBackToOrders}>
                        View All Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="py-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
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
                        className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                        <FiXCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Payment Failed
                    </h1>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {getFailureMessage()}
                    </p>

                    {/* Error Details */}
                    {failureReason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <div className="text-left">
                                    <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                                        Error Details
                                    </h3>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {failureReason.message}
                                    </p>
                                    {failureReason.type && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                            Error Type: {failureReason.type}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
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
                                    Amount:
                                </span>
                                <span className="text-sm font-bold text-primary">
                                    Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                    Payment Status:
                                </span>
                                <span className="text-sm px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                                    {currentOrder.paymentStatus || 'Failed'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                    Order Status:
                                </span>
                                <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                                    {currentOrder.status || 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Order Items Preview */}
                        {currentOrder.items && currentOrder.items.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                    Items ({currentOrder.items.length}):
                                </span>
                                <div className="space-y-1">
                                    {currentOrder.items.slice(0, 3).map((item, index) => (
                                        <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.name} × {item.quantity}
                                        </div>
                                    ))}
                                    {currentOrder.items.length > 3 && (
                                        <div className="text-sm text-gray-500 dark:text-gray-500">
                                            +{currentOrder.items.length - 3} more items
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Common Payment Failure Reasons */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                                Common reasons for payment failure:
                            </span>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {getCommonFailureReasons().slice(0, 4).map((reason, index) => (
                                    <li key={index}>• {reason}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            variant="primary"
                            className="w-full"
                            icon={<FiCreditCard className="w-4 h-4" />}
                            onClick={handleRetryPayment}
                        >
                            Retry Payment
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={handleViewOrder}
                            >
                                View Order
                            </Button>
                            
                            <Button
                                variant="outline"
                                onClick={handleBackToCheckout}
                            >
                                New Order
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            className="w-full"
                            icon={<FiArrowLeft className="w-4 h-4" />}
                            onClick={handleBackToOrders}
                        >
                            Back to Orders
                        </Button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <FiHelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Need Help?
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                    If you continue to experience issues, our support team is here to help. 
                                    Your order will be held for 24 hours.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleContactSupport}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30"
                                >
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Order Expiry Notice */}
                    {currentOrder.createdAt && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                <strong>Order Reservation:</strong> Your items are reserved until{' '}
                                {new Date(new Date(currentOrder.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PaymentFailedPage;