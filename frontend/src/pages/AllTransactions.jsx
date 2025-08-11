import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/core/Layout';
import TransactionList from '../components/expenses/TransactionList';
import { TransactionContext } from '../context/TransactionContext';
import { FaArrowLeft } from 'react-icons/fa';

const AllTransactionsPage = () => {
    // Get the full transactions list and delete function from the context
    const { transactions, deleteTransaction, getTransactions, loading } = useContext(TransactionContext);

    // Ensure transactions are loaded if the user navigates here directly
    useEffect(() => {
        if (transactions.length === 0) {
            getTransactions();
        }
    }, [transactions.length, getTransactions]);

    if (loading && transactions.length === 0) {
        return <Layout><p className="text-center text-gray-400 mt-8">Loading transactions...</p></Layout>;
    }

    return (
         <Layout>
            <div className="mb-6">
                <Link to="/dashboard" className="inline-flex items-center text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                    <FaArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold text-white mt-4">All Transactions</h1>
            </div>
             <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </Layout>
    );
};

export default AllTransactionsPage;