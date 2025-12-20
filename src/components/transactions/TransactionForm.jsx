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
    <div>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type */}
        <div className="form-group">
          <label className="form-label">Transaction Type</label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
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
                <span className="font-medium">Expense</span>
              </div>
            </label>
            <label
              className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
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
                <span className="font-medium">Income</span>
              </div>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg font-medium">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('amount')}
              className="input-glass pl-8"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="form-error">{errors.amount.message}</p>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="relative">
            <select
              {...register('category')}
              className="input-glass appearance-none cursor-pointer w-full"
            >
              <option value="">Select a category</option>
              {(categories[watch('type') || 'expense'] || []).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
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
          {errors.category && <p className="form-error">{errors.category.message}</p>}
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <div className="relative">
            <input type="date" {...register('date')} className="input-glass w-full" />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          {errors.date && <p className="form-error">{errors.date.message}</p>}
        </div>

        {/* Note */}
        <div className="form-group">
          <label className="form-label">Note (Optional)</label>
          <textarea
            {...register('note')}
            rows="3"
            placeholder="Add a note about this transaction..."
            className="input-glass resize-none w-full"
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
