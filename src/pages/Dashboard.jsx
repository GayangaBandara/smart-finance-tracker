import React from 'react';
import { useAuth } from '../context/AuthContext';
import useExpenses from '../hooks/useExpenses';
import Charts from '../components/Charts';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const Dashboard = () => {
    const { user } = useAuth();
    const { expenses, loading } = useExpenses();

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    if (loading) {
        return (
            <div className="container mx-auto p-4 md:p-8 text-center">
                <p>Loading your financial data...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600 mt-2">Welcome, {user?.email}!</p>
                <div className="mt-4">
                    <p className="text-lg text-gray-500">Total Expenses</p>
                    <p className="text-4xl font-extrabold text-red-500">${totalExpenses.toFixed(2)}</p>
                </div>
            </div>
            <Charts expenses={expenses} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ExpenseForm />
                <ExpenseList expenses={expenses} />
            </div>
        </div>
    );
};

export default Dashboard;

