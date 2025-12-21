import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFinance } from '../../context/FinanceContext';
import Input from '../common/Input';
import Button from '../common/Button';

// Validation schema
const schema = yup.object({
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  date: yup.date().required('Date is required'),
  note: yup.string(),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
});

const TransactionForm = ({ onSuccess }) => {
  const { addTransaction, loading, error } = useFinance();
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const categories = {
    expense: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  };

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      await addTransaction({
        ...data,
        amount: parseFloat(data.amount),
      });
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error adding transaction:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    // Reset category when type changes
    // use getValues() provided by react-hook-form instead of accessing it from reset
    reset({
      ...getValues(),
      type,
      category: '',
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>

      {error && (
        <div className="status-badge status-danger mb-6">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                watch('type') === 'expense'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="expense"
                {...register('type')}
                onChange={() => handleTypeChange('expense')}
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    watch('type') === 'expense' ? 'border-red-500 bg-red-500' : 'border-gray-300'
                  }`}
                ></div>
                <span className="font-medium text-sm">Expense</span>
              </div>
            </label>
            <label
              className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                watch('type') === 'income'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value="income"
                {...register('type')}
                onChange={() => handleTypeChange('income')}
                className="sr-only"
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    watch('type') === 'income' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                  }`}
                ></div>
                <span className="font-medium text-sm">Income</span>
              </div>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 font-medium">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('amount')}
              className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative">
            <select
              {...register('category')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            >
              <option value="">Select a category</option>
              {(categories[watch('type') || 'expense'] || []).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            {...register('date')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
          <textarea
            {...register('note')}
            rows="3"
            placeholder="Add a note about this transaction..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitLoading || loading}
          loading={submitLoading}
        >
          {submitLoading ? 'Adding Transaction...' : 'Add Transaction'}
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;
