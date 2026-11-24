import axios from 'axios';

// When running in the browser, use relative path '/api' so Next.js rewrites it internally
// to http://localhost:5000, keeping backend APIs private and making localhost:3000 the single entry point.
// When running in Node/SSR, fall back to the absolute backend URL.
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Always ensure current baseURL is accurate on client requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.baseURL = '/api';
    const token = localStorage.getItem('airaware_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token if expired or unauthorized
      localStorage.removeItem('airaware_token');
      localStorage.removeItem('airaware_user');
    }
    return Promise.reject(error);
  }
);

export default api;
