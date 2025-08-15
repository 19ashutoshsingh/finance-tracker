import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/core/Layout';
import { TransactionContext } from '../context/TransactionContext';
import { FaPlus, FaSearch, FaTrash, FaArrowLeft } from 'react-icons/fa';
import Modal from '../components/core/Modal';
import DebtForm from '../components/expenses/DebtForm.jsx';
import TransactionForm from '../components/expenses/TransactionForm.jsx';
import toast from 'react-hot-toast';

const DebtsPage = () => {
    const { debts = [], getDebts, updateDebt, deleteDebt } = useContext(TransactionContext);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDebtModalOpen, setDebtModalOpen] = useState(false);
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    
    const handleOpenTransactionModal = () => setTransactionModalOpen(true);
    const handleCloseTransactionModal = () => setTransactionModalOpen(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            await getDebts();
        } catch (error) {
            console.error("Failed to fetch debts", error);
            toast.error("Could not load ledger data.");
        } finally {
            setLoading(false);
        }
    }, [getDebts]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredDebts = useMemo(() => {
        if (!searchTerm) return debts;
        return debts.filter(debt =>
            debt.person.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [debts, searchTerm]);

    const moneyLent = useMemo(() => filteredDebts.filter(d => d.type === 'lent'), [filteredDebts]);
    const moneyBorrowed = useMemo(() => filteredDebts.filter(d => d.type === 'borrowed'), [filteredDebts]);

    const totalLent = useMemo(() => moneyLent.reduce((sum, debt) => sum + debt.amount, 0), [moneyLent]);
    const totalBorrowed = useMemo(() => moneyBorrowed.reduce((sum, debt) => sum + debt.amount, 0), [moneyBorrowed]);

    const DebtCard = ({ debt }) => (
        <div className={`p-4 rounded-lg shadow-md ${debt.status === 'paid' ? 'bg-green-100 text-gray-500' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
                {/* Left side: Person Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-theme-text-primary truncate" title={debt.person}>{debt.person}</p>
                    <p className="text-sm text-theme-text-secondary truncate" title={debt.description}>{debt.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Due: {debt.dueDate && new Date(debt.dueDate).toString() !== 'Invalid Date' ? new Date(debt.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                </div>

                {/* ✅ Right side: Actions (Updated Layout) */}
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="text-right">
                        <p className={`font-bold text-xl ${debt.type === 'lent' ? 'text-theme-accent-red' : 'text-theme-accent-green'}`}>
                            {debt.type === 'lent' ? '-' : '+'}₹{(debt.amount || 0).toFixed(2)}
                        </p>
                        <div className="mt-1">
                            <button 
                                onClick={() => updateDebt(debt._id)} 
                                className={`text-xs font-bold py-1 px-2 rounded-full hover:opacity-90 ${
                                    debt.status === 'pending' 
                                    ? 'bg-theme-primary text-white' 
                                    : 'bg-gray-300 text-gray-700'
                                }`}
                            >
                                {debt.status === 'pending' ? 'Mark as Paid' : 'Mark as Unpaid'}
                            </button>
                        </div>
                    </div>
                    <button onClick={() => deleteDebt(debt._id)} className="text-gray-400 hover:text-red-500">
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Layout onAddTransactionClick={handleOpenTransactionModal}>
                <div className="max-w-4xl mx-auto wow animate__animated animate__fadeIn">
                    <div className="mb-6">
                        <Link to="/dashboard" className="inline-flex items-center text-theme-primary hover:underline font-semibold">
                            <FaArrowLeft className="mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-theme-text-primary">Ledger</h1>
                        <button onClick={() => setDebtModalOpen(true)} className="flex items-center bg-transparent border-2 border-theme-primary text-theme-primary font-bold py-2 px-4 rounded-full hover:bg-theme-primary hover:text-white transition-colors">
                            <FaPlus className="mr-2" /> Add Record
                        </button>
                    </div>
                    
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search by person's name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 rounded-md bg-gray-100 border-2 border-gray-200"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    {loading ? (
                        <div className="text-center p-10 font-semibold text-lg">Loading Ledger...</div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-8 md:items-start">
                            {moneyLent.length > 0 && (
                                <div className="bg-theme-surface p-6 rounded-2xl shadow-md flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h2 className="text-xl font-semibold text-theme-accent-red">Money I've Lent</h2>
                                        <span className="font-bold text-lg text-theme-text-primary">
                                            Total: ₹{totalLent.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {moneyLent.map(debt => <DebtCard key={debt._id} debt={debt} />)}
                                    </div>
                                </div>
                            )}
                            
                            {moneyBorrowed.length > 0 && (
                                <div className="bg-theme-surface p-6 rounded-2xl shadow-md flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h2 className="text-xl font-semibold text-theme-accent-green">Money I've Borrowed</h2>
                                        <span className="font-bold text-lg text-theme-text-primary">
                                            Total: ₹{totalBorrowed.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {moneyBorrowed.map(debt => <DebtCard key={debt._id} debt={debt} />)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Layout>

            <Modal isOpen={isDebtModalOpen} onClose={() => setDebtModalOpen(false)} title="Add a New Record">
                <DebtForm onFormSubmit={() => setDebtModalOpen(false)} />
            </Modal>

            <Modal isOpen={isTransactionModalOpen} onClose={handleCloseTransactionModal} title="Add New Transaction">
                <TransactionForm onFormSubmit={handleCloseTransactionModal} />
            </Modal>
        </>
    );
};

export default DebtsPage;