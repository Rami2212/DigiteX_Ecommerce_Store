import api from './client';

export const orderAPI = {
  // Create order from custom items
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Create order from cart
  createOrderFromCart: async (orderData) => {
    const response = await api.post('/orders/from-cart', orderData);
    return response.data;
  },

  // Get user's orders
  getUserOrders: async (page = 1, limit = 10) => {
    const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get specific order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel user's order
  cancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Admin routes
  getAllOrders: async (page = 1, limit = 10, status = null) => {
    let url = `/orders?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get order statistics (admin only)
  getOrderStats: async () => {
    const response = await api.get('/orders/admin/stats');
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Update payment status (admin only)
  updatePaymentStatus: async (orderId, paymentStatus) => {
    const response = await api.put(`/orders/${orderId}/payment`, { paymentStatus });
    return response.data;
  },

  // Update delivery status (admin only)
  updateDeliveryStatus: async (orderId, isDelivered) => {
    const response = await api.put(`/orders/${orderId}/delivery`, { isDelivered });
    return response.data;
  },

  // Admin cancel order
  adminCancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/admin-cancel`);
    return response.data;
  },

  // Delete order (admin only)
  deleteOrder: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};