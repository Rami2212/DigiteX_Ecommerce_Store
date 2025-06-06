import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  userOrders: [],
  currentOrder: null,
  orderStats: null,
  isLoading: false,
  error: null,
  // Pagination states
  totalPages: 1,
  currentPage: 1,
  totalOrders: 0,
  // User orders pagination
  userTotalPages: 1,
  userCurrentPage: 1,
  userTotalOrders: 0,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // General loading states
    fetchOrdersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalOrders = action.payload.totalOrders;
    },
    fetchOrdersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // User orders
    fetchUserOrdersSuccess: (state, action) => {
      state.isLoading = false;
      state.userOrders = action.payload.orders;
      state.userTotalPages = action.payload.totalPages;
      state.userCurrentPage = action.payload.currentPage;
      state.userTotalOrders = action.payload.totalOrders;
    },

    // Single order
    fetchOrderByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload;
    },

    // Create order
    createOrderSuccess: (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload.order;
      // Add to userOrders if it exists
      if (state.userOrders.length > 0) {
        state.userOrders.unshift(action.payload.order);
      }
    },

    // Update order status
    updateOrderStatusSuccess: (state, action) => {
      state.isLoading = false;
      const updatedOrder = action.payload.order;
      
      // Update in orders array
      const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = updatedOrder;
      }
      
      // Update in userOrders array
      const userOrderIndex = state.userOrders.findIndex(order => order._id === updatedOrder._id);
      if (userOrderIndex !== -1) {
        state.userOrders[userOrderIndex] = updatedOrder;
      }
      
      // Update current order if it matches
      if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
        state.currentOrder = updatedOrder;
      }
    },

    // Update payment status
    updatePaymentStatusSuccess: (state, action) => {
      state.isLoading = false;
      const updatedOrder = action.payload.order;
      
      // Update in orders array
      const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = updatedOrder;
      }
      
      // Update in userOrders array
      const userOrderIndex = state.userOrders.findIndex(order => order._id === updatedOrder._id);
      if (userOrderIndex !== -1) {
        state.userOrders[userOrderIndex] = updatedOrder;
      }
      
      // Update current order if it matches
      if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
        state.currentOrder = updatedOrder;
      }
    },

    // Update delivery status
    updateDeliveryStatusSuccess: (state, action) => {
      state.isLoading = false;
      const updatedOrder = action.payload.order;
      
      // Update in orders array
      const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = updatedOrder;
      }
      
      // Update in userOrders array
      const userOrderIndex = state.userOrders.findIndex(order => order._id === updatedOrder._id);
      if (userOrderIndex !== -1) {
        state.userOrders[userOrderIndex] = updatedOrder;
      }
      
      // Update current order if it matches
      if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
        state.currentOrder = updatedOrder;
      }
    },

    // Cancel order
    cancelOrderSuccess: (state, action) => {
      state.isLoading = false;
      const cancelledOrder = action.payload.order;
      
      // Update in orders array
      const orderIndex = state.orders.findIndex(order => order._id === cancelledOrder._id);
      if (orderIndex !== -1) {
        state.orders[orderIndex] = cancelledOrder;
      }
      
      // Update in userOrders array
      const userOrderIndex = state.userOrders.findIndex(order => order._id === cancelledOrder._id);
      if (userOrderIndex !== -1) {
        state.userOrders[userOrderIndex] = cancelledOrder;
      }
      
      // Update current order if it matches
      if (state.currentOrder && state.currentOrder._id === cancelledOrder._id) {
        state.currentOrder = cancelledOrder;
      }
    },

    // Delete order
    deleteOrderSuccess: (state, action) => {
      state.isLoading = false;
      const deletedOrderId = action.payload;
      
      // Remove from orders array
      state.orders = state.orders.filter(order => order._id !== deletedOrderId);
      
      // Remove from userOrders array
      state.userOrders = state.userOrders.filter(order => order._id !== deletedOrderId);
      
      // Clear current order if it matches
      if (state.currentOrder && state.currentOrder._id === deletedOrderId) {
        state.currentOrder = null;
      }
    },

    // Order stats
    fetchOrderStatsSuccess: (state, action) => {
      state.isLoading = false;
      state.orderStats = action.payload;
    },

    // Clear states
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.userOrders = [];
      state.currentOrder = null;
      state.orderStats = null;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchUserOrdersSuccess,
  fetchOrderByIdSuccess,
  createOrderSuccess,
  updateOrderStatusSuccess,
  updatePaymentStatusSuccess,
  updateDeliveryStatusSuccess,
  cancelOrderSuccess,
  deleteOrderSuccess,
  fetchOrderStatsSuccess,
  clearCurrentOrder,
  clearOrderError,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;