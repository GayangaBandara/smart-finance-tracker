import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const ExpenseForm = () => {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (!user) {
            setError('You must be logged in to add an expense.');
            return;
        }

        try {
            await addDoc(collection(db, 'expenses'), {
                uid: user.uid,
                amount: parseFloat(amount),
                category,
                date,
                note,
                createdAt: serverTimestamp()
            });
            // Reset form fields after successful submission
            setAmount('');
            setCategory('Food');
            setDate(new Date().toISOString().slice(0, 10));
            setNote('');
            setError('');
        } catch (err) {
            console.error("Error adding expense:", err);
            setError('Failed to add expense. Please try again.');
        }
    };

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Expense</h2>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows="3"
                        placeholder="e.g., Lunch with colleagues"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                >
                    Add Expense
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;

