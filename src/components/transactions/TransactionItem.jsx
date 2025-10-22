import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Button from '../common/Button';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount, type) => {
    const sign = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-green-600' : 'text-red-600';
    return (
      <span className={`font-semibold text-lg ${color}`}>
        {sign}${Math.abs(amount).toFixed(2)}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              transaction.type === 'income'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {transaction.type}
            </span>
            <h3 className="font-semibold text-gray-800">{transaction.category}</h3>
          </div>
          {formatAmount(transaction.amount, transaction.type)}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{formatDate(transaction.date)}</span>
          {transaction.note && (
            <span className="italic text-gray-500">"{transaction.note}"</span>
          )}
        </div>
      </div>

      <div className="flex space-x-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(transaction)}
          className="p-2"
          title="Edit transaction"
        >
          <Edit2 size={16} />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(transaction.id)}
          className="p-2"
          title="Delete transaction"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TransactionItem;