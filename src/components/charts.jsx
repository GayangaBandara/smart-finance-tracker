import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Charts = ({ expenses = [] }) => {
    // Separate expenses and income
    const expenseData = expenses
        .filter(t => t.type === 'expense')
        .reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount || 0);
            return acc;
        }, {});

    const pieChartData = {
        labels: Object.keys(expenseData),
        datasets: [
            {
                label: 'Expenses by Category',
                data: Object.values(expenseData),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
            },
        ],
    };

    const dailyData = expenses.reduce((acc, transaction) => {
        const date = transaction.date || new Date().toISOString().slice(0, 10);
        if (!acc[date]) {
            acc[date] = { income: 0, expenses: 0 };
        }
        if (transaction.type === 'income') {
            acc[date].income += Number(transaction.amount || 0);
        } else {
            acc[date].expenses += Number(transaction.amount || 0);
        }
        return acc;
    }, {});

    const sortedDates = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));

    const lineChartData = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Income',
                data: sortedDates.map((d) => dailyData[d].income),
                fill: false,
                borderColor: 'rgb(34, 197, 94)',
                tension: 0.1,
            },
            {
                label: 'Expenses',
                data: sortedDates.map((d) => dailyData[d].expenses),
                fill: false,
                borderColor: 'rgb(239, 68, 68)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
            <div className="bg-white p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10 rounded-2xl shadow-xl border border-gray-200">
                <h3 className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-3 md:mb-4 text-gray-800">Spending by Category</h3>
                {expenses.length > 0 ? <Pie data={pieChartData} /> : <p className="text-gray-500">No data to display.</p>}
            </div>
            <div className="bg-white p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10 rounded-2xl shadow-xl border border-gray-200">
                <h3 className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-3 md:mb-4 text-gray-800">Daily Spending Trend</h3>
                {expenses.length > 0 ? <Line data={lineChartData} /> : <p className="text-gray-500">No data to display.</p>}
            </div>
        </div>
    );
};

export default Charts;
