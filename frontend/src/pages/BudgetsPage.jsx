import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Core Components
import Layout from '../components/core/Layout';
import Modal from '../components/core/Modal';

// Page Components
import TransactionForm from '../components/expenses/TransactionForm';
import BudgetComparisonChart from '../components/charts/BudgetComparisonChart';

// Context & Utils
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import { expenseCategories } from '../utils/categories';
import { FaArrowLeft } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BudgetsPage = () => {
    const { token } = useContext(AuthContext);
    const { transactions, getTransactions } = useContext(TransactionContext);

    const [budgets, setBudgets] = useState({});
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    
    // State and handlers for the "Add Transaction" modal
    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
        // Re-fetch transactions after adding a new one to update the chart and remaining amounts
        getTransactions(`month=${month}`);
    };

    useEffect(() => {
        if (!token) return;

        const fetchBudgets = async () => {
            const config = { headers: { 'x-auth-token': token }, params: { month } };
            try {
                const res = await axios.get(`${API_BASE_URL}/api/budgets`, config);
                const fetchedBudgets = res.data.reduce((acc, budget) => {
                    acc[budget.category] = budget.amount;
                    return acc;
                }, {});
                setBudgets(fetchedBudgets);
            } catch (err) { console.error("Failed to fetch budgets:", err); }
        };
        
        fetchBudgets();
        getTransactions(`month=${month}`);

    }, [month, token, getTransactions]);
    
    // Prepare data for the chart and the list
    const chartData = useMemo(() => {
        const spendingMap = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, transaction) => {
                acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
                return acc;
            }, {});
        
        return expenseCategories.map(cat => ({
            name: cat,
            budgeted: budgets[cat] || 0,
            spent: spendingMap[cat] || 0
        }));
    }, [transactions, budgets]);

    const handleBudgetChange = (category, amount) => {
        setBudgets(prev => ({ ...prev, [category]: amount }));
    };

    const handleSave = async (category) => {
        const amount = budgets[category];
        if (!amount || Number(amount) <= 0) {
            toast.error('Please enter a valid budget amount.');
            return;
        }
        const config = { headers: { 'x-auth-token': token } };
        const body = { category, amount: Number(amount), month };
        try {
            await axios.post(`${API_BASE_URL}/api/budgets`, body, config);
            toast.success(`${category} budget saved successfully!`);
        } catch (err) {
            toast.error(`Failed to save ${category} budget.`);
        }
    };

    return (
        <>
            <Layout onAddTransactionClick={handleOpenModal}>
                <div className="max-w-6xl mx-auto wow animate__animated animate__fadeIn">
                    <div className="mb-6">
                        <Link to="/dashboard" className="inline-flex items-center text-theme-primary hover:underline font-semibold">
                            <FaArrowLeft className="mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-theme-text-primary">Monthly Budgets</h1>
                        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="p-2 rounded-md bg-gray-100 border-2 border-gray-200"/>
                    </div>

                    <div className="bg-theme-surface p-6 rounded-2xl shadow-md mt-6 space-y-4">
                        {expenseCategories.map(cat => {
                            const budgetAmount = budgets[cat] || 0;
                            const spentAmount = chartData.find(d => d.name === cat)?.spent || 0;
                            const amountLeft = budgetAmount - spentAmount;
                            
                            return (
                                <div key={cat} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-4 last:border-b-0">
                                    <div>
                                        <p className="font-semibold text-lg text-theme-text-primary">{cat}</p>
                                        <p className={`text-sm font-medium ${amountLeft >= 0 ? 'text-theme-accent-green' : 'text-theme-accent-red'}`}>
                                            Remaining: ₹{amountLeft.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-theme-text-secondary">₹</span>
                                        <input 
                                            type="number"
                                            value={budgets[cat] || ''}
                                            placeholder="Set Budget"
                                            className="w-32 px-3 py-2 text-theme-text-primary bg-gray-100 border-2 border-gray-200 rounded-md"
                                            onChange={(e) => handleBudgetChange(cat, e.target.value)}
                                        />
                                        <button onClick={() => handleSave(cat)} className="py-2 px-4 font-bold text-white bg-theme-primary rounded-md hover:opacity-90 transition-opacity">Save</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <BudgetComparisonChart data={chartData} />

                </div>
            </Layout>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Transaction">
                <TransactionForm onFormSubmit={handleCloseModal} />
            </Modal>
        </>
    );
};

export default BudgetsPage;