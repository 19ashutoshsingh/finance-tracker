import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import Layout from '../components/core/Layout';
import TransactionList from '../components/expenses/TransactionList';
import ExpenseChart from '../components/charts/ExpenseChart';
import IncomeChart from '../components/charts/IncomeChart';
import Insights from '../components/dashboard/Insights';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/core/Modal';
import TransactionForm from '../components/expenses/TransactionForm';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    const { user, token } = useContext(AuthContext);
    const { transactions, getTransactions, deleteTransaction } = useContext(TransactionContext);

    const [isModalOpen, setModalOpen] = useState(false);
    const [insights, setInsights] = useState([]);
    const [insightsLoading, setInsightsLoading] = useState(true);
    
    const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

    useEffect(() => {
        getTransactions(`month=${currentMonth}`);

        const fetchInsights = async () => {
            if (!token) return;
            setInsightsLoading(true);
            try {
                const config = { 
                    headers: { 'x-auth-token': token },
                    params: { month: currentMonth } 
                };
                const res = await axios.get(`${API_BASE_URL}/api/insights`, config);
                setInsights(res.data);
            } catch (error) {
                console.error("Failed to fetch insights", error);
            } finally {
                setInsightsLoading(false);
            }
        };

        fetchInsights();

    }, [getTransactions, token, currentMonth]);

    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        return { income, expense, balance: income - expense };
    }, [transactions]);
    
    const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);
    const incomeTransactions = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
    const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

    return (
        <>
            <Layout onAddTransactionClick={() => setModalOpen(true)}>
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl sm:text-4xl font-bold text-theme-primary">
                        <span>👋</span>
                        <div>
                            <span className="font-semibold">Welcome Back,</span> {user?.name}!
                        </div>

                    </h1>
                </div>

                {/* ✅ Mobile Summary Card (Visible on small screens, hidden on md and up) */}
                <div className="md:hidden bg-theme-surface p-6 rounded-2xl shadow-md mb-6">
                    <h3 className="text-lg font-semibold text-theme-text-secondary">Total Balance</h3>
                    <p className={`text-3xl font-bold my-2 ${summary.balance >= 0 ? 'text-theme-accent-green' : 'text-theme-accent-red'}`}>
                        ₹{summary.balance.toFixed(2)}
                    </p>
                    <div className="border-t border-gray-200/50 mt-4 pt-4 flex justify-between">
                        <div>
                            <h4 className="text-md text-theme-text-secondary">Income</h4>
                            <p className="text-lg font-bold text-theme-accent-green">+₹{summary.income.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-md text-theme-text-secondary">Expenses</h4>
                            <p className="text-lg font-bold text-theme-accent-red">-₹{summary.expense.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* ✅ Desktop Summary Cards (Hidden on small screens, visible as a grid on md and up) */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                        <h3 className="text-lg font-semibold text-theme-text-secondary">Total Balance</h3>
                        <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-theme-accent-green' : 'text-theme-accent-red'}`}>
                            ₹{summary.balance.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                        <h3 className="text-lg font-semibold text-theme-text-secondary">Total Income</h3>
                        <p className="text-2xl font-bold text-theme-accent-green">
                            +₹{summary.income.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                        <h3 className="text-lg font-semibold text-theme-text-secondary">Total Expense</h3>
                        <p className="text-2xl font-bold text-theme-accent-red">
                            -₹{summary.expense.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <Insights insights={insights} loading={insightsLoading} />
                        <TransactionList 
                            transactions={recentTransactions} 
                            onDelete={deleteTransaction} 
                            showViewAllButton={transactions.length > 5} 
                        />
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <IncomeChart transactions={incomeTransactions} />
                        <ExpenseChart expenses={expenseTransactions} />
                    </div>
                </div>
            </Layout>
            
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Transaction">
                <TransactionForm onFormSubmit={() => setModalOpen(false)} />
            </Modal>
        </>
    );
};

export default Dashboard;