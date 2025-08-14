import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/core/Layout';
import TransactionList from '../components/expenses/TransactionList';
import { TransactionContext } from '../context/TransactionContext';
import { FaArrowLeft } from 'react-icons/fa';
// ✅ Imports categories from the central file for consistency
import { incomeCategories, expenseCategories } from '../utils/categories';

const AllTransactionsPage = () => {
    const { transactions, getTransactions, deleteTransaction } = useContext(TransactionContext);
    
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        month: new Date().toISOString().slice(0, 7), // Defaults to the current month
    });

    // Fetches transactions whenever a filter is changed
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.category) params.append('category', filters.category);
        if (filters.month) params.append('month', filters.month);
        
        getTransactions(params.toString());
    }, [filters, getTransactions]);

    // Dynamically updates the available categories based on the selected type
    const availableCategories = useMemo(() => {
        if (filters.type === 'income') return incomeCategories;
        if (filters.type === 'expense') return expenseCategories;
        return [...incomeCategories, ...expenseCategories];
    }, [filters.type]);

    // Handles changes in the filter inputs
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        
        const newFilters = {
            ...filters,
            [name]: value,
        };

        // If the user changes the 'type', reset the 'category' filter
        if (name === 'type') {
            newFilters.category = '';
        }
        
        setFilters(newFilters);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto wow animate__animated animate__fadeIn">
                <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center text-theme-primary hover:underline font-semibold">
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-theme-text-primary">All Transactions</h1>
                
                <div className="bg-theme-surface p-4 rounded-2xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Type Filter */}
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-200 rounded-md">
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    {/* Dynamic Category Filter */}
                    <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-200 rounded-md">
                        <option value="">All Categories</option>
                        {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    {/* Month Filter */}
                    <input
                        type="month"
                        name="month"
                        value={filters.month}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-200 rounded-md"
                    />
                </div>
                
                <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            </div>
        </Layout>
    );
};

export default AllTransactionsPage;