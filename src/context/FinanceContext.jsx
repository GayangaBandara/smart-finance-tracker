import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import RetryError from '../components/common/RetryError';

// Initial state
const initialState = {
  transactions: [],
  budgets: [],
  loading: false,
  error: null,
  analysis: null, // reserved for AI analysis results
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  BULK_UPSERT_TRANSACTIONS: 'BULK_UPSERT_TRANSACTIONS',
  SET_BUDGETS: 'SET_BUDGETS',
  ADD_BUDGET: 'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  SET_ANALYSIS: 'SET_ANALYSIS', // AI analysis payload
  RESET_FINANCE_STATE: 'RESET_FINANCE_STATE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const financeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: Array.isArray(action.payload)
          ? action.payload.map((t) => normalizeTransaction(t))
          : state.transactions,
      };
    case ACTIONS.BULK_UPSERT_TRANSACTIONS: {
      const incoming = Array.isArray(action.payload)
        ? action.payload.map((t) => normalizeTransaction(t))
        : [];
      const map = new Map(state.transactions.map((t) => [t.id, t]));
      incoming.forEach((t) => map.set(t.id, t));
      return { ...state, transactions: Array.from(map.values()) };
    }
    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, normalizeTransaction(action.payload)],
      };
    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? normalizeTransaction(action.payload) : t
        ),
      };
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case ACTIONS.SET_BUDGETS:
      return { ...state, budgets: action.payload };
    case ACTIONS.ADD_BUDGET:
      return { ...state, budgets: [...state.budgets, action.payload] };
    case ACTIONS.UPDATE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.map((b) => (b.id === action.payload.id ? action.payload : b)),
      };
    case ACTIONS.DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload),
      };
    case ACTIONS.SET_ANALYSIS:
      return { ...state, analysis: action.payload };
    case ACTIONS.RESET_FINANCE_STATE:
      return { ...initialState };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Normalizer to enforce a consistent transaction schema for reducers and AI analysis
const normalizeTransaction = (input = {}) => {
  const t = { ...input };

  // Ensure id
  t.id = t.id || '';

  // Normalize amount to number
  t.amount = Number(t.amount) || 0;

  // Normalize date to JS Date instance
  if (t.date && t.date.toDate) {
    t.date = t.date.toDate();
  } else if (t.date) {
    t.date = new Date(t.date);
  } else if (t.createdAt && t.createdAt.toDate) {
    t.date = t.createdAt.toDate();
  } else {
    t.date = t.date instanceof Date ? t.date : new Date();
  }

  // Type inference
  t.type = t.type || (t.amount < 0 ? 'expense' : 'income');
  t.category = t.category || 'Uncategorized';
  t.note = t.note || '';

  return {
    id: t.id,
    date: t.date,
    amount: t.amount,
    type: t.type,
    category: t.category,
    note: t.note,
    uid: t.uid,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
};

// Create context
const FinanceContext = createContext();

// Provider component
export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();

  const handleFetchError = useCallback((error, source) => {
    console.error(`Error fetching ${source}:`, error);

    // Handle specific backend errors (Supabase)
    if (error?.code === 'permission-denied') {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: 'You do not have permission to access this data. Please log out and log in again.',
      });
      return;
    }

    if (error.code === 'failed-precondition') {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: 'Unable to load data. Please check your connection and try again.',
      });
      return;
    }

    dispatch({
      type: ACTIONS.SET_ERROR,
      payload: `Unable to load ${source}. Please check your connection and try again.`,
    });
  }, []);

  // Allow retrying fetch/listeners by bumping this counter
  const retryFetch = useCallback(() => {
    // Clear any visible error, show loading, and trigger the effect to re-run
    dispatch({ type: ACTIONS.CLEAR_ERROR });
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    setRetryCount((c) => c + 1);
  }, [setRetryCount]);

  // Load data when user changes or when a retry is requested
  useEffect(() => {
    let isMounted = true;

    let unsubscribeTransactions = null;
    let unsubscribeBudgets = null;
    let retryTimeout = null;

    // Clear any existing listeners
    const cleanupListeners = () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (unsubscribeTransactions) unsubscribeTransactions();
      if (unsubscribeBudgets) unsubscribeBudgets();
    };

    // Handle initial state
    if (!user) {
      console.log('No user, clearing data');
      dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: [] });
      dispatch({ type: ACTIONS.SET_BUDGETS, payload: [] });
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return cleanupListeners;
    }

    // Set up the listeners
    try {
      // Initial fetch for transactions
      const fetchTransactionsOnce = async () => {
        try {
          const { data: transactionsData, error: trxError } = await supabase
            .from('transactions')
            .select('*')
            .eq('uid', user.id)
            .order('date', { ascending: false });
          if (trxError) throw trxError;

          const transactions = (transactionsData || []).map((t) =>
            normalizeTransaction({
              ...t,
              id: t.id,
              date: t.date ? new Date(t.date) : t.created_at ? new Date(t.created_at) : new Date(),
            })
          );
          dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: transactions });
        } catch (error) {
          if (isMounted) handleFetchError(error, 'transactions');
        }
      };

      // Initial fetch for budgets
      const fetchBudgetsOnce = async () => {
        try {
          const { data: budgetsData, error: budgetsError } = await supabase
            .from('budgets')
            .select('*')
            .eq('uid', user.id)
            .order('created_at', { ascending: false });
          if (budgetsError) throw budgetsError;

          const budgets = (budgetsData || [])
            .map((doc) => ({
              ...doc,
              id: doc.id,
              amount: Number(doc.amount),
              createdAt: doc.created_at ? new Date(doc.created_at) : new Date(doc.createdAt),
              updatedAt: doc.updated_at ? new Date(doc.updated_at) : new Date(doc.updatedAt),
            }))
            .filter((budget) => budget.category && !isNaN(budget.amount));
          dispatch({ type: ACTIONS.SET_BUDGETS, payload: budgets });
          dispatch({ type: ACTIONS.SET_ERROR, payload: null });
        } catch (error) {
          if (isMounted) handleFetchError(error, 'budgets');
        }
      };

      // Fetch both once (run inside an async function to avoid top-level await)
      (async () => {
        try {
          await Promise.all([fetchTransactionsOnce(), fetchBudgetsOnce()]);
        } catch (error) {
          if (isMounted) handleFetchError(error, 'setup');
        }
      })();

      // Realtime subscriptions using Supabase Realtime
      const transactionsChannel = supabase
        .channel(`public:transactions:uid=${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'transactions', filter: `uid=eq.${user.id}` },
          () => {
            // For robustness, re-fetch (could patch state from payload for better perf)
            fetchTransactionsOnce();
          }
        )
        .subscribe();

      const budgetsChannel = supabase
        .channel(`public:budgets:uid=${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'budgets', filter: `uid=eq.${user.id}` },
          () => {
            fetchBudgetsOnce();
          }
        )
        .subscribe();

      // Replace cleanup handles
      unsubscribeTransactions = () => transactionsChannel.unsubscribe();
      unsubscribeBudgets = () => budgetsChannel.unsubscribe();

      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      console.error('Setup error:', error);
      if (isMounted) handleFetchError(error, 'setup');
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      cleanupListeners();
    };
  }, [user, handleFetchError, retryCount]);

  // Action creators
  const setLoading = (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  const setTransactions = (transactions) =>
    dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: transactions });
  const addTransaction = async (transaction) => {
    try {
      if (!user || !user.id) {
        throw new Error('User must be authenticated to add a transaction');
      }

      console.log('Adding transaction:', transaction);

      // Validate transaction data
      if (!transaction.amount || isNaN(transaction.amount)) {
        throw new Error('Invalid amount');
      }
      if (!transaction.category) {
        throw new Error('Category is required');
      }
      if (!transaction.date) {
        throw new Error('Date is required');
      }

      const transactionData = {
        ...transaction,
        uid: user.id,
        amount: Number(transaction.amount),
        date:
          transaction.date instanceof Date
            ? transaction.date.toISOString()
            : new Date(transaction.date).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();
      if (error) throw error;

      const newTransaction = normalizeTransaction({ ...data, id: data.id });
      dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: newTransaction });

      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to add transaction: ${error.message}` });
      throw error;
    }
  };
  const updateTransaction = async (transaction) => {
    try {
      if (!user || !user.id) {
        throw new Error('User must be authenticated to update a transaction');
      }

      if (!transaction.id) {
        throw new Error('Transaction ID is required for updates');
      }

      // Validate transaction data
      if (!transaction.amount || isNaN(transaction.amount)) {
        throw new Error('Invalid amount');
      }
      if (!transaction.category) {
        throw new Error('Category is required');
      }
      if (!transaction.date) {
        throw new Error('Date is required');
      }

      // Prepare update data
      const updateData = {
        ...transaction,
        uid: user.id,
        amount: Number(transaction.amount),
        date:
          transaction.date instanceof Date
            ? transaction.date.toISOString()
            : new Date(transaction.date).toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Updating transaction with ID:', transaction.id);

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transaction.id)
        .select()
        .single();
      if (error) throw error;

      const updatedTransaction = normalizeTransaction({ ...data, id: data.id });

      dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: updatedTransaction });
      console.log('Transaction updated successfully');

      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      console.error('Error details:', error.message);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: `Failed to update transaction: ${error.message}`,
      });
      throw error;
    }
  };
  const deleteTransaction = async (id) => {
    try {
      if (!user || !user.id) {
        throw new Error('User must be authenticated to delete a transaction');
      }

      // Verify ownership
      const { data: existing, error: getError } = await supabase
        .from('transactions')
        .select('uid')
        .eq('id', id)
        .single();
      if (getError) throw getError;
      if (!existing || existing.uid !== user.id)
        throw new Error('Unauthorized to delete this transaction');

      console.log('Deleting transaction with ID:', id);
      const { error: delError } = await supabase.from('transactions').delete().eq('id', id);
      if (delError) throw delError;

      // Update local state
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
      console.log('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      const errorMessage =
        error.code === 'permission-denied'
          ? 'You do not have permission to delete this transaction'
          : error.message;
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: `Failed to delete transaction: ${errorMessage}`,
      });
      throw error;
    }
  };
  const setBudgets = (budgets) => dispatch({ type: ACTIONS.SET_BUDGETS, payload: budgets });

  const addBudget = async (budget) => {
    try {
      if (!user || !user.id) {
        throw new Error('User must be authenticated to add a budget');
      }

      console.log('Adding budget:', budget);

      // Prepare budget data
      const budgetData = {
        ...budget,
        uid: user.id,
        amount: Number(budget.amount),
        period: budget.period || 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from('budgets').insert(budgetData).select().single();
      if (error) throw error;

      const newBudget = {
        ...data,
        id: data.id,
        amount: Number(data.amount),
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      };

      dispatch({ type: ACTIONS.ADD_BUDGET, payload: newBudget });
      console.log('Local state updated with new budget:', newBudget);

      return newBudget;
    } catch (error) {
      console.error('Error adding budget:', error);
      console.error('Error details:', error.message);
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to add budget: ${error.message}` });
      throw error;
    }
  };

  const updateBudget = async (budget) => {
    try {
      if (!user || !user.id) {
        throw new Error('User must be authenticated to update a budget');
      }

      if (!budget.id) {
        throw new Error('Budget ID is required for updates');
      }

      // Prepare update data
      const updateData = {
        ...budget,
        uid: user.id,
        amount: Number(budget.amount),
        updated_at: new Date().toISOString(),
      };

      console.log('Updating budget with ID:', budget.id);

      const { data, error } = await supabase
        .from('budgets')
        .update(updateData)
        .eq('id', budget.id)
        .select()
        .single();
      if (error) throw error;

      const updatedBudget = {
        ...data,
        id: data.id,
        amount: Number(data.amount),
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      };

      dispatch({ type: ACTIONS.UPDATE_BUDGET, payload: updatedBudget });
      console.log('Budget updated successfully:', updatedBudget);

      return updatedBudget;
    } catch (error) {
      console.error('Error updating budget:', error);
      console.error('Error details:', error.message);
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to update budget: ${error.message}` });
      throw error;
    }
  };

  const deleteBudget = async (id) => {
    try {
      if (!user || !user.id) {
        throw new Error('User must be authenticated to delete a budget');
      }

      // Verify ownership
      const { data: existing, error: getError } = await supabase
        .from('budgets')
        .select('uid')
        .eq('id', id)
        .single();
      if (getError) throw getError;
      if (!existing || existing.uid !== user.id)
        throw new Error('Unauthorized to delete this budget');

      console.log('Deleting budget with ID:', id);
      const { error: delError } = await supabase.from('budgets').delete().eq('id', id);
      if (delError) throw delError;

      dispatch({ type: ACTIONS.DELETE_BUDGET, payload: id });
      console.log('Budget deleted successfully');
    } catch (error) {
      console.error('Error deleting budget:', error);
      const errorMessage =
        error.code === 'permission-denied'
          ? 'You do not have permission to delete this budget'
          : error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to delete budget: ${errorMessage}` });
      throw error;
    }
  };

  const setError = (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  const clearError = () => dispatch({ type: ACTIONS.CLEAR_ERROR });

  // Analysis setter for AI results
  const setAnalysis = (analysis) => dispatch({ type: ACTIONS.SET_ANALYSIS, payload: analysis });

  // Memoized selectors for analytics and AI usage
  const monthlyExpenses = useMemo(() => {
    return state.transactions.reduce((acc, t) => {
      const month = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
      if (t.type === 'expense') {
        acc[month] = (acc[month] || 0) + Math.abs(t.amount);
      }
      return acc;
    }, {});
  }, [state.transactions]);

  const weeklySpending = useMemo(() => {
    const days = 7;
    const now = new Date();
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      const total = state.transactions.reduce((sum, t) => {
        const tDate = t.date instanceof Date ? t.date : new Date(t.date);
        const tKey = tDate.toISOString().slice(0, 10);
        return t.type === 'expense' && tKey === key ? sum + Math.abs(t.amount) : sum;
      }, 0);
      result.push({ date: key, total });
    }
    return result;
  }, [state.transactions]);

  const categoryTotals = useMemo(() => {
    return state.transactions.reduce((acc, t) => {
      const cat = t.category || 'Uncategorized';
      if (t.type === 'expense') {
        acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
      }
      return acc;
    }, {});
  }, [state.transactions]);

  const value = {
    ...state,
    setLoading,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    setError,
    clearError,
    // New helpers & selectors
    setAnalysis,
    monthlyExpenses,
    weeklySpending,
    categoryTotals,
  };

  return (
    <FinanceContext.Provider value={value}>
      {state.error && <RetryError error={state.error} onRetry={retryFetch} />}
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export default FinanceContext;
