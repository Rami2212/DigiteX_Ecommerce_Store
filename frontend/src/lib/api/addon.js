import api from './client';

export const addonAPI = {
  addAddon: async (formData) => {
    const response = await api.post('/addons', formData);
    return response.data;
  },

  getAddons: async () => {
    const response = await api.get('/addons');
    return response.data;
  },

  updateAddon: async (id, formData) => {
    const response = await api.put(`/addons/${id}`, formData);
    return response.data;
  },

  deleteAddon: async (id) => {
    const response = await api.delete(`/addons/${id}`);
    return response.data;
  },
};
