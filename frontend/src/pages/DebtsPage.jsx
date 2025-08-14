import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/core/Layout';
import { TransactionContext } from '../context/TransactionContext';
import { FaPlus, FaSearch, FaTrash, FaArrowLeft } from 'react-icons/fa';
import Modal from '../components/core/Modal';
import DebtForm from '../components/expenses/DebtForm';

const DebtsPage = () => {
    const { debts, getDebts, updateDebt, deleteDebt } = useContext(TransactionContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getDebts();
    }, [getDebts]);

    const filteredDebts = useMemo(() => {
        if (!searchTerm) return debts;
        return debts.filter(debt =>
            debt.person.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [debts, searchTerm]);

    const moneyLent = useMemo(() => filteredDebts.filter(d => d.type === 'lent'), [filteredDebts]);
    const moneyBorrowed = useMemo(() => filteredDebts.filter(d => d.type === 'borrowed'), [filteredDebts]);

    const DebtCard = ({ debt }) => (
        <div className={`p-4 rounded-lg shadow-md ${debt.status === 'paid' ? 'bg-green-100 text-gray-500' : 'bg-white'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-theme-text-primary">{debt.person}</p>
                    <p className="text-sm text-theme-text-secondary">{debt.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Due: {debt.dueDate && new Date(debt.dueDate).toString() !== 'Invalid Date' ? new Date(debt.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`font-bold text-xl ${debt.type === 'lent' ? 'text-theme-accent-red' : 'text-theme-accent-green'}`}>
                        {debt.type === 'lent' ? '-' : '+'}₹{(debt.amount || 0).toFixed(2)}
                    </p>
                    
                    {/* ✅ Corrected Button Logic Below */}
                    <div className="flex items-center justify-end gap-2 mt-2">
                        {/* The button now changes based on the status */}
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
                        
                        <button onClick={() => deleteDebt(debt._id)} className="text-red-500 hover:text-red-700">
                            <FaTrash />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="max-w-4xl mx-auto wow animate__animated animate__fadeIn">
                <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center text-theme-primary hover:underline font-semibold">
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-theme-text-primary">Debts & Loans</h1>
                    <button onClick={() => setModalOpen(true)} className="flex items-center bg-transparent border-2 border-theme-primary text-theme-primary font-bold py-2 px-4 rounded-full hover:bg-theme-primary hover:text-white transition-colors">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-theme-accent-red">Money I've Lent</h2>
                        <div className="space-y-4">
                            {moneyLent.length > 0 ? moneyLent.map(debt => <DebtCard key={debt._id} debt={debt} />) : <p className="text-theme-text-secondary">No records found.</p>}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-theme-accent-green">Money I've Borrowed</h2>
                        <div className="space-y-4">
                            {moneyBorrowed.length > 0 ? moneyBorrowed.map(debt => <DebtCard key={debt._id} debt={debt} />) : <p className="text-theme-text-secondary">No records found.</p>}
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add a New Record">
                <DebtForm onFormSubmit={() => setModalOpen(false)} />
            </Modal>
        </Layout>
    );
};

export default DebtsPage;