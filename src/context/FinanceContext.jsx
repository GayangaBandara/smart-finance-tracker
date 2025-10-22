import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  transactions: [],
  budgets: [],
  loading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_BUDGETS: 'SET_BUDGETS',
  ADD_BUDGET: 'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
const financeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case ACTIONS.ADD_TRANSACTION:
      return { ...state, transactions: [...state.transactions, action.payload] };
    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case ACTIONS.SET_BUDGETS:
      return { ...state, budgets: action.payload };
    case ACTIONS.ADD_BUDGET:
      return { ...state, budgets: [...state.budgets, action.payload] };
    case ACTIONS.UPDATE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? action.payload : b
        ),
      };
    case ACTIONS.DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const FinanceContext = createContext();

// Provider component
export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const { user } = useAuth();

  // Load data when user changes
  useEffect(() => {
    if (user) {
      // Load transactions and budgets from Firebase
      // This will be implemented when we add the services
    } else {
      dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: [] });
      dispatch({ type: ACTIONS.SET_BUDGETS, payload: [] });
    }
  }, [user]);

  // Action creators
  const setLoading = (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  const setTransactions = (transactions) => dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: transactions });
  const addTransaction = (transaction) => dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transaction });
  const updateTransaction = (transaction) => dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: transaction });
  const deleteTransaction = (id) => dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  const setBudgets = (budgets) => dispatch({ type: ACTIONS.SET_BUDGETS, payload: budgets });
  const addBudget = (budget) => dispatch({ type: ACTIONS.ADD_BUDGET, payload: budget });
  const updateBudget = (budget) => dispatch({ type: ACTIONS.UPDATE_BUDGET, payload: budget });
  const deleteBudget = (id) => dispatch({ type: ACTIONS.DELETE_BUDGET, payload: id });
  const setError = (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  const clearError = () => dispatch({ type: ACTIONS.CLEAR_ERROR });

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
  };

  return (
    <FinanceContext.Provider value={value}>
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