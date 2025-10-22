import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFinance } from '../../context/FinanceContext';
import Input from '../common/Input';
import Button from '../common/Button';

// Validation schema
const schema = yup.object({
  category: yup.string().required('Category is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  period: yup.string().oneOf(['monthly', 'weekly', 'yearly']).required('Period is required'),
});

const BudgetForm = ({ onSuccess, editingBudget }) => {
  const { addBudget, updateBudget, loading, error } = useFinance();
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editingBudget ? {
      category: editingBudget.category,
      amount: editingBudget.amount,
      period: editingBudget.period,
    } : {
      period: 'monthly',
    },
  });

  const categories = [
    'Food', 'Transport', 'Utilities', 'Entertainment',
    'Health', 'Shopping', 'Education', 'Travel', 'Other'
  ];

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      if (editingBudget) {
        await updateBudget({ ...editingBudget, ...data });
      } else {
        await addBudget({
          ...data,
          amount: parseFloat(data.amount),
          createdAt: new Date(),
        });
      }
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error saving budget:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editingBudget ? 'Edit Budget' : 'Create Budget'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            {...register('category')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {/* Amount */}
        <Input
          label="Budget Amount"
          type="number"
          step="0.01"
          {...register('amount')}
          error={errors.amount?.message}
          required
        />

        {/* Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Period</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="weekly"
                {...register('period')}
                className="mr-2"
              />
              Weekly
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="monthly"
                {...register('period')}
                className="mr-2"
              />
              Monthly
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="yearly"
                {...register('period')}
                className="mr-2"
              />
              Yearly
            </label>
          </div>
          {errors.period && <p className="mt-1 text-sm text-red-600">{errors.period.message}</p>}
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={submitLoading || loading}
            className="flex-1"
          >
            {submitLoading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
          </Button>
          {editingBudget && (
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;