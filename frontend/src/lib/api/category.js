import api from './client';

export const categoryAPI = {
  addCategory: async (formData) => {
    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  updateCategory: async (id, formData) => {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
