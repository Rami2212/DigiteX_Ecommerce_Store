import api from './client';

export const paymentAPI = {
  // Create payment intent for an order
  createPaymentIntent: async (orderId) => {
    const response = await api.post('/payments/create-intent', { orderId });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId) => {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data;
  },

  // Cancel payment
  cancelPayment: async (orderId) => {
    const response = await api.post('/payments/cancel', { orderId });
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus, paymentIntentId = null) => {
    const response = await api.post('/payments/update-status', {
      orderId,
      paymentStatus,
      paymentIntentId
    });
    return response.data;
  },

  // Get payment details
  getPaymentDetails: async (paymentIntentId) => {
    const response = await api.get(`/payments/details/${paymentIntentId}`);
    return response.data;
  },
};