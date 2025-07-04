import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKENDURL;

const baseURL = BACKEND_URL || 'api/api';
// In your frontend API file
const api = axios.create({
  baseURL: baseURL,
  //baseURL: 'http://localhost:5000/api',
  //baseURL: '/api/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add authentication token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;