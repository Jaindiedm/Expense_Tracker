import axios from 'axios';

// Base URL points to Spring Boot backend
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expired or invalid, logout and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;