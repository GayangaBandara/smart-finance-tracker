import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext.jsx';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import TransactionList from './components/transactions/TransactionList.jsx';
import TransactionForm from './components/transactions/TransactionForm.jsx';
import BudgetOverview from './components/budget/BudgetOverview.jsx';
import BudgetForm from './components/budget/BudgetForm.jsx';

// Layout component for authenticated pages
const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

const App = () => {
  return (
    <FinanceProvider>
      <Router>
        <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                            <p className="text-gray-600">Manage your income and expenses</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-1">
                            <TransactionForm />
                          </div>
                          <div className="lg:col-span-2">
                            <TransactionList />
                          </div>
                        </div>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budgets"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
                            <p className="text-gray-600">Set and track your spending limits</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <BudgetForm />
                          <BudgetOverview />
                        </div>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600">Manage your account preferences</p>
                        {/* Settings components would go here */}
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </FinanceProvider>
  );
};

export default App;


