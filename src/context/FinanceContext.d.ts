export interface BudgetData {
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  id?: string;
  createdAt?: Date;
}

export interface TransactionData {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'income' | 'expense';
}

export interface FinanceContextType {
  transactions: TransactionData[];
  budgets: BudgetData[];
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setTransactions: (transactions: TransactionData[]) => void;
  addTransaction: (transaction: TransactionData) => void;
  updateTransaction: (transaction: TransactionData) => void;
  deleteTransaction: (id: string) => void;
  setBudgets: (budgets: BudgetData[]) => void;
  addBudget: (budget: BudgetData) => void;
  updateBudget: (budget: BudgetData) => void;
  deleteBudget: (id: string) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

export function useFinance(): FinanceContextType;