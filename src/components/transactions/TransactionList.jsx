import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFinance } from '../../context/FinanceContext';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';

const TransactionList = () => {
  const { transactions, deleteTransaction, updateTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Validation schema for editing
  const editSchema = yup.object({
    amount: yup.number().positive('Amount must be positive').required('Amount is required'),
    category: yup.string().required('Category is required'),
    date: yup.string().required('Date is required'),
    note: yup.string(),
    type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm({
    resolver: yupResolver(editSchema),
  });

  // Get unique categories
  const categories = [...new Set(transactions.map((t) => t.category))];

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || transaction.category === filterCategory;
    const matchesType = !filterType || transaction.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async (data) => {
    try {
      await updateTransaction({
        ...editingTransaction,
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date),
      });
      setEditingTransaction(null);
      resetEdit();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
    resetEdit();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount, type) => {
    const sign = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-green-600' : 'text-red-600';
    return (
      <span className={`font-semibold ${color}`}>
        {sign}${Math.abs(amount).toFixed(2)}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Transactions</h2>
        {/* Filters */}
        <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center md:gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-auto"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found.</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                    {transaction.category}
                  </h3>
                  <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
              </div>

              {transaction.note && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 italic">"{transaction.note}"</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(transaction)}
                  className="w-full sm:w-auto p-2"
                >
                  <Edit2 size={16} className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(transaction.id)}
                  className="w-full sm:w-auto p-2"
                >
                  <Trash2 size={16} className="w-4 h-4" />
                  <span className="ml-1 hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <Modal isOpen={!!editingTransaction} onClose={handleCloseModal} title="Edit Transaction">
          <form onSubmit={handleSubmitEdit(handleUpdate)} className="space-y-4">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              defaultValue={editingTransaction.amount}
              {...registerEdit('amount')}
              error={editErrors.amount?.message}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                defaultValue={editingTransaction.category}
                {...registerEdit('category')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {editErrors.category && (
                <p className="mt-1 text-sm text-red-600">{editErrors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                defaultValue={editingTransaction.type}
                {...registerEdit('type')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              {editErrors.type && (
                <p className="mt-1 text-sm text-red-600">{editErrors.type.message}</p>
              )}
            </div>

            <Input
              label="Date"
              type="date"
              defaultValue={
                editingTransaction.date
                  ? new Date(editingTransaction.date).toISOString().split('T')[0]
                  : ''
              }
              {...registerEdit('date')}
              error={editErrors.date?.message}
              required
            />

            <Input
              label="Note"
              type="text"
              defaultValue={editingTransaction.note || ''}
              {...registerEdit('note')}
              error={editErrors.note?.message}
            />

            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="flex-1">
                Update Transaction
              </Button>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TransactionList;
