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
        createdAt: new Date(),
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
    reset({
      ...reset.getValues(),
      type,
      category: '',
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                {...register('type')}
                onChange={() => handleTypeChange('expense')}
                className="mr-2"
              />
              Expense
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                {...register('type')}
                onChange={() => handleTypeChange('income')}
                className="mr-2"
              />
              Income
            </label>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          step="0.01"
          {...register('amount')}
          error={errors.amount?.message}
          required
        />

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            {...register('category')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.expense.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          {...register('date')}
          error={errors.date?.message}
          required
        />

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
          <textarea
            {...register('note')}
            rows="3"
            placeholder="Add a note..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitLoading || loading}
        >
          {submitLoading ? 'Adding...' : 'Add Transaction'}
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;