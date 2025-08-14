import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import Layout from '../components/core/Layout';
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import BudgetComparisonChart from '../components/charts/BudgetComparisonChart'; // ✅ 1. Import the new component
import { expenseCategories } from '../utils/categories';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BudgetsPage = () => {
    const { token } = useContext(AuthContext);
    const { transactions, getTransactions } = useContext(TransactionContext);

    const [budgets, setBudgets] = useState({});
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchBudgets = async () => {
            const config = { headers: { 'x-auth-token': token }, params: { month } };
            try {
                const res = await axios.get(`${API_BASE_URL}/api/budgets`, config);
                if (Array.isArray(res.data)) {
                    const fetchedBudgets = res.data.reduce((acc, budget) => {
                        acc[budget.category] = budget.amount;
                        return acc;
                    }, {});
                    setBudgets(fetchedBudgets);
                }
            } catch (err) { console.error("Failed to fetch budgets:", err); }
        };
        
        fetchBudgets();
        getTransactions(`month=${month}`);

    }, [month, token, getTransactions]);

    const spendingMap = useMemo(() => {
        return transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, transaction) => {
                const category = transaction.category;
                acc[category] = (acc[category] || 0) + transaction.amount;
                return acc;
            }, {});
    }, [transactions]);
    
    const handleBudgetChange = (category, amount) => {
        setBudgets(prev => ({ ...prev, [category]: amount }));
    };

    const handleSave = async (category) => {
        const amount = budgets[category];
        if (!amount || Number(amount) <= 0) {
            setMessage('Please enter a valid budget amount.');
            return;
        }
        const config = { headers: { 'x-auth-token': token } };
        const body = { category, amount: Number(amount), month };
        try {
            await axios.post(`${API_BASE_URL}/api/budgets`, body, config);
            setMessage(`${category} budget saved successfully!`);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(`Failed to save ${category} budget.`);
            console.error(err);
        }
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
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold mb-4 text-theme-text-primary">Monthly Budgets</h1>
                    <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="p-2 rounded-md bg-gray-100 border-2 border-gray-200"/>
                </div>
                
                {message && <p className="text-center p-2 rounded-md bg-green-100 text-green-800 mb-4">{message}</p>}

                <div className="bg-theme-surface p-6 rounded-2xl shadow-md space-y-4">
                    {expenseCategories.map(cat => {
                        const budgetAmount = budgets[cat] || 0;
                        const spentAmount = spendingMap[cat] || 0;
                        const amountLeft = budgetAmount - spentAmount;

                        // ✅ Updated JSX layout for each category row
                        return (
                            <div key={cat} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-4 last:border-b-0">
                                {/* Left Side: Category Name and Remaining Amount */}
                                <div>
                                    <p className="font-semibold text-lg text-theme-text-primary">{cat}</p>
                                    <p className={`text-sm font-medium ${amountLeft >= 0 ? 'text-theme-accent-green' : 'text-theme-accent-red'}`}>
                                    Remaining:
                                        ₹{amountLeft.toFixed(2)} 
                                    </p>
                                </div>
                                
                                {/* Right Side: Input and Save Button */}
                                <div className="flex items-center gap-2">
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
                <BudgetComparisonChart budgets={budgets} spendingMap={spendingMap} />

            </div>
        </Layout>
    );
};

export default BudgetsPage;