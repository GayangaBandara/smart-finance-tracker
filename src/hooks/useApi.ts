import { useState, useCallback } from 'react';
import { AppError, handleError } from '../utils/errorHandling';

interface UseApiOptions {
  onError?: (error: AppError) => void;
  onSuccess?: (data: any) => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const appError = handleError(err);
        setError(appError);
        options.onError?.(appError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    execute,
    loading,
    error,
    clearError,
  };
}

// Example usage:
// const { execute: createTransaction, loading, error } = useApi(
//   transactionService.create,
//   {
//     onSuccess: () => {
//       toast.success('Transaction created successfully');
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   }
// );