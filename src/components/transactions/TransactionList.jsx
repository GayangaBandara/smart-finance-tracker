import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-0">
      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80 flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 w-full md:w-auto mt-2 md:mt-0">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 cursor-pointer min-w-[140px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 cursor-pointer min-w-[120px]"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-base sm:text-lg">No transactions found</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {searchTerm || filterCategory || filterType
                ? 'Try adjusting your filters'
                : 'Add your first transaction to get started'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      {transaction.category}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 ml-5 sm:ml-6">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="sm:ml-4 flex-shrink-0">
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
              </div>

              {transaction.note && (
                <div className="mb-3 sm:mb-4 ml-5 sm:ml-6">
                  <p className="text-xs sm:text-sm text-gray-600 italic bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                    "{transaction.note}"
                  </p>
                </div>
              )}

              <div className="flex flex-col xs:flex-row xs:justify-end gap-2 xs:gap-3 ml-5 sm:ml-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(transaction)}
                  className="w-full xs:w-auto flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm rounded-md group-hover:bg-indigo-50 group-hover:border-indigo-300 transition-colors duration-200"
                  aria-label="Edit transaction"
                >
                  <Edit2 size={14} className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(transaction.id)}
                  className="w-full xs:w-auto flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm rounded-md group-hover:bg-red-50 group-hover:border-red-300 transition-colors duration-200"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={14} className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </motion.div>
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
