// Date formatting helpers
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  if (typeof date === 'string') {
    date = new Date(date);
  }

  return date.toLocaleDateString('en-US', defaultOptions);
};

export const formatDateTime = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Currency formatting helpers
export const formatCurrency = (amount, currency = 'USD', decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

export const formatAmount = (amount, showSign = false) => {
  const formatted = formatCurrency(Math.abs(amount));
  if (showSign) {
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return formatted;
};

// Number formatting helpers
export const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${formatNumber(value, decimals)}%`;
};

// Array and object helpers
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const sumBy = (array, key) => {
  return array.reduce((sum, item) => sum + (item[key] || 0), 0);
};

export const averageBy = (array, key) => {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
};

// Financial calculation helpers
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const calculateBudgetProgress = (spent, budget) => {
  if (budget === 0) return 0;
  return (spent / budget) * 100;
};

export const getBudgetStatus = (spent, budget) => {
  const percentage = calculateBudgetProgress(spent, budget);

  if (percentage >= 100) return 'over';
  if (percentage >= 80) return 'warning';
  return 'good';
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidAmount = (amount) => {
  return !isNaN(amount) && amount > 0;
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// String helpers
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncate = (string, length = 50) => {
  if (string.length <= length) return string;
  return string.substring(0, length) + '...';
};

// Color helpers
export const getStatusColor = (status) => {
  const colors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    over: 'text-red-600',
    income: 'text-green-600',
    expense: 'text-red-600'
  };
  return colors[status] || 'text-gray-600';
};

export const getProgressColor = (percentage) => {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Debounce helper
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Export data helpers
export const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};