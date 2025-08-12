import React, { useState, useEffect, useContext, useMemo } from 'react';
import Layout from '../components/core/Layout';
import TransactionList from '../components/expenses/TransactionList';
import ExpenseChart from '../components/charts/ExpenseChart';
import IncomeChart from '../components/charts/IncomeChart';
import { TransactionContext } from '../context/TransactionContext';
import Modal from '../components/core/Modal';
import TransactionForm from '../components/expenses/TransactionForm';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const Dashboard = () => {
    const { transactions, getTransactions, deleteTransaction } = useContext(TransactionContext);

    // State and handlers for the Add/Edit modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const handleOpenModal = (transaction = null) => {
        setTransactionToEdit(transaction);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setTransactionToEdit(null);
    };

    useEffect(() => {
        getTransactions();
    }, [getTransactions]);

    // Memoized calculations
    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        return { income, expense, balance: income - expense };
    }, [transactions]);
    
    const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);
    const incomeTransactions = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
    const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);
    const expenseInsight = useMemo(() => { /* ... */ });
    const incomeInsight = useMemo(() => { /* ... */ });

    return (
        <>
            <Layout onAddTransactionClick={() => handleOpenModal()}>
                {/* ✅ Summary Cards JSX is now directly here */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 wow animate__animated animate__fadeIn">
                    {/* Total Balance Card */}
                    <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                        <h3 className="text-lg font-semibold text-theme-text-secondary">Total Balance</h3>
                        <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-theme-accent-green' : 'text-theme-accent-red'}`}>
                            ₹{summary.balance.toFixed(2)}
                        </p>
                    </div>
                    {/* Total Income Card */}
                    <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                        <h3 className="text-lg font-semibold text-theme-text-secondary">Total Income</h3>
                        <p className="text-2xl font-bold text-theme-accent-green">
                            +₹{summary.income.toFixed(2)}
                        </p>
                    </div>
                    {/* Total Expense Card */}
                    <div className="bg-theme-surface p-6 rounded-2xl shadow-md">
                        <h3 className="text-lg font-semibold text-theme-text-secondary">Total Expense</h3>
                        <p className="text-2xl font-bold text-theme-accent-red">
                            -₹{summary.expense.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 wow animate__animated animate__fadeIn">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <TransactionList
                            transactions={recentTransactions}
                            onDelete={deleteTransaction}
                            onEditClick={handleOpenModal}
                            showViewAllButton={transactions.length > 5}
                        />
                    </div>

                    {/* Right Column: Charts */}
                    <div className="space-y-6">
                        <IncomeChart transactions={incomeTransactions} />
                        <ExpenseChart expenses={expenseTransactions} />
                    </div>
                </div>
            </Layout>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Transaction">
                <TransactionForm onFormSubmit={handleCloseModal} transactionToEdit={transactionToEdit} />
            </Modal>
        </>
    );
};

export default Dashboard;