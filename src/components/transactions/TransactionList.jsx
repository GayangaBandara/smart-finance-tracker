import React, { useState } from 'react';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Button from '../common/Button';
import Modal from '../common/Modal';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Get unique categories
  const categories = [...new Set(transactions.map(t => t.category))];

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">Transactions</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          filteredTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{transaction.category}</h3>
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{formatDate(transaction.date)}</span>
                  {transaction.note && <span className="italic">"{transaction.note}"</span>}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(transaction)}
                  className="p-2"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <Modal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          title="Edit Transaction"
        >
          {/* Edit form will be implemented */}
          <p>Edit form coming soon...</p>
        </Modal>
      )}
    </div>
  );
};

export default TransactionList;