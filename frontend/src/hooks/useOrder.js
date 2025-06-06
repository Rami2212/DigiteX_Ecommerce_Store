import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
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
} from '../redux/slices/orderSlice';
import { orderAPI } from '../lib/api/order';

export const useOrder = () => {
  const dispatch = useDispatch();
  const {
    orders,
    userOrders,
    currentOrder,
    orderStats,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalOrders,
    userTotalPages,
    userCurrentPage,
    userTotalOrders,
  } = useSelector((state) => state.order);

  // Create order from custom items
  const createOrder = async (orderData) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.createOrder(orderData);
      dispatch(createOrderSuccess(data));
      toast.success(data.message || 'Order created successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create order';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Create order from cart
  const createOrderFromCart = async (orderData) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.createOrderFromCart(orderData);
      dispatch(createOrderSuccess(data));
      toast.success(data.message || 'Order created from cart successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create order from cart';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Get all orders (admin)
  const getAllOrders = async (page = 1, limit = 10, status = null) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.getAllOrders(page, limit, status);
      dispatch(fetchOrdersSuccess(data));
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch orders';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  // Get user's orders
  const getUserOrders = async (page = 1, limit = 10) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.getUserOrders(page, limit);
      dispatch(fetchUserOrdersSuccess(data));
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch your orders';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  // Get order by ID
  const getOrderById = async (orderId) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.getOrderById(orderId);
      dispatch(fetchOrderByIdSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch order details';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Find order by ID from current state
  const findOrderById = useCallback((id) => {
    // Check in all orders first
    let order = orders.find((order) => order._id === id);
    if (order) return order;
    
    // Check in user orders
    order = userOrders.find((order) => order._id === id);
    if (order) return order;
    
    // Check current order
    if (currentOrder && currentOrder._id === id) return currentOrder;
    
    return null;
  }, [orders, userOrders, currentOrder]);

  // Update order status (admin)
  const updateOrderStatus = async (orderId, status) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.updateOrderStatus(orderId, status);
      dispatch(updateOrderStatusSuccess(data));
      toast.success(data.message || 'Order status updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update order status';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Update payment status (admin)
  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.updatePaymentStatus(orderId, paymentStatus);
      dispatch(updatePaymentStatusSuccess(data));
      toast.success(data.message || 'Payment status updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update payment status';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Update delivery status (admin)
  const updateDeliveryStatus = async (orderId, isDelivered) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.updateDeliveryStatus(orderId, isDelivered);
      dispatch(updateDeliveryStatusSuccess(data));
      toast.success(data.message || 'Delivery status updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update delivery status';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Cancel order (user)
  const cancelOrder = async (orderId) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.cancelOrder(orderId);
      dispatch(cancelOrderSuccess(data));
      toast.success(data.message || 'Order cancelled successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to cancel order';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Admin cancel order
  const adminCancelOrder = async (orderId) => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.adminCancelOrder(orderId);
      dispatch(cancelOrderSuccess(data));
      toast.success(data.message || 'Order cancelled successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to cancel order';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Delete order (admin)
  const deleteOrder = async (orderId) => {
    try {
      dispatch(fetchOrdersStart());
      await orderAPI.deleteOrder(orderId);
      dispatch(deleteOrderSuccess(orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete order';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Get order statistics (admin)
  const getOrderStats = async () => {
    try {
      dispatch(fetchOrdersStart());
      const data = await orderAPI.getOrderStats();
      dispatch(fetchOrderStatsSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch order statistics';
      dispatch(fetchOrdersFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Clear functions
  const clearError = () => {
    dispatch(clearOrderError());
  };

  const clearCurrentOrderState = () => {
    dispatch(clearCurrentOrder());
  };

  const clearAllOrders = () => {
    dispatch(clearOrders());
  };

  return {
    // State
    orders,
    userOrders,
    currentOrder,
    orderStats,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalOrders,
    userTotalPages,
    userCurrentPage,
    userTotalOrders,
    
    // Actions
    createOrder,
    createOrderFromCart,
    getAllOrders,
    getUserOrders,
    getOrderById,
    findOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    updateDeliveryStatus,
    cancelOrder,
    adminCancelOrder,
    deleteOrder,
    getOrderStats,
    
    // Clear functions
    clearError,
    clearCurrentOrderState,
    clearAllOrders,
  };
};