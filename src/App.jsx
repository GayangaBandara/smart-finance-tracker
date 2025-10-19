import React from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthPage from './pages/AuthPage.jsx';

const App = () => {
    const { user, loading } = useAuth();

    // Display a loading indicator while checking the authentication state.
    // This prevents a flash of the login page for already signed-in users.
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <p className="text-base md:text-lg font-semibold text-gray-600">Loading Application...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Navbar />
            <main>
                {/* Conditionally render the Dashboard or the AuthPage based on user's auth state */}
                {user ? <Dashboard /> : <AuthPage />}
            </main>
        </div>
    );
};

export default App;


