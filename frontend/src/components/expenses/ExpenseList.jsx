import React from 'react';
import { FaTrash } from 'react-icons/fa';

const ExpenseList = ({ expenses, onDelete }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Your Expenses</h2>
            <div className="space-y-4">
                {expenses.length === 0 ? (
                    <p className="text-gray-400">No expenses found. Add one to get started!</p>
                ) : (
                    expenses.map(expense => (
                        <div key={expense._id} className="flex justify-between items-center bg-gray-700 p-4 rounded-md">
                            <div>
                                <p className="text-lg font-semibold text-white">{expense.description}</p>
                                <p className="text-sm text-gray-400">{expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-teal-400 mr-4">${expense.amount.toFixed(2)}</span>
                                <button onClick={() => onDelete(expense._id)} className="text-red-500 hover:text-red-700">
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpenseList;