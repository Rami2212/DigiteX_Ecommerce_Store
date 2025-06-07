import api from './client';

export const wishlistAPI = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (wishlistData) => {
    const response = await api.post('/wishlist/add', wishlistData);
    return response.data;
  },

  removeFromWishlist: async (productId, variantColor) => {
    const url = variantColor 
      ? `/wishlist/remove/${productId}?variantColor=${variantColor}`
      : `/wishlist/remove/${productId}`;
    const response = await api.delete(url);
    return response.data;
  },

  clearWishlist: async () => {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },

  getWishlistItemCount: async () => {
    const response = await api.get('/wishlist/count');
    return response.data;
  },

  checkWishlistItem: async (productId, variantColor) => {
    const url = variantColor 
      ? `/wishlist/check/${productId}?variantColor=${variantColor}`
      : `/wishlist/check/${productId}`;
    const response = await api.get(url);
    return response.data;
  },

  moveToCart: async (moveData) => {
    const response = await api.post('/wishlist/move-to-cart', moveData);
    return response.data;
  },

  moveAllToCart: async () => {
    const response = await api.post('/wishlist/move-all-to-cart');
    return response.data;
  },
};