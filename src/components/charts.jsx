import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const Charts = ({ expenses = [] }) => {
  // Separate expenses and income
  const expenseData = expenses
    .filter((t) => t.type === 'expense')
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
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
        ],
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

  const enhancedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
            weight: '500',
          },
          color: 'rgba(75, 85, 99, 0.8)',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          color: 'rgba(75, 85, 99, 0.7)',
          font: {
            size: 11,
            weight: '500',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          color: 'rgba(75, 85, 99, 0.7)',
          font: {
            size: 11,
            weight: '500',
          },
        },
      },
    },
  };

  const enhancedPieChartData = {
    ...pieChartData,
    datasets: [
      {
        ...pieChartData.datasets[0],
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10,
        backgroundColor: [
          '#6366f1', // Indigo
          '#8b5cf6', // Violet
          '#ec4899', // Pink
          '#f59e0b', // Amber
          '#10b981', // Emerald
          '#06b6d4', // Cyan
          '#ef4444', // Red
        ],
      },
    ],
  };

  const enhancedLineChartData = {
    ...lineChartData,
    datasets: lineChartData.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 3,
      borderColor: dataset.label === 'Income' ? '#10b981' : '#ef4444',
      backgroundColor:
        dataset.label === 'Income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      pointBackgroundColor: dataset.label === 'Income' ? '#10b981' : '#ef4444',
      pointBorderColor: 'white',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.4,
    })),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Spending by Category</h3>
          <div className="status-badge">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="ml-2 text-xs font-medium">Live</span>
          </div>
        </div>
        {expenses.length > 0 ? (
          <div className="h-80">
            <Pie data={enhancedPieChartData} options={enhancedChartOptions} />
          </div>
        ) : (
          <div className="empty-state h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="empty-state-icon mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
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
              </div>
              <p className="text-gray-500 font-medium">No expense data available</p>
              <p className="text-sm text-gray-400 mt-1">
                Add some transactions to see your spending patterns
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Daily Spending Trend</h3>
          <div className="flex items-center space-x-2">
            <div className="status-badge status-success">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="ml-2 text-xs font-medium">Tracking</span>
            </div>
          </div>
        </div>
        {expenses.length > 0 ? (
          <div className="h-80">
            <Line data={enhancedLineChartData} options={enhancedChartOptions} />
          </div>
        ) : (
          <div className="empty-state h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="empty-state-icon mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No trend data available</p>
              <p className="text-sm text-gray-400 mt-1">
                Start tracking daily transactions to see trends
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
