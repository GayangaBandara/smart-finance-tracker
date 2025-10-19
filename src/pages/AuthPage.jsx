import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Login Component
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Log In
                </button>
            </form>
        </div>
    );
};

// Signup Component
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
            <form onSubmit={handleSignup} className="space-y-4">
                <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

// Main Auth Page to toggle between Login and Signup
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                {isLogin ? <Login /> : <Signup />}
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 text-center w-full text-sm text-indigo-600 hover:text-indigo-500"
                >
                    {isLogin ? "Need an account? Sign Up" : "Have an account? Log In"}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;

