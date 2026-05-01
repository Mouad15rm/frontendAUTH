// src/api/auth.api.js
// All authentication-related API calls

import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyResetCode: (data) => api.post('/auth/verify-reset-code', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  },
};
