import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import Modal from './Modal';
import TransactionForm from '../expenses/TransactionForm';
import { FaSignOutAlt, FaUserCircle, FaPlus } from 'react-icons/fa';
import logo from "../../assets/logo.png"

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { addTransaction } = useContext(TransactionContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleTransactionAddedAndCloseModal = async (newTransactionData) => {
        try {
            await addTransaction(newTransactionData);
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to add transaction:", error);
        }
    };

    return (
        <>
            <header className="shadow-sm">
                <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    <Link to="/dashboard" className="flex items-center">
                        <img src={logo} alt="FinanceTracker Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-theme-primary">FinanceTracker</span>
                    </Link>
                    <div className="flex items-center">
                        {user ? (
                            <>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="hidden sm:flex items-center bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300 mr-4"
                                >
                                    <FaPlus className="mr-2" /> Add Transaction
                                </button>
                                
                                {/* ✅ Corrected the text color here */}
                                <span className="text-theme-text-secondary mr-4 hidden sm:block">
                                    <FaUserCircle className="inline mr-2" /> Welcome!
                                </span>

                                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center">
                                   <FaSignOutAlt className="mr-2" /> Logout
                                </button>
                            </>
                        ) : (
                             <>
                                {/* ✅ Adjusted Login link color for new theme */}
                                <Link to="/login" className="text-theme-text-secondary hover:text-theme-text-primary px-3 py-2 font-semibold">Login</Link>
                                <Link to="/register" className="bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300">Register</Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* Floating Action Button (FAB) - Mobile */}
            {user && (
                 <button
                    onClick={() => setModalOpen(true)}
                    className="sm:hidden fixed bottom-6 right-6 bg-theme-primary hover:opacity-90 text-white font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
                >
                    <FaPlus size={24} />
                </button>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Transaction">
                <TransactionForm
                    onTransactionAdded={handleTransactionAddedAndCloseModal}
                />
            </Modal>
        </>
    );
};

export default Header;