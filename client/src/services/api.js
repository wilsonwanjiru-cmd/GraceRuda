// client/src/services/api.js
import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/helpers';

// Determine the base URL from environment or fallback
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log the API base URL in development for debugging
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', baseURL);
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies if needed (optional)
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle network errors
    if (error.response) {
      // Server responded with a status code outside 2xx
      const { status, data } = error.response;

      // 401 Unauthorized – token expired/invalid
      if (status === 401) {
        removeAuthToken();
        // Avoid redirect loop if already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      // Log error details in development
      if (import.meta.env.DEV) {
        console.error(`❌ ${error.config.method.toUpperCase()} ${error.config.url}`, {
          status,
          data,
        });
      }
    } else if (error.request) {
      // Request was made but no response received (network down, CORS, etc.)
      if (import.meta.env.DEV) {
        console.error('🌐 Network error:', error.request);
      }
    } else {
      // Something else happened
      if (import.meta.env.DEV) {
        console.error('⚠️ Unknown error:', error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;