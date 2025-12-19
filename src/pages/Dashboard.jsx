import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import Charts from '../components/Charts.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    transactions = [],
    budgets = [],
    loading = false,
    monthlyExpenses = {},
    categoryTotals = {},
  } = useFinance();
  const [budgetData, setBudgetData] = React.useState([]);
  const shouldReduceMotion = useReducedMotion();

  // Simplified animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut',
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: 'easeOut',
      },
    },
  };

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
    <motion.div
      className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12 2xl:px-16 2xl:py-16 space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="rounded-2xl p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 glass-card"
        variants={itemVariants}
      >
        <motion.h2
          className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 0.3 }}
        >
          Dashboard
        </motion.h2>
        <motion.p
          className="text-gray-600 text-sm md:text-base lg:text-lg"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.25, duration: 0.3 }}
        >
          Welcome, {user?.email}!
        </motion.p>

        {/* Summary cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6"
          variants={itemVariants}
        >
          {showSkeletons ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <motion.div variants={cardVariants}>
                <GlassCard title="Total Income" variant="metric">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.2 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <motion.p
                        className="text-sm font-semibold text-green-600 mb-1"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.2 }}
                      >
                        Total Income
                      </motion.p>
                      <motion.p
                        className="text-3xl md:text-4xl font-bold text-green-600"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.25 }}
                      >
                        ${totalIncome.toFixed(2)}
                      </motion.p>
                    </div>
                    <motion.div
                      className="p-3 bg-green-500/20 rounded-xl"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.45, duration: 0.3 }}
                    >
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </GlassCard>
              </motion.div>

              <motion.div variants={cardVariants}>
                <GlassCard title="Total Expenses" variant="metric">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.2 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <motion.p
                        className="text-sm font-semibold text-red-600 mb-1"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.2 }}
                      >
                        Total Expenses
                      </motion.p>
                      <motion.p
                        className="text-3xl md:text-4xl font-bold text-red-600"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.25 }}
                      >
                        ${totalExpenses.toFixed(2)}
                      </motion.p>
                    </div>
                    <motion.div
                      className="p-3 bg-red-500/20 rounded-xl"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.45, duration: 0.3 }}
                    >
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 13l-5 5m0 0l-5-5m5 5V6"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </GlassCard>
              </motion.div>

              <motion.div variants={cardVariants}>
                <GlassCard title="Net Balance" variant="metric">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.2 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <motion.p
                        className={`text-sm font-semibold mb-1 ${
                          netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.2 }}
                      >
                        {netBalance >= 0 ? 'Positive Balance' : 'Negative Balance'}
                      </motion.p>
                      <motion.p
                        className={`text-3xl md:text-4xl font-bold ${
                          netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.25 }}
                      >
                        ${Math.abs(netBalance).toFixed(2)}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`p-3 rounded-xl ${
                        netBalance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'
                      }`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.45, duration: 0.3 }}
                    >
                      <svg
                        className={`w-8 h-8 ${
                          netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            netBalance >= 0
                              ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                              : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
                          }
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                </GlassCard>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Quick insights */}
        <motion.div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
          {showSkeletons ? (
            <SkeletonCard />
          ) : (
            <motion.div variants={cardVariants}>
              <GlassCard title="Quick Insights" variant="elevated">
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <svg
                          className="w-5 h-5 text-indigo-600"
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
                      <div>
                        <span className="text-sm font-medium text-gray-600">This month</span>
                        <p className="text-xs text-gray-500">Total expenses</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-800">
                      ${thisMonthExpenses.toFixed(2)}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.45, duration: 0.2 }}
                  >
                    <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Top Categories
                    </h4>
                    {topCategories.length ? (
                      <div className="space-y-2">
                        {topCategories.map(([cat, amt], index) => (
                          <motion.div
                            key={cat}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: shouldReduceMotion ? 0 : 0.45 + index * 0.05,
                              duration: 0.2,
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  index === 0
                                    ? 'bg-indigo-500'
                                    : index === 1
                                      ? 'bg-purple-500'
                                      : 'bg-pink-500'
                                }`}
                              ></div>
                              <span className="text-sm font-medium text-gray-700">{cat}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-800">
                              ${amt.toFixed(2)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        className="empty-state p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.45, duration: 0.2 }}
                      >
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 mx-auto text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-500">No category data yet</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Budget Overview */}
      <motion.div className="rounded-2xl p-4 md:p-6 lg:p-8 glass-card" variants={itemVariants}>
        <motion.h3
          className="text-xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: 0.3 }}
        >
          Budget Overview
        </motion.h3>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          {showSkeletons ? (
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} variants={cardVariants}>
                <SkeletonCard />
              </motion.div>
            ))
          ) : budgetData.length ? (
            budgetData.map((budget, index) => (
              <motion.div key={budget.id} variants={cardVariants} custom={index}>
                <GlassCard title={budget.category} className="p-3">
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
                      <motion.div
                        className={`h-2.5 rounded-full ${
                          budget.percentage > 90
                            ? 'bg-red-600'
                            : budget.percentage > 70
                              ? 'bg-yellow-500'
                              : 'bg-green-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        transition={{
                          delay: shouldReduceMotion ? 0 : 0.6 + index * 0.05,
                          duration: 0.4,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                    <motion.p
                      className={`text-right text-sm ${budget.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: shouldReduceMotion ? 0 : 0.65 + index * 0.05,
                        duration: 0.2,
                      }}
                    >
                      {budget.remainingAmount < 0 ? 'Over budget by' : 'Remaining'}: $
                      {Math.abs(budget.remainingAmount).toFixed(2)}
                    </motion.p>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-sm text-gray-500 col-span-full"
              variants={cardVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: 0.3 }}
            >
              No budgets available. Create one to get started.
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Charts placeholder and Transactions */}
      <motion.div
        className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <motion.div className="p-4" variants={itemVariants}>
          {showSkeletons ? (
            <SkeletonCard />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.7, duration: 0.3 }}
            >
              <Charts expenses={transactions} />
            </motion.div>
          )}
        </motion.div>

        {/* Transactions */}
        <motion.div className="p-4" variants={itemVariants}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.7, duration: 0.3 }}
          >
            <TransactionForm />
          </motion.div>
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.75, duration: 0.3 }}
          >
            <TransactionList />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
