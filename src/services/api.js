import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  transactions: {
    list: '/transactions',
    create: '/transactions',
    update: (id) => `/transactions/${id}`,
    delete: (id) => `/transactions/${id}`,
    search: '/transactions/search',
  },
  budgets: {
    list: '/budgets',
    create: '/budgets',
    update: (id) => `/budgets/${id}`,
    delete: (id) => `/budgets/${id}`,
  },
  reports: {
    summary: '/reports/summary',
    export: '/reports/export',
  },
};

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post(endpoints.auth.login, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(endpoints.auth.register, userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(endpoints.auth.logout);
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post(endpoints.auth.refresh);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post(endpoints.auth.forgotPassword, { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(endpoints.auth.resetPassword, { token, password });
    return response.data;
  },
};

// Transactions API functions
export const transactionsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(endpoints.transactions.list, { params });
    return response.data;
  },

  create: async (transaction) => {
    const response = await api.post(endpoints.transactions.create, transaction);
    return response.data;
  },

  update: async (id, transaction) => {
    const response = await api.put(endpoints.transactions.update(id), transaction);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(endpoints.transactions.delete(id));
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(endpoints.transactions.search, { params: { q: query } });
    return response.data;
  },
};

// Budgets API functions
export const budgetsAPI = {
  getAll: async () => {
    const response = await api.get(endpoints.budgets.list);
    return response.data;
  },

  create: async (budget) => {
    const response = await api.post(endpoints.budgets.create, budget);
    return response.data;
  },

  update: async (id, budget) => {
    const response = await api.put(endpoints.budgets.update(id), budget);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(endpoints.budgets.delete(id));
    return response.data;
  },
};

// Reports API functions
export const reportsAPI = {
  getSummary: async (params = {}) => {
    const response = await api.get(endpoints.reports.summary, { params });
    return response.data;
  },

  export: async (params = {}) => {
    const response = await api.get(endpoints.reports.export, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },
};

export default api;