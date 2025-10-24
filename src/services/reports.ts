import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: Date;
  type: 'income' | 'expense';
  description?: string;
}

interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topCategories: Array<{ category: string; amount: number }>;
}

export class ReportService {
  static generateMonthlyReport(transactions: Transaction[]) {
    const summary = this.generateSummary(transactions);
    const charts = this.generateChartData(transactions);
    const insights = this.generateInsights(summary);

    return {
      summary,
      charts,
      insights,
      generatedAt: new Date()
    };
  }

  static async exportToCSV(transactions: Transaction[]): Promise<void> {
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map(t => ({
        ...t,
        date: format(t.date, 'yyyy-MM-dd'),
        amount: t.type === 'expense' ? -t.amount : t.amount
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    XLSX.writeFile(workbook, `finance_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  }

  static async exportToPDF(transactions: Transaction[]): Promise<void> {
    const doc = new jsPDF();
    const summary = this.generateSummary(transactions);

    // Add title
    doc.setFontSize(20);
    doc.text('Financial Report', 20, 20);

    // Add summary
    doc.setFontSize(12);
    doc.text(`Total Income: $${summary.totalIncome.toFixed(2)}`, 20, 40);
    doc.text(`Total Expenses: $${summary.totalExpenses.toFixed(2)}`, 20, 50);
    doc.text(`Net Savings: $${summary.netSavings.toFixed(2)}`, 20, 60);

    // Add top categories
    doc.text('Top Spending Categories:', 20, 80);
    summary.topCategories.forEach((cat, index) => {
      doc.text(`${cat.category}: $${cat.amount.toFixed(2)}`, 30, 90 + (index * 10));
    });

    // Save the PDF
    doc.save(`finance_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  }

  private static generateSummary(transactions: Transaction[]): ReportSummary {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const topCategories = this.calculateTopCategories(transactions);

    return {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      topCategories
    };
  }

  private static generateChartData(transactions: Transaction[]) {
    const categoryData = this.calculateCategoryTotals(transactions);
    const timelineData = this.calculateTimelineTotals(transactions);

    return {
      categoryChart: categoryData,
      timelineChart: timelineData
    };
  }

  private static generateInsights(summary: ReportSummary) {
    const savingsRate = (summary.netSavings / summary.totalIncome) * 100;
    const insights = [];

    if (savingsRate < 20) {
      insights.push('Consider reducing expenses to improve savings rate');
    }

    if (summary.topCategories[0]?.amount > summary.totalExpenses * 0.5) {
      insights.push(`High spending in ${summary.topCategories[0].category} category`);
    }

    return insights;
  }

  private static calculateTopCategories(transactions: Transaction[]) {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  private static calculateCategoryTotals(transactions: Transaction[]) {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }

  private static calculateTimelineTotals(transactions: Transaction[]) {
    return transactions.reduce((acc, t) => {
      const date = format(t.date, 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + (t.type === 'expense' ? -t.amount : t.amount);
      return acc;
    }, {} as Record<string, number>);
  }
}
