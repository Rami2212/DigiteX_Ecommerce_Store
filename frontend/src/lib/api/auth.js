import api from './client';

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  adminLogin: async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },
  
  verifyOtp: async (data) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },
  
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  forgotPasswordLoggedIn: async (email) => {
    const response = await api.post('/auth/forgot-password-logged-in', { email });
    return response.data;
  },
  
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
  
  resendOtp: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  sendOtp: async (email) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};