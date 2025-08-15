import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaTrash, FaUtensils, FaCar, FaShoppingBag, FaLightbulb, 
    FaHeartbeat, FaFilm, FaMoneyBillWave, FaBriefcase, 
    FaChartLine, FaQuestionCircle 
} from 'react-icons/fa';

const categoryStyles = {
    'Food':         { color: 'bg-red-100 text-red-600',         icon: <FaUtensils /> },
    'Transport':    { color: 'bg-blue-100 text-blue-600',       icon: <FaCar /> },
    'Shopping':     { color: 'bg-purple-100 text-purple-600',   icon: <FaShoppingBag /> },
    'Utilities':    { color: 'bg-yellow-100 text-yellow-600',   icon: <FaLightbulb /> },
    'Health':       { color: 'bg-pink-100 text-pink-600',       icon: <FaHeartbeat /> },
    'Entertainment':{ color: 'bg-indigo-100 text-indigo-600',   icon: <FaFilm /> },
    'Salary':       { color: 'bg-green-100 text-green-600',     icon: <FaMoneyBillWave /> },
    'Freelance':    { color: 'bg-teal-100 text-teal-600',       icon: <FaBriefcase /> },
    'Investment':   { color: 'bg-cyan-100 text-cyan-600',       icon: <FaChartLine /> },
    'Other':        { color: 'bg-gray-100 text-gray-600',       icon: <FaQuestionCircle /> },
};

const TransactionList = ({ transactions, onDelete, showViewAllButton = false }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-theme-surface p-6 rounded-2xl shadow-md text-center">
                <h3 className="text-xl font-bold mb-2 text-theme-text-primary">No Transactions Yet</h3>
                <p className="text-theme-text-secondary">Click "Add Transaction" to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-theme-surface p-4 sm:p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-theme-text-primary">Recent Transactions</h3>
                {showViewAllButton && (
                    <Link to="/all-transactions" className="text-sm font-semibold text-theme-primary hover:underline">
                        View All
                    </Link>
                )}
            </div>
            <ul className="divide-y divide-gray-100">
                {transactions.map(transaction => {
                    const style = categoryStyles[transaction.category] || categoryStyles['Other'];
                    
                    const transactionDate = new Date(transaction.date);
                    const displayDate = transactionDate.toString() !== 'Invalid Date'
                        ? transactionDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'No Date';

                    const displayAmount = typeof transaction.amount === 'number'
                        ? transaction.amount.toFixed(2)
                        : '0.00';
                    
                    return (
                        <li key={transaction._id} className="flex items-center justify-between py-4 w-full gap-4">
                            <div className="flex items-center flex-1 min-w-0">
                                <span className={`flex-shrink-0 p-3 rounded-full ${style.color}`}>
                                    {style.icon}
                                </span>
                                <div className="ml-4 min-w-0">
                                    <p 
                                        className="font-semibold text-theme-text-primary break-words md:truncate" 
                                        title={transaction.description}
                                    >
                                        {transaction.description}
                                    </p>
                                    <p className="text-sm text-theme-text-secondary">{displayDate}</p>
                                </div>
                            </div>
                            
                            {/* ✅ This is the updated right-side layout */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-theme-accent-green' : 'text-theme-accent-red'}`}>
                                        {transaction.type === 'income' ? '+' : '-'}₹{displayAmount}
                                    </p>
                                    <p className="text-xs text-theme-text-secondary mt-1">
                                        {transaction.category}
                                    </p>
                                </div>
                                <button onClick={() => onDelete(transaction._id)} className="text-gray-400 hover:text-red-500">
                                    <FaTrash />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TransactionList;