// Removed unused date-fns import

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  timestamp: Date;
}

interface Budget {
  category: string;
  amount: number;
  spent: number;
}

interface Transaction {
  amount: number;
  category: string;
  date: Date;
  type: 'income' | 'expense';
}

interface Bill {
  name: string;
  amount: number;
  dueDate: Date;
  isRecurring: boolean;
}

export class NotificationService {
  private static notifications: Notification[] = [];

  static async checkBudgetThresholds(currentSpending: number, budget: Budget): Promise<Notification | null> {
    const spendingPercentage = (currentSpending / budget.amount) * 100;
    
    if (spendingPercentage >= 90) {
      return this.createNotification('error', 
        `Critical: You've used ${spendingPercentage.toFixed(1)}% of your ${budget.category} budget`);
    }
    
    if (spendingPercentage >= 80) {
      return this.createNotification('warning',
        `Warning: You've used ${spendingPercentage.toFixed(1)}% of your ${budget.category} budget`);
    }

    return null;
  }

  static async detectUnusualSpending(transactions: Transaction[]): Promise<Notification | null> {
    const averageTransaction = this.calculateAverageTransaction(transactions);
    const latestTransaction = transactions[transactions.length - 1];

    if (latestTransaction && latestTransaction.amount > averageTransaction * 2) {
      return this.createNotification('warning',
        `Unusual spending detected: ${latestTransaction.amount} in ${latestTransaction.category}`);
    }

    return null;
  }

  static async checkUpcomingBills(bills: Bill[]): Promise<Notification[]> {
    const upcoming = bills.filter(bill => {
      const dueIn = this.getDaysUntilDue(bill.dueDate);
      return dueIn <= 7 && dueIn > 0;
    });

    return upcoming.map(bill => this.createNotification('info',
      `Upcoming bill: ${bill.name} - ${bill.amount} due in ${this.getDaysUntilDue(bill.dueDate)} days`));
  }

  private static createNotification(type: Notification['type'], message: string): Notification {
    const notification = {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date()
    };
    
    this.notifications.push(notification);
    return notification;
  }

  private static calculateAverageTransaction(transactions: Transaction[]): number {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return total / transactions.length;
  }

  private static getDaysUntilDue(dueDate: Date): number {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getNotifications(): Notification[] {
    return this.notifications;
  }

  static clearNotifications(): void {
    this.notifications = [];
  }
}