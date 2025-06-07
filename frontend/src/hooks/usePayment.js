import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchPaymentStart,
  fetchPaymentSuccess,
  fetchPaymentFailure,
  createPaymentIntentStart,
  createPaymentIntentSuccess,
  createPaymentIntentFailure,
  confirmPaymentStart,
  confirmPaymentSuccess,
  confirmPaymentFailure,
  updatePaymentStatusStart,
  updatePaymentStatusSuccess,
  updatePaymentStatusFailure,
  cancelPaymentStart,
  cancelPaymentSuccess,
  cancelPaymentFailure,
  getPaymentDetailsSuccess,
  setPaymentStatus,
  clearCurrentPayment,
  clearPaymentError,
  clearPaymentStatus,
  clearPayments,
  resetPaymentState,
} from '../redux/slices/paymentSlice';
import { paymentAPI } from '../lib/api/payment';

export const usePayment = () => {
  const dispatch = useDispatch();
  const {
    payments,
    currentPayment,
    paymentIntent,
    clientSecret,
    isLoading,
    error,
    paymentStatus,
    lastPaymentError,
  } = useSelector((state) => state.payment);

  // Create payment intent
  const createPaymentIntent = async (orderId) => {
    try {
      dispatch(createPaymentIntentStart());
      const data = await paymentAPI.createPaymentIntent(orderId);
      dispatch(createPaymentIntentSuccess({
        paymentIntent: data.data.paymentIntentId,
        clientSecret: data.data.clientSecret
      }));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create payment intent';
      dispatch(createPaymentIntentFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Confirm payment
  const confirmPayment = async (paymentIntentId) => {
    try {
      dispatch(confirmPaymentStart());
      const data = await paymentAPI.confirmPayment(paymentIntentId);
      dispatch(confirmPaymentSuccess(data.data));
      toast.success('Payment confirmed successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to confirm payment';
      dispatch(confirmPaymentFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId, paymentStatus, paymentIntentId = null) => {
    try {
      dispatch(updatePaymentStatusStart());
      const data = await paymentAPI.updatePaymentStatus(orderId, paymentStatus, paymentIntentId);
      dispatch(updatePaymentStatusSuccess(data.data.order));
      toast.success('Payment status updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update payment status';
      dispatch(updatePaymentStatusFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Cancel payment
  const cancelPayment = async (orderId) => {
    try {
      dispatch(cancelPaymentStart());
      const data = await paymentAPI.cancelPayment(orderId);
      dispatch(cancelPaymentSuccess(data.data));
      toast.success('Payment cancelled successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to cancel payment';
      dispatch(cancelPaymentFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Get payment details
  const getPaymentDetails = async (paymentIntentId) => {
    try {
      dispatch(fetchPaymentStart());
      const data = await paymentAPI.getPaymentDetails(paymentIntentId);
      dispatch(getPaymentDetailsSuccess(data.data));
      dispatch(fetchPaymentSuccess());
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch payment details';
      dispatch(fetchPaymentFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Find payment by ID from current state
  const findPaymentById = useCallback((id) => {
    // Check in payments array
    const payment = payments.find((payment) => payment.id === id);
    if (payment) return payment;
    
    // Check current payment
    if (currentPayment && currentPayment.id === id) return currentPayment;
    
    return null;
  }, [payments, currentPayment]);

  // Utility functions for payment status management
  const setCurrentPaymentStatus = (status) => {
    dispatch(setPaymentStatus(status));
  };

  const resetPayment = () => {
    dispatch(resetPaymentState());
  };

  // Clear functions
  const clearError = () => {
    dispatch(clearPaymentError());
  };

  const clearCurrentPaymentState = () => {
    dispatch(clearCurrentPayment());
  };

  const clearPaymentStatusState = () => {
    dispatch(clearPaymentStatus());
  };

  const clearAllPayments = () => {
    dispatch(clearPayments());
  };

  // Payment status helpers
  const isPaymentProcessing = paymentStatus === 'processing';
  const isPaymentSucceeded = paymentStatus === 'succeeded';
  const isPaymentFailed = paymentStatus === 'failed';
  const isPaymentIdle = paymentStatus === 'idle' || paymentStatus === null;

  return {
    // State
    payments,
    currentPayment,
    paymentIntent,
    clientSecret,
    isLoading,
    error,
    paymentStatus,
    lastPaymentError,
    
    // Status helpers
    isPaymentProcessing,
    isPaymentSucceeded,
    isPaymentFailed,
    isPaymentIdle,
    
    // Actions
    createPaymentIntent,
    confirmPayment,
    updatePaymentStatus,
    cancelPayment,
    getPaymentDetails,
    findPaymentById,
    
    // Utility functions
    setCurrentPaymentStatus,
    resetPayment,
    
    // Clear functions
    clearError,
    clearCurrentPaymentState,
    clearPaymentStatusState,
    clearAllPayments,
  };
};