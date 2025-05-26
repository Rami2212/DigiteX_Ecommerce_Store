import api from './client';

export const userAPI = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get single user by ID (admin only)
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create new user (admin only)
  createUser: async (formData) => {
    const response = await api.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update user by admin
  updateUserByAdmin: async (id, formData) => {
    const response = await api.put(`/users/updatebyadmin/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update user profile (by logged-in user)
  updateUserProfile: async (formData) => {
    const response = await api.put('/users/updatebyuser', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response)
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Delete own user account
  deleteOwnUser: async (id) => {
    const response = await api.delete(`/users/deleteownuser/${id}`);
    return response.data;
  },

  // Change email (for logged-in user)
  changeEmail: async (emailData) => {
    const response = await api.put('/users/change-email', emailData);
    return response.data;
  },
};