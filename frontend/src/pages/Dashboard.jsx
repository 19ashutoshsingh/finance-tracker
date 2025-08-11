import React, { useEffect, useContext, useMemo } from 'react';
import Layout from '../components/core/Layout';
import TransactionList from '../components/expenses/TransactionList';
import ExpenseChart from '../components/charts/ExpenseChart';
import IncomeChart from '../components/charts/IncomeChart';
import { TransactionContext } from '../context/TransactionContext';
import { FaPiggyBank, FaCreditCard, FaWallet } from 'react-icons/fa';

const Dashboard = () => {
    // Get all state and functions from the global context
    const { transactions, getTransactions, deleteTransaction, loading } = useContext(TransactionContext);

    // Fetch transactions when the component loads
    useEffect(() => {
        getTransactions();
    }, [getTransactions]);

    // useMemo will prevent recalculating on every render, only when transactions change
    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);
        return { totalIncome: income, totalExpense: expense, balance: income - expense };
    }, [transactions]);

    const incomeTransactions = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
    const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);
    const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

    // Display a loading state while fetching data
    if (loading && transactions.length === 0) {
        return <Layout><p className="text-center text-theme-text-secondary mt-8">Loading transactions...</p></Layout>;
    }

    return (
        <Layout>
            {/* Summary Cards with new theme */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-theme-text-secondary">Balance</h3>
                    <p className="text-3xl font-bold text-theme-text-primary">₹{balance.toFixed(2)}</p>
                </div>
                <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-theme-text-secondary">Income</h3>
                    <p className="text-3xl font-bold text-theme-accent-green">+₹{totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                    <h3 className="text-lg font-semibold text-theme-text-secondary">Expenses</h3>
                    <p className="text-3xl font-bold text-theme-accent-red">-₹{totalExpense.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Recent Transactions List */}
                <div>
                    <TransactionList
                        transactions={recentTransactions}
                        onDelete={deleteTransaction}
                        showViewAllButton={transactions.length > 5} // Conditionally show the button
                    />
                </div>

                {/* Right Column: Charts */}
                <div className="space-y-8">
                    <IncomeChart transactions={incomeTransactions} />
                    <ExpenseChart expenses={expenseTransactions} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;