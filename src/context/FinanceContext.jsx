import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import RetryError from '../components/common/RetryError';

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
  const [retryCount, setRetryCount] = React.useState(0);
  const [isActive, setIsActive] = useState(true);
  const maxRetries = 3;

  const handleFetchError = useCallback((error, source) => {
    console.error(`Error fetching ${source}:`, error);
    
    // Handle specific Firebase errors
    if (error.code === 'permission-denied') {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'You do not have permission to access this data. Please log out and log in again.' });
      return;
    }
    
    if (error.code === 'failed-precondition') {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Unable to load data. Please check your connection and try again.' });
      return;
    }
    
    dispatch({ 
      type: ACTIONS.SET_ERROR, 
      payload: `Unable to load ${source}. Please check your connection and try again.`
    });
  }, []);

  // Load data when user changes
  useEffect(() => {
    let cleanup = false;

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
      // Transactions listener
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('uid', '==', user.uid),
        orderBy('date', 'desc')
      );

      unsubscribeTransactions = onSnapshot(transactionsQuery, {
        next: (snapshot) => {
          if (!mounted) return;
          const transactions = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            amount: Number(doc.data().amount),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
          }));
          dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: transactions });
        },
        error: (error) => {
          console.error('Transactions listener error:', error);
          if (mounted) handleFetchError(error, 'transactions');
        }
      });

      // Budgets listener
      const budgetsQuery = query(
        collection(db, 'budgets'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      unsubscribeBudgets = onSnapshot(budgetsQuery, {
        next: (snapshot) => {
          if (!mounted) return;
          const budgets = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            amount: Number(doc.data().amount),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
            updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt)
          })).filter(budget => budget.category && !isNaN(budget.amount));
          dispatch({ type: ACTIONS.SET_BUDGETS, payload: budgets });
          dispatch({ type: ACTIONS.SET_ERROR, payload: null });
        },
        error: (error) => {
          console.error('Budgets listener error:', error);
          if (mounted) handleFetchError(error, 'budgets');
        }
      });

      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      console.error('Setup error:', error);
      if (mounted) handleFetchError(error, 'setup');
    }

    // Cleanup on unmount
    return () => {
      cleanup = true;
      cleanupListeners();
    };
  }, [user, handleFetchError]);

  // Action creators
  const setLoading = (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  const setTransactions = (transactions) => dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: transactions });
  const addTransaction = async (transaction) => {
    try {
      if (!user) {
        throw new Error('No authenticated user found');
      }

      if (!user.uid) {
        throw new Error('User ID is missing');
      }

      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      
      console.log('Adding transaction:', transaction);
      console.log('Current user:', user);
      console.log('User ID:', user.uid);
      console.log('Using database instance:', db);

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
        uid: user.uid,
        createdAt: serverTimestamp(),
        amount: Number(transaction.amount),
        updatedAt: serverTimestamp()
      };

      console.log('Preparing to save transaction data:', transactionData);

      const docRef = await addDoc(collection(db, 'transactions'), transactionData);

      console.log('Transaction added with ID:', docRef.id);

      // Add to local state with the generated ID
      const newTransaction = {
        ...transactionData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: newTransaction });
      console.log('Local state updated with new transaction');

      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      console.error('Error details:', error.message);
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to add transaction: ${error.message}` });
      throw error;
    }
  };
  const updateTransaction = async (transaction) => {
    try {
      if (!user || !user.uid) {
        throw new Error('User must be authenticated to update a transaction');
      }

      if (!transaction.id) {
        throw new Error('Transaction ID is required for updates');
      }

      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      
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
        uid: user.uid,
        amount: Number(transaction.amount),
        updatedAt: serverTimestamp()
      };

      console.log('Updating transaction with ID:', transaction.id);
      console.log('Update data:', updateData);

      // Update in Firestore
      await updateDoc(doc(db, 'transactions', transaction.id), updateData);
      
      // Update local state with the new data
      const updatedTransaction = {
        ...updateData,
        id: transaction.id,
        updatedAt: new Date()
      };

      dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: updatedTransaction });
      console.log('Transaction updated successfully');
      
      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      console.error('Error details:', error.message);
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to update transaction: ${error.message}` });
      throw error;
    }
  };
  const deleteTransaction = async (id) => {
    try {
      if (!user || !user.uid) {
        throw new Error('User must be authenticated to delete a transaction');
      }

      const { deleteDoc, doc, getDoc } = await import('firebase/firestore');
      
      // First, get the document to verify ownership
      const transactionRef = doc(db, 'transactions', id);
      const transactionDoc = await getDoc(transactionRef);
      
      if (!transactionDoc.exists()) {
        throw new Error('Transaction not found');
      }

      const transactionData = transactionDoc.data();
      if (transactionData.uid !== user.uid) {
        throw new Error('Unauthorized to delete this transaction');
      }

      console.log('Deleting transaction with ID:', id);
      await deleteDoc(transactionRef);
      
      // Update local state
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
      console.log('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      const errorMessage = error.code === 'permission-denied' 
        ? 'You do not have permission to delete this transaction' 
        : error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to delete transaction: ${errorMessage}` });
      throw error;
    }
  };
  const setBudgets = (budgets) => dispatch({ type: ACTIONS.SET_BUDGETS, payload: budgets });
  
  const addBudget = async (budget) => {
    try {
      if (!user || !user.uid) {
        throw new Error('User must be authenticated to add a budget');
      }

      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      console.log('Adding budget:', budget);
      
      // Prepare budget data
      const budgetData = {
        ...budget,
        uid: user.uid,
        amount: Number(budget.amount),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Ensure all required fields are present
        category: budget.category,
        period: budget.period || 'monthly', // Default to monthly if not specified
      };

      console.log('Prepared budget data:', budgetData);
      
      const docRef = await addDoc(collection(db, 'budgets'), budgetData);
      console.log('Budget added with ID:', docRef.id);

      // Create the complete budget object for local state
      const newBudget = {
        ...budgetData,
        id: docRef.id,
        amount: Number(budgetData.amount), // Ensure amount is a number
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Update local state immediately
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
      if (!user || !user.uid) {
        throw new Error('User must be authenticated to update a budget');
      }

      if (!budget.id) {
        throw new Error('Budget ID is required for updates');
      }

      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      
      // Prepare update data
      const updateData = {
        ...budget,
        uid: user.uid,
        amount: Number(budget.amount),
        updatedAt: serverTimestamp()
      };

      console.log('Updating budget with ID:', budget.id);
      console.log('Update data:', updateData);

      // Update in Firestore
      await updateDoc(doc(db, 'budgets', budget.id), updateData);
      
      // Update local state with the new data
      const updatedBudget = {
        ...updateData,
        id: budget.id,
        updatedAt: new Date()
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
      if (!user || !user.uid) {
        throw new Error('User must be authenticated to delete a budget');
      }

      const { doc, deleteDoc, getDoc } = await import('firebase/firestore');
      
      // First, get the document to verify ownership
      const budgetRef = doc(db, 'budgets', id);
      const budgetDoc = await getDoc(budgetRef);
      
      if (!budgetDoc.exists()) {
        throw new Error('Budget not found');
      }

      const budgetData = budgetDoc.data();
      if (budgetData.uid !== user.uid) {
        throw new Error('Unauthorized to delete this budget');
      }

      console.log('Deleting budget with ID:', id);
      await deleteDoc(budgetRef);
      
      // Update local state
      dispatch({ type: ACTIONS.DELETE_BUDGET, payload: id });
      console.log('Budget deleted successfully');
    } catch (error) {
      console.error('Error deleting budget:', error);
      const errorMessage = error.code === 'permission-denied' 
        ? 'You do not have permission to delete this budget' 
        : error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: `Failed to delete budget: ${errorMessage}` });
      throw error;
    }
  };

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
      {state.error && (
        <RetryError
          error={state.error}
          onRetry={() => {
            clearError();
            setRetryCount(0);
          }}
        />
      )}
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