import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartStart,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
  updateItemCountSuccess,
  clearCartError,
} from '../redux/slices/cartSlice';
import { cartAPI } from '../lib/api/cart';

export const useCart = () => {
  const dispatch = useDispatch();
  const { cart, itemCount, isLoading, error } = useSelector((state) => state.cart);

  const getCart = async () => {
    try {
      dispatch(fetchCartStart());
      const data = await cartAPI.getCart();
      dispatch(fetchCartSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch cart';
      dispatch(fetchCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const addToCart = async (cartData) => {
    try {
      dispatch(addToCartStart());
      const data = await cartAPI.addToCart(cartData);
      dispatch(addToCartSuccess(data));
      toast.success(data.message || 'Item added to cart successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to cart';
      dispatch(addToCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateCartItem = async (productId, updateData, variantColor = null) => {
    try {
      dispatch(updateCartItemStart());
      const data = await cartAPI.updateCartItem(productId, updateData, variantColor);
      dispatch(updateCartItemSuccess(data));
      toast.success(data.message || 'Cart item updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update cart item';
      dispatch(updateCartItemFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const removeFromCart = async (productId, variantColor = null) => {
    try {
      dispatch(removeFromCartStart());
      const data = await cartAPI.removeFromCart(productId, variantColor);
      dispatch(removeFromCartSuccess(data));
      toast.success(data.message || 'Item removed from cart successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to remove item from cart';
      dispatch(removeFromCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      dispatch(clearCartStart());
      const data = await cartAPI.clearCart();
      dispatch(clearCartSuccess(data));
      toast.success(data.message || 'Cart cleared successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to clear cart';
      dispatch(clearCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateItemCount = async () => {
    try {
      const data = await cartAPI.getCartItemCount();
      dispatch(updateItemCountSuccess(data));
      return data;
    } catch (err) {
      console.error('Failed to update item count:', err);
      // Don't show toast for this as it's usually called in background
    }
  };

  const getCartItem = useCallback((productId, variantColor = null) => {
    if (!cart?.items) return null;
    
    return cart.items.find(item => {
      const productMatch = item.product._id === productId;
      if (!variantColor) return productMatch;
      return productMatch && item.selectedVariant?.color === variantColor;
    });
  }, [cart]);

  const isItemInCart = useCallback((productId, variantColor = null) => {
    return getCartItem(productId, variantColor) !== null;
  }, [getCartItem]);

  const getItemQuantity = useCallback((productId, variantColor = null) => {
    const item = getCartItem(productId, variantColor);
    return item ? item.quantity : 0;
  }, [getCartItem]);

  const clearError = () => {
    dispatch(clearCartError());
  };

  return {
    cart,
    itemCount,
    isLoading,
    error,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    updateItemCount,
    getCartItem,
    isItemInCart,
    getItemQuantity,
    clearError,
  };
};