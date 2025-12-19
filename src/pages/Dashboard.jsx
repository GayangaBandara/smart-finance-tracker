import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import GlassCard from '../components/common/GlassCard';
import SkeletonCard from '../components/common/SkeletonCard';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    transactions = [],
    budgets = [],
    loading = false,
    monthlyExpenses = {},
    weeklySpending = [],
    categoryTotals = {},
  } = useFinance();
  const [budgetData, setBudgetData] = React.useState([]);

  // Process budget data when transactions or budgets change
  React.useEffect(() => {
    if (budgets && transactions) {
      const processedBudgets = budgets.map((budget) => {
        const categoryTransactions = transactions.filter(
          (t) => t.category === budget.category && t.type === 'expense'
        );
        const spentAmount = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const remainingAmount = Number(budget.amount) - spentAmount;
        const percentage = Number(budget.amount) ? (spentAmount / Number(budget.amount)) * 100 : 0;

        return {
          ...budget,
          spentAmount,
          remainingAmount,
          percentage,
        };
      });
      setBudgetData(processedBudgets);
    }
  }, [transactions, budgets]);

  // Calculate totals separately for income and expenses
  const { totalIncome, totalExpenses } = (transactions || []).reduce(
    (acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += Number(curr.amount);
      } else {
        acc.totalExpenses += Math.abs(Number(curr.amount));
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const netBalance = totalIncome - totalExpenses;

  // Small insights used by cards
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthExpenses = monthlyExpenses?.[currentMonthKey] || 0;
  const topCategories = Object.entries(categoryTotals || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const showSkeletons = Boolean(loading);

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12 2xl:px-16 2xl:py-16 space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
      <div className="rounded-2xl p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 bg-transparent">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base lg:text-lg">
          Welcome, {user?.email}!
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {showSkeletons ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <GlassCard title="Total Income">
                <p className="text-sm text-green-600">Income</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600">
                  ${totalIncome.toFixed(2)}
                </p>
              </GlassCard>

              <GlassCard title="Total Expenses">
                <p className="text-sm text-red-600">Expenses</p>
                <p className="text-2xl md:text-3xl font-bold text-red-600">
                  ${totalExpenses.toFixed(2)}
                </p>
              </GlassCard>

              <GlassCard title="Net Balance">
                <p className={`text-sm ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {netBalance >= 0 ? 'Positive' : 'Negative'}
                </p>
                <p
                  className={`text-2xl md:text-3xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}
                >
                  ${Math.abs(netBalance).toFixed(2)}
                </p>
              </GlassCard>
            </>
          )}
        </div>

        {/* Quick insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {showSkeletons ? (
            <SkeletonCard />
          ) : (
            <GlassCard title="Quick Insights">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">This month expenses</span>
                  <span className="font-semibold text-gray-800">
                    ${thisMonthExpenses.toFixed(2)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Top categories</h4>
                  {topCategories.length ? (
                    topCategories.map(([cat, amt]) => (
                      <div key={cat} className="flex justify-between text-sm text-gray-700">
                        <span>{cat}</span>
                        <span>${amt.toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No category data yet</div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="rounded-2xl p-4 md:p-6 lg:p-8 bg-transparent">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Budget Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {showSkeletons ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : budgetData.length ? (
            budgetData.map((budget) => (
              <GlassCard key={budget.id} title={budget.category} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{budget.period}</span>
                  <span className="text-sm text-gray-600">
                    Budget ${Number(budget.amount).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spent: ${budget.spentAmount.toFixed(2)}</span>
                    <span>{Math.round(budget.percentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        budget.percentage > 90
                          ? 'bg-red-600'
                          : budget.percentage > 70
                            ? 'bg-yellow-500'
                            : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  <p
                    className={`text-right text-sm ${budget.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {budget.remainingAmount < 0 ? 'Over budget by' : 'Remaining'}: $
                    {Math.abs(budget.remainingAmount).toFixed(2)}
                  </p>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-sm text-gray-500 col-span-full">
              No budgets available. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Charts placeholder (will be replaced with Recharts implementation) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4">
          {/* placeholder for charts */}
          <div className="h-48 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
            Charts (coming soon)
          </div>
        </div>

        {/* Transactions */}
        <div className="p-4">
          <TransactionForm />
          <div className="mt-4">
            <TransactionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
