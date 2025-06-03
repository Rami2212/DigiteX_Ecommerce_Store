import api from './client';

export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (cartData) => {
    const response = await api.post('/cart/add', cartData);
    return response.data;
  },

  updateCartItem: async (productId, updateData, variantColor) => {
    const url = variantColor 
      ? `/cart/update/${productId}?variantColor=${variantColor}`
      : `/cart/update/${productId}`;
    const response = await api.put(url, updateData);
    return response.data;
  },

  removeFromCart: async (productId, variantColor) => {
    const url = variantColor 
      ? `/cart/remove/${productId}?variantColor=${variantColor}`
      : `/cart/remove/${productId}`;
    const response = await api.delete(url);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  getCartItemCount: async () => {
    const response = await api.get('/cart/count');
    return response.data;
  },
};