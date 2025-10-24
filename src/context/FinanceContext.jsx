import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
    console.log('FinanceContext useEffect triggered, user:', user);
    if (user) {
      console.log('Setting up Firebase listener for user:', user.uid);
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // Load transactions from Firebase
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('uid', '==', user.uid),
        orderBy('date', 'desc')
      );

      // Subscribe to transactions
      const unsubscribeTransactions = onSnapshot(transactionsQuery, (querySnapshot) => {
        console.log('Transactions snapshot received, docs count:', querySnapshot.size);
        const transactionsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const processedData = {
            ...data,
            id: doc.id,
            amount: Number(data.amount),
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
          };
          transactionsData.push(processedData);
        });
        console.log('All fetched transactions:', transactionsData);
        dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: transactionsData });
      }, (error) => {
        console.error("Error fetching transactions:", error);
        dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: [] });
      });

      // Set up budgets query with ordering
      const budgetsQuery = query(
        collection(db, 'budgets'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribeBudgets = onSnapshot(budgetsQuery, (querySnapshot) => {
        console.log('Budgets snapshot received, docs count:', querySnapshot.size);
        const budgetsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const processedData = {
            ...data,
            id: doc.id,
            amount: Number(data.amount),
            createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
          };
          // Ensure all required fields are present
          if (processedData.category && processedData.amount) {
            budgetsData.push(processedData);
          } else {
            console.warn('Skipping invalid budget data:', processedData);
          }
        });
        console.log('All fetched budgets:', budgetsData);
        dispatch({ type: ACTIONS.SET_BUDGETS, payload: budgetsData });
      }, (error) => {
        console.error("Error fetching budgets:", error);
        dispatch({ type: ACTIONS.SET_BUDGETS, payload: [] });
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch budgets' });
      });

      dispatch({ type: ACTIONS.SET_LOADING, payload: false });

      return () => {
        unsubscribeTransactions();
        unsubscribeBudgets();
      };
    } else {
      console.log('No user, clearing transactions');
      dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: [] });
      dispatch({ type: ACTIONS.SET_BUDGETS, payload: [] });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [user]);

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