import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaTrash, FaUtensils, FaCar, FaFilm, FaLightbulb, FaBoxOpen,
    FaMoneyBillWave, FaGift, FaBriefcase, FaPlusCircle, FaPencilAlt
} from 'react-icons/fa';

const categoryIcons = {
    // ... your categoryIcons object ...
    'Food': <FaUtensils className="text-orange-500" />,
    'Transport': <FaCar className="text-blue-500" />,
    'Entertainment': <FaFilm className="text-purple-500" />,
    'Utilities': <FaLightbulb className="text-yellow-500" />,
    'Other Expense': <FaBoxOpen className="text-gray-500" />,
    'Salary': <FaMoneyBillWave className="text-green-500" />,
    'Bonus': <FaGift className="text-pink-500" />,
    'Freelance': <FaBriefcase className="text-indigo-500" />,
    'Other Income': <FaPlusCircle className="text-teal-500" />
};

const TransactionList = ({ transactions, onDelete, onEditClick, showViewAllButton = false }) => {
    return (
        <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-theme-text-primary">
                    {showViewAllButton ? 'Recent Transactions' : 'All Transactions'}
                </h2>
                {showViewAllButton && (
                    <Link
                        to="/transactions"
                        className="bg-gray-100 hover:bg-gray-200 text-theme-text-secondary text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        View All
                    </Link>
                )}
            </div>
            
            <div className="space-y-2">
                {transactions.length === 0 ? (
                    <p className="text-theme-text-secondary text-center py-4">No transactions yet.</p>
                ) : (
                    transactions.map(transaction => (
                        <div key={transaction._id} className="flex items-center p-4 border-b border-gray-100 last:border-b-0">
                            {/* Icon container */}
                            <div className="mr-4 text-2xl">
                                {categoryIcons[transaction.category] || <FaBoxOpen className="text-gray-500" />}
                            </div>

                            {/* Transaction details */}
                            <div className="flex-grow min-w-0">
                                {/* ✅ The 'truncate' class is now conditional */}
                                <p className={`font-semibold text-theme-text-primary ${showViewAllButton ? 'truncate' : ''}`}>
                                    {transaction.description}
                                </p>
                                <p className="text-sm text-theme-text-secondary">{new Date(transaction.date).toLocaleDateString()}</p>
                            </div>

                            {/* Amount and action buttons */}
                            <div className="flex items-center ml-4">
                                <span className={`text-md font-bold mr-4 whitespace-nowrap ${transaction.type === 'income' ? 'text-theme-accent-green' : 'text-theme-accent-red'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                                </span>
                                
                                {/* {onEditClick && (
                                    <button onClick={() => onEditClick(transaction)} className="text-gray-400 hover:text-theme-primary transition-colors">
                                        <FaPencilAlt size={16} />
                                    </button>
                                )} */}
                                
                                <button onClick={() => onDelete(transaction._id)} className="text-gray-400 hover:text-theme-accent-red transition-colors ml-3">
                                    <FaTrash size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionList;