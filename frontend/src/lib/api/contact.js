import api from './client';

export const contactAPI = {
  // Public API - Submit contact form
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Admin APIs - Manage contacts
  getContacts: async (filters = {}) => {
    const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    params.append('page', page);
    params.append('limit', limit);
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);

    const response = await api.get(`/contact?${params.toString()}`);
    return response.data;
  },

  getContactById: async (contactId) => {
    const response = await api.get(`/contact/${contactId}`);
    return response.data;
  },

  updateContactStatus: async (contactId, updateData) => {
    const response = await api.put(`/contact/${contactId}`, updateData);
    return response.data;
  },

  deleteContact: async (contactId) => {
    const response = await api.delete(`/contact/${contactId}`);
    return response.data;
  },

  getContactsByEmail: async (email) => {
    const response = await api.get(`/contact/email/${email}`);
    return response.data;
  },

  getContactStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  },
};