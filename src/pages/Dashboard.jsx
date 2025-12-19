import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
                <GlassCard title="Total Income">
                  <motion.p
                    className="text-sm text-green-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.2 }}
                  >
                    Income
                  </motion.p>
                  <motion.p
                    className="text-2xl md:text-3xl font-bold text-green-600"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.25 }}
                  >
                    ${totalIncome.toFixed(2)}
                  </motion.p>
                </GlassCard>
              </motion.div>

              <motion.div variants={cardVariants}>
                <GlassCard title="Total Expenses">
                  <motion.p
                    className="text-sm text-red-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.2 }}
                  >
                    Expenses
                  </motion.p>
                  <motion.p
                    className="text-2xl md:text-3xl font-bold text-red-600"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.25 }}
                  >
                    ${totalExpenses.toFixed(2)}
                  </motion.p>
                </GlassCard>
              </motion.div>

              <motion.div variants={cardVariants}>
                <GlassCard title="Net Balance">
                  <motion.p
                    className={`text-sm ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: 0.2 }}
                  >
                    {netBalance >= 0 ? 'Positive' : 'Negative'}
                  </motion.p>
                  <motion.p
                    className={`text-2xl md:text-3xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.35, duration: 0.25 }}
                  >
                    ${Math.abs(netBalance).toFixed(2)}
                  </motion.p>
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
              <GlassCard title="Quick Insights">
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: 0.2 }}
                  >
                    <span className="text-sm text-gray-500">This month expenses</span>
                    <span className="font-semibold text-gray-800">
                      ${thisMonthExpenses.toFixed(2)}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.45, duration: 0.2 }}
                  >
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Top categories</h4>
                    {topCategories.length ? (
                      topCategories.map(([cat, amt], index) => (
                        <motion.div
                          key={cat}
                          className="flex justify-between text-sm text-gray-700"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: shouldReduceMotion ? 0 : 0.45 + index * 0.05,
                            duration: 0.2,
                          }}
                        >
                          <span>{cat}</span>
                          <span>${amt.toFixed(2)}</span>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.45, duration: 0.2 }}
                      >
                        No category data yet
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
          {/* placeholder for charts */}
          <motion.div
            className="h-48 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 glass-card"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            Charts (coming soon)
          </motion.div>
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
