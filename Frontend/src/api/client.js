import axios from 'axios';
import { supabase } from '../lib/supabase';

// Use environment VITE_API_URL, default to /api (for Vite proxy) or http://localhost:5000/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach active Supabase session token or stored localStorage token
api.interceptors.request.use(async (config) => {
  try {
    let token = null;
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      token = data.session.access_token;
      localStorage.setItem('token', token);
    } else {
      token = localStorage.getItem('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('Error attaching auth token to request:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response error handler: extracts message or error field
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data;
    const message =
      errorData?.message ||
      errorData?.error ||
      (typeof errorData === 'string' ? errorData : null) ||
      error.message ||
      'An unexpected error occurred';

    // If token is invalid or expired, clear local storage
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject({
      ...error,
      customMessage: message,
      status: error.response?.status,
    });
  }
);

export default api;
