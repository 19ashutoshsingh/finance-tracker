import {
    FaUtensils, FaCar, FaFilm, FaLightbulb, FaBoxOpen, FaShoppingBag, FaHeartbeat, FaHome, FaBookOpen, FaSyncAlt,
    FaMoneyBillWave, FaGift, FaBriefcase, FaPlusCircle, FaChartLine, FaHandHoldingUsd, FaKey
} from 'react-icons/fa';
import React from 'react';

// ✅ Expanded expense categories
export const expenseCategories = [
    'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Housing', 'Education', 'Subscriptions', 'Other Expense'
];

// ✅ Expanded income categories
export const incomeCategories = [
    'Salary', 'Bonus', 'Freelance', 'Investments', 'Gifts', 'Rental Income', 'Other Income'
];

// ✅ Expanded icons map
export const categoryIcons = {
    // Expense Icons
    'Food': <FaUtensils className="text-orange-500" />,
    'Transport': <FaCar className="text-blue-500" />,
    'Entertainment': <FaFilm className="text-purple-500" />,
    'Utilities': <FaLightbulb className="text-yellow-500" />,
    'Shopping': <FaShoppingBag className="text-pink-500" />,
    'Health': <FaHeartbeat className="text-red-500" />,
    'Housing': <FaHome className="text-cyan-500" />,
    'Education': <FaBookOpen className="text-amber-600" />,
    'Subscriptions': <FaSyncAlt className="text-indigo-500" />,
    'Other Expense': <FaBoxOpen className="text-gray-500" />,

    
    // Income Icons
    'Salary': <FaMoneyBillWave className="text-green-500" />,
    'Bonus': <FaGift className="text-lime-500" />,
    'Freelance': <FaBriefcase className="text-sky-500" />,
    'Investments': <FaChartLine className="text-emerald-500" />,
    'Gifts': <FaHandHoldingUsd className="text-rose-400" />,
    'Rental Income': <FaKey className="text-yellow-600" />,
    'Other Income': <FaPlusCircle className="text-teal-500" />
};