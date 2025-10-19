import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold tracking-wider">FinanceTracker</h1>
                <div>
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        >
                            Logout
                        </button>
                    ) : (
                        <span className="text-gray-400">Welcome, Guest</span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

