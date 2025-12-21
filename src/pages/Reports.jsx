import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Download, Calendar, TrendingUp, TrendingDown, FileText, File } from 'lucide-react';
import Button from '../components/common/Button';
import CurrencyDisplay from '../components/common/CurrencyDisplay';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
} from 'docx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const { transactions, budgets } = useFinance();
  const [dateRange, setDateRange] = useState('month');

  // Filter transactions based on date range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return transactions.filter((t) => new Date(t.date) >= startDate);
  }, [transactions, dateRange]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netIncome = income - expenses;

    return { income, expenses, netIncome };
  }, [filteredTransactions]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown = filteredTransactions.reduce((acc, t) => {
      const category = t.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[category].income += Number(t.amount) || 0;
      } else if (t.type === 'expense') {
        acc[category].expense += Number(t.amount) || 0;
      }
      return acc;
    }, {});

    return Object.entries(breakdown)
      .map(([category, amounts]) => ({
        category,
        income: amounts.income,
        expense: amounts.expense,
        net: amounts.income - amounts.expense,
      }))
      .sort((a, b) => b.expense - a.expense);
  }, [filteredTransactions]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const monthlyData = {};

    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0, dateObj: date };
      }
      monthlyData[month][t.type] += t.amount;
    });

    return Object.entries(monthlyData)
      .sort(([, aData], [, bData]) => new Date(aData.dateObj) - new Date(bData.dateObj))
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
      }));
  }, [filteredTransactions]);

  // Chart data
  const pieChartData = {
    labels: categoryBreakdown.filter((item) => item.expense > 0).map((item) => item.category),
    datasets: [
      {
        label: 'Expenses',
        data: categoryBreakdown
          .filter((item) => item.expense > 0)
          .map((item) => Math.max(item.expense, 0)),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
          '#FF6384',
          '#4BC0C0',
          '#FF9F40',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: monthlyTrend.map((item) => item.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyTrend.map((item) => Math.max(item.income, 0)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Expenses',
        data: monthlyTrend.map((item) => Math.max(item.expense, 0)),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(239, 68, 68)',
      },
    ],
  };

  const barChartData = {
    labels: categoryBreakdown.map((item) => item.category),
    datasets: [
      {
        label: 'Income',
        data: categoryBreakdown.map((item) => Math.max(item.income, 0)),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: categoryBreakdown.map((item) => Math.max(item.expense, 0)),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const exportReport = (format) => {
    const reportData = {
      summary,
      categoryBreakdown,
      monthlyTrend,
      dateRange,
      generatedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-report-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      exportToPDF();
    } else if (format === 'word') {
      exportToWord();
    }
  };

  const exportToPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`finance-report-${dateRange}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const exportToWord = async () => {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Financial Report',
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generated on: ${new Date().toLocaleDateString()}`,
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Period: ${dateRange}`,
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Summary',
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Total Income: $${summary.income.toFixed(2)}`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Total Expenses: $${summary.expenses.toFixed(2)}`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Net Income: $${summary.netIncome.toFixed(2)}`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: '',
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Category Breakdown',
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph('Category')],
                      }),
                      new TableCell({
                        children: [new Paragraph('Income')],
                      }),
                      new TableCell({
                        children: [new Paragraph('Expenses')],
                      }),
                      new TableCell({
                        children: [new Paragraph('Net')],
                      }),
                    ],
                  }),
                  ...categoryBreakdown.map(
                    (cat) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [new Paragraph(cat.category)],
                          }),
                          new TableCell({
                            children: [new Paragraph(`$${cat.income.toFixed(2)}`)],
                          }),
                          new TableCell({
                            children: [new Paragraph(`$${cat.expense.toFixed(2)}`)],
                          }),
                          new TableCell({
                            children: [new Paragraph(`$${cat.net.toFixed(2)}`)],
                          }),
                        ],
                      })
                  ),
                ],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-report-${dateRange}-${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
    }
  };

  // Delete a transaction (not currently implemented)
  // const _handleDeleteTransaction = async (transactionId) => {
  //   try {
  //     if (deleteTransaction) await deleteTransaction(transactionId);
  //   } catch (error) {
  //     console.error('Failed to delete:', error);
  //   }
  // };

  // Edit a transaction (not currently implemented)
  // const _handleUpdateTransaction = async ({ transactionId, newAmount, category, date, note }) => {
  //   try {
  //     if (updateTransaction) await updateTransaction({
  //   try {
  //     if (updateTransaction) await updateTransaction({
  //       id: transactionId,
  //       amount: newAmount,
  //       category: category,
  //       date: date,
  //       note: note
  //     });
  //   } catch (error) {
  //     console.error('Failed to update:', error);
  //   }
  // };

  return (
    <div className="container mx-auto px-4 py-8" id="report-content">
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
          <p className="text-gray-600">Analyze your financial data and trends</p>
        </div>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full lg:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                <CurrencyDisplay amount={summary.income} />
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                <CurrencyDisplay amount={summary.expenses} />
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Income</p>
              <p
                className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                <CurrencyDisplay amount={Math.abs(summary.netIncome)} />
              </p>
            </div>
            {summary.netIncome >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-500" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Monthly Trend</h3>
            <div className="h-64 sm:h-80">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return '$' + value.toFixed(0);
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              Expenses by Category
            </h3>
            <div className="h-64 sm:h-80">
              {categoryBreakdown.some((item) => item.expense > 0) ? (
                <Pie
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                          font: {
                            size: 12,
                          },
                        },
                      },
                      tooltip: {
                        enabled: true,
                        callbacks: {
                          label: function (context) {
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `$${value.toFixed(2)} (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    No expense data available for the selected period
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Income vs Expenses by Category
          </h3>
          <div className="h-64 sm:h-80">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return '$' + value.toFixed(0);
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Budget Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Budget Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const categoryTransactions = filteredTransactions.filter(
              (t) => t.category === budget.category && t.type === 'expense'
            );
            const spentAmount = categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
            const remainingAmount = Number(budget.amount) - spentAmount;
            const percentage = (spentAmount / Number(budget.amount)) * 100;

            return (
              <div key={budget.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-700">{budget.category}</h4>
                  <span className="text-sm text-gray-500">{budget.period}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget Amount:</span>
                    <span className="font-medium">
                      <CurrencyDisplay amount={Number(budget.amount)} />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Spent Amount:</span>
                    <span className="font-medium">
                      <CurrencyDisplay amount={spentAmount} />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span
                      className={`font-medium ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      <CurrencyDisplay amount={Math.abs(remainingAmount)} />
                      {remainingAmount < 0 ? ' (Over Budget)' : ''}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget Utilization:</span>
                      <span className="font-medium">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          percentage > 90
                            ? 'bg-red-600'
                            : percentage > 70
                              ? 'bg-yellow-500'
                              : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown Table with Export Buttons */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-800">
                  Category
                </th>
                <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-800">Income</th>
                <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-800">
                  Expenses
                </th>
                <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-800">Net</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-2 sm:px-4 font-medium text-sm sm:text-base">
                    {item.category}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right text-green-600 text-sm sm:text-base">
                    <CurrencyDisplay amount={item.income} />
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-right text-red-600 text-sm sm:text-base">
                    <CurrencyDisplay amount={item.expense} />
                  </td>
                  <td
                    className={`py-3 px-2 sm:px-4 text-right font-semibold text-sm sm:text-base ${item.net >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <CurrencyDisplay amount={Math.abs(item.net)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Export Report</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={() => exportReport('pdf')}
            className="flex items-center justify-center space-x-2 py-3"
          >
            <FileText size={18} />
            <span>Export as PDF</span>
          </Button>
          <Button
            onClick={() => exportReport('word')}
            className="flex items-center justify-center space-x-2 py-3"
          >
            <File size={18} />
            <span>Export as Word</span>
          </Button>
          <Button
            onClick={() => exportReport('json')}
            variant="outline"
            className="flex items-center justify-center space-x-2 py-3"
          >
            <Download size={18} />
            <span>Export as JSON</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
