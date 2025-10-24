import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import Charts from '../components/Charts';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';

const Dashboard = () => {
    const { user } = useAuth();
    const { transactions, budgets, loading } = useFinance();
    const [budgetData, setBudgetData] = React.useState([]);

    // Process budget data when transactions or budgets change
    React.useEffect(() => {
        if (budgets && transactions) {
            const processedBudgets = budgets.map(budget => {
                const categoryTransactions = transactions.filter(t => 
                    t.category === budget.category && 
                    t.type === 'expense'
                );
                const spentAmount = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
                const remainingAmount = Number(budget.amount) - spentAmount;
                const percentage = (spentAmount / Number(budget.amount)) * 100;

                return {
                    ...budget,
                    spentAmount,
                    remainingAmount,
                    percentage
                };
            });
            setBudgetData(processedBudgets);
        }
    }, [transactions, budgets]);

    console.log('Dashboard render - User:', user?.uid);
    console.log('Dashboard render - Transactions:', transactions);
    console.log('Dashboard render - Budgets:', budgets);
    console.log('Dashboard render - Processed Budget Data:', budgetData);
    console.log('Dashboard render - Loading:', loading);
    console.log('Transaction count:', transactions?.length || 0);
    console.log('Budget count:', budgets?.length || 0);

    // Calculate totals separately for income and expenses
    const { totalIncome, totalExpenses } = transactions.reduce((acc, curr) => {
        if (curr.type === 'income') {
            acc.totalIncome += Number(curr.amount);
        } else {
            acc.totalExpenses += Number(curr.amount);
        }
        return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    const netBalance = totalIncome - totalExpenses;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12 2xl:px-16 2xl:py-16 text-center">
                <p className="text-lg font-semibold text-gray-600">Loading your financial data...</p>
                <div className="mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12 2xl:px-16 2xl:py-16 space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
            <div className="bg-white p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base lg:text-lg">Welcome, {user?.email}!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <p className="text-sm md:text-base lg:text-lg text-green-600">Total Income</p>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">
                            ${totalIncome.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <p className="text-sm md:text-base lg:text-lg text-red-600">Total Expenses</p>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600">
                            ${totalExpenses.toFixed(2)}
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl border ${netBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                        <p className={`text-sm md:text-base lg:text-lg ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            Net Balance
                        </p>
                        <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            ${Math.abs(netBalance).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            {/* Budget Overview */}
            <div className="bg-white p-4 md:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Budget Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {budgetData.map(budget => {

                        return (
                            <div key={budget.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-700">{budget.category}</h4>
                                    <span className="text-sm text-gray-500">{budget.period}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Budget: ${Number(budget.amount).toFixed(2)}</span>
                                        <span>Spent: ${budget.spentAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${
                                                budget.percentage > 90 ? 'bg-red-600' :
                                                budget.percentage > 70 ? 'bg-yellow-500' :
                                                'bg-green-600'
                                            }`}
                                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className={`text-right text-sm ${
                                        budget.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {budget.remainingAmount < 0 ? 'Over budget by' : 'Remaining'}: ${Math.abs(budget.remainingAmount).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Charts expenses={transactions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                <TransactionForm />
                <TransactionList />
            </div>
        </div>
    );
};

export default Dashboard;

