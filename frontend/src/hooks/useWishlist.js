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

  const getWishlist = async () => {
    try {
      dispatch(fetchWishlistStart());
      const data = await wishlistAPI.getWishlist();
      dispatch(fetchWishlistSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch wishlist';
      dispatch(fetchWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const addToWishlist = async (wishlistData) => {
    try {
      dispatch(addToWishlistStart());
      const data = await wishlistAPI.addToWishlist(wishlistData);
      dispatch(addToWishlistSuccess(data));
      toast.success(data.message || 'Item added to wishlist successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to wishlist';
      dispatch(addToWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const removeFromWishlist = async (productId, variantColor = null) => {
    try {
      dispatch(removeFromWishlistStart());
      const data = await wishlistAPI.removeFromWishlist(productId, variantColor);
      dispatch(removeFromWishlistSuccess(data));
      toast.success(data.message || 'Item removed from wishlist successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to remove item from wishlist';
      dispatch(removeFromWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const clearWishlist = async () => {
    try {
      dispatch(clearWishlistStart());
      const data = await wishlistAPI.clearWishlist();
      dispatch(clearWishlistSuccess(data));
      toast.success(data.message || 'Wishlist cleared successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to clear wishlist';
      dispatch(clearWishlistFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const moveToCart = async (productId, variantColor = null, quantity = 1) => {
    try {
      dispatch(moveToCartStart());
      const moveData = { productId, variantColor, quantity };
      const data = await wishlistAPI.moveToCart(moveData);
      dispatch(moveToCartSuccess(data));
      toast.success(data.message || 'Item moved to cart successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to move item to cart';
      dispatch(moveToCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const moveAllToCart = async () => {
    try {
      dispatch(moveAllToCartStart());
      const data = await wishlistAPI.moveAllToCart();
      dispatch(moveAllToCartSuccess(data));
      toast.success(data.message || 'All items moved to cart successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to move items to cart';
      dispatch(moveAllToCartFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateItemCount = async () => {
    try {
      const data = await wishlistAPI.getWishlistItemCount();
      dispatch(updateItemCountSuccess(data));
      return data;
    } catch (err) {
      console.error('Failed to update wishlist item count:', err);
      // Don't show toast for this as it's usually called in background
    }
  };

  const checkWishlistItem = async (productId, variantColor = null) => {
    try {
      const data = await wishlistAPI.checkWishlistItem(productId, variantColor);
      return data.isInWishlist;
    } catch (err) {
      console.error('Failed to check wishlist item:', err);
      return false;
    }
  };

  const getWishlistItem = useCallback((productId, variantColor = null) => {
    if (!wishlist?.items) return null;
    
    return wishlist.items.find(item => {
      const productMatch = item.product._id === productId;
      if (!variantColor) return productMatch;
      return productMatch && item.selectedVariant?.color === variantColor;
    });
  }, [wishlist]);

  const isItemInWishlist = useCallback((productId, variantColor = null) => {
    return getWishlistItem(productId, variantColor) !== null;
  }, [getWishlistItem]);

  const getWishlistItemByIndex = useCallback((index) => {
    if (!wishlist?.items || index < 0 || index >= wishlist.items.length) return null;
    return wishlist.items[index];
  }, [wishlist]);

  const getWishlistItemsCount = useCallback(() => {
    return wishlist?.totalItems || 0;
  }, [wishlist]);

  const isWishlistEmpty = useCallback(() => {
    return !wishlist?.items || wishlist.items.length === 0;
  }, [wishlist]);

  const clearError = () => {
    dispatch(clearWishlistError());
  };

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
  };
};