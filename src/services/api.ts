import axios from 'axios';
import type { AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      // Clear Redux state (this also clears localStorage)
      store.dispatch(logout());
      // Use replace instead of href to avoid adding to history
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
