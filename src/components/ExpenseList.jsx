import React from 'react';
import { useFinance } from '../context/FinanceContext';

const ExpenseList = ({ expenses }) => {
    const { deleteTransaction } = useFinance();
    console.log('Expenses in ExpenseList:', expenses);

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    if (expenses.length === 0) {
        return (
            <div className="bg-white p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10 rounded-2xl shadow-xl text-center border border-gray-200">
                <p className="text-gray-500">No expenses logged yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-3 md:mb-4 lg:mb-6 text-gray-800">Recent Expenses</h2>
            <div className="space-y-4">
                {expenses.map(expense => (
                    <div key={expense.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p className="font-bold text-gray-700">{expense.category}</p>
                            <p className="text-sm text-gray-500">{expense.date}</p>
                            {expense.note && <p className="text-sm text-gray-600 italic">"{expense.note}"</p>}
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-red-500">- ${expense.amount.toFixed(2)}</p>
                            <button onClick={() => handleDelete(expense.id)} className="text-xs text-gray-400 hover:text-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;

