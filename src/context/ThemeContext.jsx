import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('finance-tracker-theme');
    return savedTheme || 'light';
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    // Detect system theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('finance-tracker-high-contrast');
    return saved === 'true';
  });

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('finance-tracker-theme', theme);

    // Remove existing theme classes
    document.documentElement.classList.remove(
      'theme-light',
      'theme-dark',
      'theme-sepia',
      'theme-blue',
      'theme-green'
    );

    // Determine the actual theme to use
    const actualTheme = theme === 'system' ? systemTheme : theme;

    // Add new theme class
    document.documentElement.classList.add(`theme-${actualTheme}`);

    // Apply theme to body for global styles
    document.body.setAttribute('data-theme', actualTheme);
  }, [theme, systemTheme]);

  useEffect(() => {
    // Save high contrast setting to localStorage
    localStorage.setItem('finance-tracker-high-contrast', highContrast.toString());

    // Apply high contrast class
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    // Also update appearance settings if needed
  };

  const updateHighContrast = (enabled) => {
    setHighContrast(enabled);
  };

  const value = {
    theme,
    systemTheme,
    highContrast,
    updateTheme,
    updateHighContrast,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
