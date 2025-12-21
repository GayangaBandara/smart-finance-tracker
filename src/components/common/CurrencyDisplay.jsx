import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';

const CurrencyDisplay = ({ amount, className = '', showLoading = false }) => {
  const { formattedAmount, loading } = useCurrency(amount);

  if (loading && showLoading) {
    return <span className={className}>...</span>;
  }

  return <span className={className}>{formattedAmount}</span>;
};

export default CurrencyDisplay;
