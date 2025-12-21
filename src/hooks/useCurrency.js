import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { convertAmount, formatCurrency, fetchExchangeRates } from '../services/currency';

export const useCurrency = (amount) => {
  const { currency } = useTheme();
  const [formattedAmount, setFormattedAmount] = useState(formatCurrency(amount, 'USD'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const convertAndFormat = async () => {
      if (currency === 'USD') {
        setFormattedAmount(formatCurrency(amount, 'USD'));
        return;
      }

      setLoading(true);
      try {
        const converted = await convertAmount(amount, 'USD', currency);
        setFormattedAmount(formatCurrency(converted, currency));
      } catch (error) {
        console.error('Error converting currency:', error);
        setFormattedAmount(formatCurrency(amount, 'USD'));
      } finally {
        setLoading(false);
      }
    };

    convertAndFormat();
  }, [amount, currency]);

  return { formattedAmount, loading };
};
