import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  currentPayment: null,
  paymentIntent: null,
  clientSecret: null,
  isLoading: false,
  error: null,
  // Payment status tracking
  paymentStatus: null, // 'idle', 'processing', 'succeeded', 'failed'
  lastPaymentError: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // General loading states
    fetchPaymentStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPaymentSuccess: (state) => {
      state.isLoading = false;
    },
    fetchPaymentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create payment intent
    createPaymentIntentStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.paymentStatus = 'processing';
    },
    createPaymentIntentSuccess: (state, action) => {
      state.isLoading = false;
      state.paymentIntent = action.payload.paymentIntent;
      state.clientSecret = action.payload.clientSecret;
      state.paymentStatus = 'idle';
    },
    createPaymentIntentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.paymentStatus = 'failed';
      state.lastPaymentError = action.payload;
    },

    // Payment confirmation
    confirmPaymentStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.paymentStatus = 'processing';
    },
    confirmPaymentSuccess: (state, action) => {
      state.isLoading = false;
      state.currentPayment = action.payload;
      state.paymentStatus = 'succeeded';
      // Add to payments history
      if (action.payload) {
        state.payments.unshift(action.payload);
      }
    },
    confirmPaymentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.paymentStatus = 'failed';
      state.lastPaymentError = action.payload;
    },

    // Update payment status
    updatePaymentStatusStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updatePaymentStatusSuccess: (state, action) => {
      state.isLoading = false;
      const updatedPayment = action.payload;
      
      // Update current payment
      if (state.currentPayment && state.currentPayment.id === updatedPayment.id) {
        state.currentPayment = updatedPayment;
      }
      
      // Update in payments array
      const paymentIndex = state.payments.findIndex(payment => payment.id === updatedPayment.id);
      if (paymentIndex !== -1) {
        state.payments[paymentIndex] = updatedPayment;
      }
      
      // Update payment status based on the payment status
      if (updatedPayment.status) {
        switch (updatedPayment.status.toLowerCase()) {
          case 'succeeded':
          case 'paid':
            state.paymentStatus = 'succeeded';
            break;
          case 'failed':
          case 'canceled':
            state.paymentStatus = 'failed';
            break;
          case 'processing':
            state.paymentStatus = 'processing';
            break;
          default:
            state.paymentStatus = 'idle';
        }
      }
    },
    updatePaymentStatusFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Cancel payment
    cancelPaymentStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    cancelPaymentSuccess: (state, action) => {
      state.isLoading = false;
      state.paymentStatus = 'failed';
      
      // Update current payment if it matches
      if (state.currentPayment && action.payload.paymentIntentId) {
        state.currentPayment = {
          ...state.currentPayment,
          status: 'canceled'
        };
      }
    },
    cancelPaymentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get payment details
    getPaymentDetailsSuccess: (state, action) => {
      state.isLoading = false;
      state.currentPayment = action.payload;
    },

    // Set payment status manually (for UI updates)
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },

    // Clear states
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
      state.paymentIntent = null;
      state.clientSecret = null;
    },
    clearPaymentError: (state) => {
      state.error = null;
      state.lastPaymentError = null;
    },
    clearPaymentStatus: (state) => {
      state.paymentStatus = null;
    },
    clearPayments: (state) => {
      state.payments = [];
      state.currentPayment = null;
      state.paymentIntent = null;
      state.clientSecret = null;
      state.paymentStatus = null;
      state.lastPaymentError = null;
    },

    // Reset payment state (useful when starting new payment)
    resetPaymentState: (state) => {
      state.currentPayment = null;
      state.paymentIntent = null;
      state.clientSecret = null;
      state.paymentStatus = 'idle';
      state.error = null;
      state.lastPaymentError = null;
      state.isLoading = false;
    },
  },
});

export const {
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
} = paymentSlice.actions;

export default paymentSlice.reducer;