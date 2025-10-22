import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const BudgetOverview = () => {
  const { budgets, transactions } = useFinance();

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const getBudgetStatus = (budget) => {
    const spent = spendingByCategory[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;

    if (percentage >= 100) {
      return { status: 'over', color: 'text-red-600', bgColor: 'bg-red-50', icon: TrendingDown };
    } else if (percentage >= 80) {
      return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertTriangle };
    } else {
      return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-50', icon: TrendingUp };
    }
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overall Budget Summary */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Budget Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-800">${totalBudget.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-green-600">${(totalBudget - totalSpent).toFixed(2)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{totalPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                totalPercentage >= 100 ? 'bg-red-500' :
                totalPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Budgets */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Category Budgets</h3>

        {budgets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No budgets set yet. Create your first budget to get started!</p>
        ) : (
          <div className="space-y-4">
            {budgets.map(budget => {
              const spent = spendingByCategory[budget.category] || 0;
              const percentage = (spent / budget.amount) * 100;
              const status = getBudgetStatus(budget);
              const Icon = status.icon;

              return (
                <div key={budget.id} className={`p-4 rounded-lg border ${status.bgColor} border-gray-200`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${status.color}`} />
                      <h4 className="font-semibold text-gray-800">{budget.category}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Spent / Budget</p>
                      <p className="font-semibold">${spent.toFixed(2)} / ${budget.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${status.color.replace('text-', 'bg-')}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={status.color}>
                      {status.status === 'over' && 'Over budget!'}
                      {status.status === 'warning' && 'Close to limit'}
                      {status.status === 'good' && 'On track'}
                    </span>
                    <span className="text-gray-600">
                      ${(budget.amount - spent).toFixed(2)} remaining
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetOverview;