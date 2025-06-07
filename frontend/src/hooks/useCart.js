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
      
      // If no variantColor is specified, match the exact variant (or lack thereof)
      if (!variantColor) {
        // Only match if the cart item also has no variant color
        return productMatch && (!item.selectedVariant?.color);
      }
      
      // If variantColor is specified, match both product and variant
      return productMatch && item.selectedVariant?.color === variantColor;
    });
  }, [cart]);

  const isItemInCart = useCallback((productId, variantColor = null) => {
    if (!cart?.items) return false;
    
    // For products with variants, we need to check the specific variant
    return cart.items.some(item => {
      const productMatch = item.product._id === productId;
      
      // If checking for a specific variant
      if (variantColor) {
        return productMatch && item.selectedVariant?.color === variantColor;
      }
      
      // If no variant specified, check if this exact combination exists
      // (product with no variant selected)
      return productMatch && (!item.selectedVariant?.color);
    });
  }, [cart]);

  const getItemQuantity = useCallback((productId, variantColor = null) => {
    const item = getCartItem(productId, variantColor);
    return item ? item.quantity : 0;
  }, [getCartItem]);

  // Helper function to check if ANY variant of a product is in cart
  const isProductInCart = useCallback((productId) => {
    if (!cart?.items) return false;
    
    return cart.items.some(item => item.product._id === productId);
  }, [cart]);

  // Helper function to get total quantity of all variants of a product
  const getProductTotalQuantity = useCallback((productId) => {
    if (!cart?.items) return 0;
    
    return cart.items
      .filter(item => item.product._id === productId)
      .reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

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
    isProductInCart,
    getProductTotalQuantity,
    clearError,
  };
};