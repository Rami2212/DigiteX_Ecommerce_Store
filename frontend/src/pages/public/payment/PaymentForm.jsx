import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { FiCreditCard, FiArrowLeft, FiLock, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import { usePayment } from '../../../hooks/usePayment'; // Add this import

const PaymentForm = ({ order, onSuccess, onError, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { confirmPayment } = usePayment(); // Add this hook
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (event) => {
        // Prevent default form submission
        event.preventDefault();

        if (!stripe || !elements) {
            setMessage('Stripe not initialized');
            return;
        }

        setIsProcessing(true);
        setMessage(null);

        try {
            // Confirm the payment using stripe.confirmPayment
            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-success/${order._id}`,
                },
                redirect: 'if_required' // This prevents automatic redirect
            });

            if (result.error) {
                // Show error to customer
                setMessage(result.error.message);
                onError(result.error);
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                // Payment successful on Stripe side - now confirm with backend
                try {
                    setMessage('Payment successful! Confirming with server...');
                    
                    // Call your backend to confirm the payment
                    await confirmPayment(result.paymentIntent.id);
                    
                    // Payment fully confirmed
                    onSuccess(order._id);
                } catch (confirmError) {
                    console.error('Backend confirmation failed:', confirmError);
                    setMessage('Payment processed but confirmation failed. Please contact support.');
                    // Still call onSuccess since payment went through on Stripe
                    onSuccess(order._id);
                }
            } else {
                // Handle other statuses
                setMessage('Payment is being processed...');
            }
        } catch (error) {
            setMessage(error.message || 'An unexpected error occurred');
            onError(error);
        }

        setIsProcessing(false);
    };

    if (!stripe || !elements) {
        return (
            <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Loading Payment System
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we set up secure payment...
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FiCreditCard className="h-8 w-8 text-primary" />
                        Complete Payment
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={<FiArrowLeft className="h-5 w-5" />}
                        onClick={onCancel}
                    />
                </div>
                
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FiShield className="h-5 w-5 text-primary" />
                        Order Summary
                    </h3>
                    
                    {/* Order Details */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Order ID:</span>
                            <span className="text-sm font-mono text-gray-900 dark:text-white">
                                #{order._id?.slice(-8) || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                            <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                                {order.status || 'Pending'}
                            </span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                        {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                <div className="flex-1">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {item.name}
                                    </span>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Qty: {item.quantity}
                                        {item.selectedVariant?.color && (
                                            <span className="ml-2">• Color: {item.selectedVariant.color}</span>
                                        )}
                                    </div>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    Rs. {(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                            <div className="text-right">
                                <div className="text-xl font-bold text-primary">
                                    Rs. {order.totalAmount?.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    ≈ ${(order.totalAmount * 0.0034).toFixed(2)} USD
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <FiShield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Your payment is protected by 256-bit SSL encryption</span>
                </div>
            </div>

            {/* Fixed: Proper form element with onSubmit */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <PaymentElement 
                        options={{
                            layout: 'tabs'
                        }}
                        className="mb-4"
                    />
                </div>

                {message && (
                    <div className={`p-4 rounded-lg border ${
                        message.includes('processed') || message.includes('success')
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                        <p className={`text-sm ${
                            message.includes('processed') || message.includes('success')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                        }`}>
                            {message}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-4 text-lg"
                        icon={<FiLock className="h-5 w-5" />}
                        isLoading={isProcessing}
                        disabled={isProcessing || !stripe || !elements}
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing Payment...
                            </div>
                        ) : (
                            `Pay ${(order.totalAmount * 0.0034).toFixed(2)} USD Securely`
                        )}
                    </Button>
                    
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        Cancel Payment
                    </Button>
                </div>

                <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FiLock className="h-3 w-3" />
                        <span>Secured by Stripe</span>
                    </div>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                </div>
            </form>
        </motion.div>
    );
};

export default PaymentForm;