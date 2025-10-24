// Transaction categories
export const TRANSACTION_CATEGORIES = {
  EXPENSE: [
    'Food',
    'Transport',
    'Utilities',
    'Entertainment',
    'Health',
    'Shopping',
    'Education',
    'Travel',
    'Rent',
    'Insurance',
    'Other'
  ],
  INCOME: [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Gift',
    'Refund',
    'Other'
  ]
};

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Budget periods
export const BUDGET_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

// Date ranges for reports
export const DATE_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  CUSTOM: 'custom'
};

// Chart colors
export const CHART_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#C9CBCF',
  '#FF6384',
  '#36A2EB',
  '#FFCE56'
];

// Status messages
export const STATUS_MESSAGES = {
  LOADING: 'Loading...',
  ERROR: 'An error occurred',
  SUCCESS: 'Operation completed successfully',
  NO_DATA: 'No data available'
};

// Validation rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  DISPLAY_NAME_MIN_LENGTH: 2,
  AMOUNT_MIN: 0.01,
  NOTE_MAX_LENGTH: 500
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  REPORTS: '/reports'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme'
};

// Default values
export const DEFAULTS = {
  CURRENCY: 'USD',
  DATE_FORMAT: 'MM/DD/YYYY',
  ITEMS_PER_PAGE: 10,
  DECIMAL_PLACES: 2
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_ADDED: 'Transaction added successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  BUDGET_CREATED: 'Budget created successfully',
  BUDGET_UPDATED: 'Budget updated successfully',
  BUDGET_DELETED: 'Budget deleted successfully'
};