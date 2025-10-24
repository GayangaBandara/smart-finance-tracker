import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import type { BudgetData } from '../context/FinanceContext.d.ts';


export const useBudget = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addBudget, updateBudget } = useFinance();

  const handleBudgetOperation = (data: BudgetData, isEdit = false) => {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        updateBudget(data);
      } else {
        addBudget({
          ...data,
          amount: parseFloat(data.amount.toString()),
          createdAt: new Date(),
        });
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleBudgetOperation, loading, error };
};
