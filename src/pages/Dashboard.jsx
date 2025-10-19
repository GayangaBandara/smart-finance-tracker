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
            <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12 2xl:px-16 2xl:py-16 text-center">
                <p>Loading your financial data...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12 2xl:px-16 2xl:py-16 space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
            <div className="bg-white p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-2xl shadow-xl border border-gray-200 text-center">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base lg:text-lg">Welcome, {user?.email}!</p>
                <div className="mt-4 md:mt-6">
                    <p className="text-sm md:text-base lg:text-lg text-gray-500">Total Expenses</p>
                    <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-red-500">${totalExpenses.toFixed(2)}</p>
                </div>
            </div>
            <Charts expenses={expenses} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                <ExpenseForm />
                <ExpenseList expenses={expenses} />
            </div>
        </div>
    );
};

export default Dashboard;

