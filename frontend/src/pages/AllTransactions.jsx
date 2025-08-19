import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/core/Layout';
import TransactionList from '../components/expenses/TransactionList';
import { TransactionContext } from '../context/TransactionContext';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { incomeCategories, expenseCategories } from '../utils/categories';
import toast from 'react-hot-toast';

const AllTransactionsPage = () => {
    const { transactions, getTransactions, deleteTransaction, token } = useContext(TransactionContext);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        month: new Date().toISOString().slice(0, 7),
    });

    const fetchFilteredTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.category) params.append('category', filters.category);
            if (filters.month) params.append('month', filters.month);
            await getTransactions(params.toString());
        } catch (error) {
            console.error("Failed to fetch transactions", error);
            toast.error("Could not load transactions.");
        } finally {
            setLoading(false);
        }
    }, [filters, getTransactions]);

    useEffect(() => {
        fetchFilteredTransactions();
    }, [fetchFilteredTransactions]);

    const availableCategories = useMemo(() => {
        if (filters.type === 'income') return incomeCategories;
        if (filters.type === 'expense') return expenseCategories;
        return [...incomeCategories, ...expenseCategories];
    }, [filters.type]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        if (name === 'type') {
            newFilters.category = '';
        }
        setFilters(newFilters);
    };

    const handleExport = async () => {
        const exportToast = toast.loading('Exporting data...');
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.category) params.append('category', filters.category);
            if (filters.month) params.append('month', filters.month);

            const res = await fetch(`/api/transactions/export?${params.toString()}`, {
                headers: { 'x-auth-token': token }
            });

            if (!res.ok) throw new Error('Network response was not ok.');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const month = filters.month || 'all-time';
            a.download = `transactions-${month}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Export successful!', { id: exportToast });

        } catch (error) {
            console.error("Export failed", error);
            toast.error('Could not export transactions.', { id: exportToast });
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto wow animate__animated animate__fadeIn">
                <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center text-theme-primary hover:underline font-semibold">
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>
                
                <div className="flex justify-between items-center mb-4 px-2">
                    <h1 className="text-3xl font-bold text-theme-text-primary">All Transactions</h1>
                    
                    {/* ✅ This button's border-radius is now responsive */}
                    <button 
                        onClick={handleExport}
                        className="flex items-center bg-theme-primary text-white font-bold p-3 md:py-2 md:px-4 rounded-md md:rounded-full hover:opacity-90 transition-all disabled:opacity-50"
                        disabled={transactions.length === 0}
                        title="Export as CSV"
                    >
                        <FaDownload className="md:mr-2" />
                        <span className="hidden md:inline">Export CSV</span>
                    </button>
                </div>
                
                <div className="bg-theme-surface p-4 rounded-2xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-200 rounded-md">
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-200 rounded-md">
                        <option value="">All Categories</option>
                        {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <input type="month" name="month" value={filters.month} onChange={handleFilterChange} className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-200 rounded-md" />
                </div>
                
                {loading ? (
                    <div className="text-center p-10 font-semibold text-lg">Loading Transactions...</div>
                ) : (
                    <TransactionList transactions={transactions} onDelete={deleteTransaction} />
                )}
            </div>
        </Layout>
    );
};

export default AllTransactionsPage;