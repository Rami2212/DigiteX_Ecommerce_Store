import api from './client';

export const productAPI = {
  addProduct: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProducts: async (page = 1, limit = 20) => {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProductsById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (category, page = 1, limit = 20) => {
    const response = await api.get(`/products/category/${category}?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateProducts: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
