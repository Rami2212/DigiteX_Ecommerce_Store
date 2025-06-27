import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchWishlistStart,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  addToWishlistStart,
  addToWishlistSuccess,
  addToWishlistFailure,
  removeFromWishlistStart,
  removeFromWishlistSuccess,
  removeFromWishlistFailure,
  clearWishlistStart,
  clearWishlistSuccess,
  clearWishlistFailure,
  moveToCartStart,
  moveToCartSuccess,
  moveToCartFailure,
  moveAllToCartStart,
  moveAllToCartSuccess,
  moveAllToCartFailure,
  updateItemCountSuccess,
  clearWishlistError,
} from '../redux/slices/wishlistSlice';
import { wishlistAPI } from '../lib/api/wishlist';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, itemCount, isLoading, error } = useSelector((state) => state.wishlist);

  // Memoize getWishlist to prevent infinite re-renders
  const getWishlist = useCallback(async () => {
    try {
      dispatch(fetchWishlistStart());
      const data = await wishlistAPI.getWishlist();
      
      // Ensure data has the correct structure
      const normalizedData = {
        items: data?.items || [],
        totalItems: data?.totalItems || 0,
        ...data
      };
      
      dispatch(fetchWishlistSuccess(normalizedData));
      return normalizedData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch wishlist';
      dispatch(fetchWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  }, [dispatch]);

  const addToWishlist = useCallback(async (wishlistData) => {
    try {
      dispatch(addToWishlistStart());
      const data = await wishlistAPI.addToWishlist(wishlistData);
      
      // Ensure the response has the correct structure
      const normalizedData = {
        items: data?.items || [],
        totalItems: data?.totalItems || 0,
        ...data
      };
      
      dispatch(addToWishlistSuccess(normalizedData));
      toast.success(data.message || 'Item added to wishlist successfully');
      return normalizedData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to wishlist';
      dispatch(addToWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  }, [dispatch]);

  const removeFromWishlist = useCallback(async (productId, variantColor = null) => {
    try {
      dispatch(removeFromWishlistStart());
      const data = await wishlistAPI.removeFromWishlist(productId, variantColor);
      
      // Ensure the response has the correct structure
      const normalizedData = {
        items: data?.items || [],
        totalItems: data?.totalItems || 0,
        ...data
      };
      
      dispatch(removeFromWishlistSuccess(normalizedData));
      toast.success(data.message || 'Item removed from wishlist successfully');
      return normalizedData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to remove item from wishlist';
      dispatch(removeFromWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  }, [dispatch]);

  const clearWishlist = useCallback(async () => {
    try {
      dispatch(clearWishlistStart());
      const data = await wishlistAPI.clearWishlist();
      
      // Ensure the response has the correct structure
      const normalizedData = {
        items: [],
        totalItems: 0,
        ...data
      };
      
      dispatch(clearWishlistSuccess(normalizedData));
      toast.success(data.message || 'Wishlist cleared successfully');
      return normalizedData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to clear wishlist';
      dispatch(clearWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  }, [dispatch]);

  const moveToCart = useCallback(async (productId, variantColor = null, quantity = 1) => {
    try {
      dispatch(moveToCartStart());
      const moveData = { productId, variantColor, quantity };
      const data = await wishlistAPI.moveToCart(moveData);
      
      // Ensure the response has the correct structure
      const normalizedData = {
        items: data?.items || [],
        totalItems: data?.totalItems || 0,
        ...data
      };
      
      dispatch(moveToCartSuccess(normalizedData));
      toast.success(data.message || 'Item moved to cart successfully');
      return normalizedData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to move item to cart';
      dispatch(moveToCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  }, [dispatch]);

  const moveAllToCart = useCallback(async () => {
    try {
      dispatch(moveAllToCartStart());
      const data = await wishlistAPI.moveAllToCart();
      
      // Ensure the response has the correct structure
      const normalizedData = {
        items: [],
        totalItems: 0,
        ...data
      };
      
      dispatch(moveAllToCartSuccess(normalizedData));
      toast.success(data.message || 'All items moved to cart successfully');
      return normalizedData;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to move items to cart';
      dispatch(moveAllToCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  }, [dispatch]);

  const updateItemCount = useCallback(async () => {
    try {
      const data = await wishlistAPI.getWishlistItemCount();
      dispatch(updateItemCountSuccess(data));
      return data;
    } catch (err) {
      console.error('Failed to update wishlist item count:', err);
      // Don't show toast for this as it's usually called in background
    }
  }, [dispatch]);

  const checkWishlistItem = useCallback(async (productId, variantColor = null) => {
    try {
      const data = await wishlistAPI.checkWishlistItem(productId, variantColor);
      return data.isInWishlist;
    } catch (err) {
      console.error('Failed to check wishlist item:', err);
      return false;
    }
  }, []);

  const getWishlistItem = useCallback((productId, variantColor = null) => {
    if (!wishlist?.items || !Array.isArray(wishlist.items)) return null;
    
    return wishlist.items.find(item => {
      // Add null checks for item and item.product
      if (!item || !item.product || !item.product._id) return false;
      
      const productMatch = item.product._id === productId;
      if (!variantColor) return productMatch;
      return productMatch && item.selectedVariant?.color === variantColor;
    });
  }, [wishlist]);

  // Enhanced isItemInWishlist function with better error handling
  const isItemInWishlist = useCallback((productId) => {
    if (!wishlist?.items || !Array.isArray(wishlist.items) || !productId) {
      return false;
    }
    
    try {
      // Only check for product ID match, with null safety
      const isInList = wishlist.items.some(item => {
        // Add comprehensive null checks
        if (!item || !item.product || !item.product._id) {
          console.warn('Wishlist item missing product data:', item);
          return false;
        }
        return item.product._id === productId;
      });
      
      return isInList;
    } catch (error) {
      console.error('Error checking wishlist item:', error);
      return false;
    }
  }, [wishlist]);

  const getWishlistItemByIndex = useCallback((index) => {
    if (!wishlist?.items || !Array.isArray(wishlist.items) || index < 0 || index >= wishlist.items.length) {
      return null;
    }
    
    const item = wishlist.items[index];
    
    // Validate item structure
    if (!item || !item.product || !item.product._id) {
      console.warn('Wishlist item at index', index, 'has invalid structure:', item);
      return null;
    }
    
    return item;
  }, [wishlist]);

  const getWishlistItemsCount = useCallback(() => {
    return wishlist?.totalItems || wishlist?.items?.length || 0;
  }, [wishlist]);

  const isWishlistEmpty = useCallback(() => {
    return !wishlist?.items || !Array.isArray(wishlist.items) || wishlist.items.length === 0;
  }, [wishlist]);

  const clearError = useCallback(() => {
    dispatch(clearWishlistError());
  }, [dispatch]);

  // Helper function to validate wishlist item structure
  const validateWishlistItem = useCallback((item) => {
    if (!item) return false;
    
    // Check if product exists and has required fields
    if (!item.product || !item.product._id || !item.product.name) {
      return false;
    }
    
    // Check if other required fields exist
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return false;
    }
    
    return true;
  }, []);

  // Enhanced function to get filtered valid wishlist items
  const getValidWishlistItems = useCallback(() => {
    if (!wishlist?.items || !Array.isArray(wishlist.items)) {
      return [];
    }
    
    return wishlist.items.filter(validateWishlistItem);
  }, [wishlist, validateWishlistItem]);

  return {
    wishlist,
    itemCount,
    isLoading,
    error,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    moveToCart,
    moveAllToCart,
    updateItemCount,
    checkWishlistItem,
    getWishlistItem,
    isItemInWishlist,
    getWishlistItemByIndex,
    getWishlistItemsCount,
    isWishlistEmpty,
    clearError,
    validateWishlistItem,
    getValidWishlistItems,
  };
};