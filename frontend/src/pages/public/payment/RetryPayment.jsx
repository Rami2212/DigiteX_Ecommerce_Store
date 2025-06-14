import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FiCreditCard, FiArrowLeft, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import PaymentForm from './PaymentForm';
import { useOrder } from '../../../hooks/useOrder';
import { usePayment } from '../../../hooks/usePayment';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const RetryPaymentPage = () => {
    const { orderId } = useParams(); // Get orderId from URL params
    const navigate = useNavigate();
    const { getOrderById, currentOrder, isLoading } = useOrder();
    const { createPaymentIntent } = usePayment();
    const [clientSecret, setClientSecret] = useState(null);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [error, setError] = useState(null);
    const [isCreatingPayment, setIsCreatingPayment] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderAndCreatePaymentIntent();
        }
    }, [orderId]);

    const fetchOrderAndCreatePaymentIntent = async () => {
        if (!orderId) return;
        
        setIsCreatingPayment(true);
        setError(null);
        
        try {
            // First get the order details
            await getOrderById(orderId);
            
            // Create new payment intent for retry
            const paymentResult = await createPaymentIntent(orderId);
            setClientSecret(paymentResult.data.clientSecret);
            setShowPaymentForm(true);
        } catch (error) {
            console.error('Failed to create payment intent:', error);
            setError(error.message || 'Failed to initialize payment');
        } finally {
            setIsCreatingPayment(false);
        }
    };

    const handlePaymentSuccess = (orderId) => {
        navigate(`/order-success/${orderId}`);
    };

    const handlePaymentError = (error) => {
        console.error('Payment retry failed:', error);
        navigate(`/payment-failed/${orderId}`);
    };

    const handleCancel = () => {
        navigate(`/order-pending/${orderId}`);
    };

    const handleBackToOrder = () => {
        navigate(`/orders/${orderId}`);
    };

    const handleBackToOrders = () => {
        navigate('/orders');
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

    // Show loading state while fetching order or creating payment
    if (isLoading || isCreatingPayment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isLoading ? 'Loading order details...' : 'Preparing payment...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCreditCard className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Payment Setup Failed
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {error}
                        </p>
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                className="w-full"
                                icon={<FiRefreshCw className="w-4 h-4" />}
                                onClick={fetchOrderAndCreatePaymentIntent}
                                disabled={isCreatingPayment}
                                isLoading={isCreatingPayment}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                icon={<FiArrowLeft className="w-4 h-4" />}
                                onClick={handleBackToOrder}
                            >
                                Back to Order
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (!currentOrder) {
        return (
            <motion.div
                className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Order Not Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The order you're trying to pay for could not be found or you don't have permission to access it.
                        </p>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={handleBackToOrders}
                        >
                            View All Orders
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Handle case where order data is incomplete
    if (!currentOrder._id) {
        return (
            <div className="py-12 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Invalid Order Data
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The order data is incomplete or corrupted.
                    </p>
                    <Button onClick={handleBackToOrders}>
                        View All Orders
                    </Button>
                </div>
            </div>
        );
    }

    // Check if order is already paid
    if (currentOrder.paymentStatus === 'Paid') {
        return (
            <motion.div
                className="py-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Already Paid
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            This order has already been paid for successfully.
                        </p>
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => navigate(`/order-success/${orderId}`)}
                            >
                                View Order Confirmation
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate(`user/order/${orderId}`)}
                            >
                                View Order Details
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Check if order payment method is not stripe
    if (currentOrder.paymentMethod !== 'stripe') {
        return (
            <motion.div
                className="py-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Cash on Delivery Order
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            This order is set for Cash on Delivery. No online payment is required.
                        </p>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => navigate(`user/order/${orderId}`)}
                        >
                            View Order Details
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiArrowLeft className="h-6 w-6" />}
                            onClick={handleCancel}
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <FiCreditCard className="h-6 w-6 text-primary" />
                                Retry Payment
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Complete payment for order #{currentOrder._id?.slice(-8) || 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Order Summary
                </h3>
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
                            Total Amount:
                        </span>
                        <span className="text-lg font-bold text-primary">
                            Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                            Items:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                            {currentOrder.items?.length || 0} item(s)
                        </span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                            Status:
                        </span>
                        <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                            {currentOrder.paymentStatus || 'Pending'}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Payment Form */}
            {showPaymentForm && clientSecret ? (
                <Elements 
                    stripe={stripePromise} 
                    options={{ 
                        clientSecret,
                        appearance: {
                            theme: 'stripe',
                            variables: {
                                colorPrimary: '#0570de',
                            }
                        }
                    }}
                >
                    <PaymentForm
                        order={currentOrder}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onCancel={handleCancel}
                    />
                </Elements>
            ) : (
                <motion.div
                    className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Preparing Payment
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Setting up secure payment for your order...
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default RetryPaymentPage;