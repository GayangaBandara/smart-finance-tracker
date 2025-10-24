import { startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

interface Transaction {
  amount: number;
  category: string;
  date: Date;
  type: 'income' | 'expense';
}

interface Budget {
  amount: number;
  category: string;
  period: 'weekly' | 'monthly' | 'yearly';
}

export class BudgetAnalysis {
  calculateTotalSpent(transactions: Transaction[], category?: string): number {
    return transactions
      .filter(t => t.type === 'expense' && (!category || t.category === category))
      .reduce((sum, t) => sum + t.amount, 0);
  }

  calculateRemaining(budget: Budget, transactions: Transaction[]): number {
    const totalSpent = this.calculateTotalSpent(transactions, budget.category);
    return budget.amount - totalSpent;
  }

  calculateMonthlyTrend(transactions: Transaction[]): Array<{ month: string; amount: number }> {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyTransactions = transactions.filter(t => 
      t.date >= monthStart && t.date <= monthEnd
    );

    const dailyTotals = monthlyTransactions.reduce((acc, transaction) => {
      const day = transaction.date.getDate();
      acc[day] = (acc[day] || 0) + transaction.amount;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(dailyTotals).map(([day, amount]) => ({
      month: `Day ${day}`,
      amount
    }));
  }

  calculateProjectedOverspend(budget: Budget, transactions: Transaction[]): number {
    const monthlyRate = this.calculateSpendingRate(transactions);
    const projectedTotal = monthlyRate * (budget.period === 'yearly' ? 12 : 1);
    return Math.max(0, projectedTotal - budget.amount);
  }

  calculateSavingsRate(income: number, expenses: Transaction[]): number {
    const totalExpenses = this.calculateTotalSpent(expenses);
    return ((income - totalExpenses) / income) * 100;
  }

  private calculateSpendingRate(transactions: Transaction[]): number {
    const currentMonth = new Date();
    const monthlyTransactions = transactions.filter(t => 
      isSameMonth(t.date, currentMonth)
    );
    return this.calculateTotalSpent(monthlyTransactions);
  }
};