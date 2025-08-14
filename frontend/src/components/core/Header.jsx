import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import { FaSignOutAlt, FaPlus, FaBell, FaClipboardList, FaHandHoldingUsd } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Header = ({ onAddTransactionClick }) => {
    const { user, logout, token } = useContext(AuthContext);
    const { alerts, getAlerts } = useContext(TransactionContext); 
    
    const [showAlerts, setShowAlerts] = useState(false);
    const navigate = useNavigate();
    const alertsRef = useRef(null);

    useEffect(() => {
        if (token) {
            getAlerts();
        }
    }, [token, getAlerts]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (alertsRef.current && !alertsRef.current.contains(event.target)) {
                setShowAlerts(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [alertsRef]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleBellClick = () => {
        setShowAlerts(prev => !prev);
    };

    const handleClearAll = async () => {
        if (unreadAlertsCount === 0) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`${API_BASE_URL}/api/alerts/mark-read`, {}, config);
            getAlerts();
        } catch (err) {
            console.error("Failed to mark alerts as read", err);
        }
    };
    
    const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

    return (
        <>
            <header className="shadow-sm bg-theme-surface/80 backdrop-blur-sm sticky top-0 z-50">
                <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center">
                        <img src={logo} alt="Site Logo" className="h-10 w-auto" />
                        {/* ✅ This is the updated site name */}
                        <span className="text-xl font-bold text-theme-primary ml-2">
                            CashVue
                        </span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {user ? (
                            <>
                                <Link to="/debts" className="text-theme-text-secondary hover:text-theme-primary font-semibold hidden lg:block">
                                    Debts & Loans
                                </Link>
                                <Link to="/debts" className="text-theme-text-secondary hover:text-theme-primary p-2 rounded-full lg:hidden">
                                    <FaHandHoldingUsd size={22} />
                                </Link>

                                <Link to="/budgets" className="text-theme-text-secondary hover:text-theme-primary font-semibold hidden lg:block">
                                    Budgets
                                </Link>
                                <Link to="/budgets" className="text-theme-text-secondary hover:text-theme-primary p-2 rounded-full lg:hidden">
                                    <FaClipboardList size={22} />
                                </Link>
                                
                                <div className="relative" ref={alertsRef}>
                                    <button onClick={handleBellClick} className="text-theme-text-secondary hover:text-theme-primary p-2 rounded-full">
                                        <FaBell size={22}/>
                                        {unreadAlertsCount > 0 && (
                                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{unreadAlertsCount}</span>
                                        )}
                                    </button>
                                    {showAlerts && (
                                        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-theme-surface rounded-lg shadow-xl z-50 border border-gray-100">
                                            <div className="flex justify-between items-center p-4 border-b">
                                                <h4 className="font-bold text-theme-text-primary">Notifications</h4>
                                                {unreadAlertsCount > 0 && (
                                                    <button onClick={handleClearAll} className="text-sm text-theme-primary font-semibold hover:underline">
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-2 max-h-80 overflow-y-auto">
                                                {alerts.length > 0 ? alerts.map(alert => (
                                                    <div key={alert._id} className={`p-2 rounded-md ${!alert.isRead ? 'bg-sky-50' : ''}`}>
                                                        <p className="text-sm text-theme-text-secondary">{alert.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                                                    </div>
                                                )) : <p className="text-sm text-theme-text-secondary p-4 text-center">No new notifications.</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={onAddTransactionClick}
                                    className="hidden md:flex items-center bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                                >
                                    <FaPlus className="mr-2" /> Add Transaction
                                </button>

                                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition duration-300 flex items-center p-2 md:py-2 md:px-4 md:rounded-full">
                                   <FaSignOutAlt size={18} />
                                   <span className="hidden md:inline md:ml-2">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-theme-text-secondary hover:text-theme-text-primary px-3 py-2 font-semibold">Login</Link>
                                <Link to="/register" className="bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300">Register</Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>
            
            {user && (
                <button
                    onClick={onAddTransactionClick}
                    className="md:hidden fixed bottom-6 right-6 bg-theme-primary hover:opacity-90 text-white font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
                >
                    <FaPlus size={24} />
                </button>
            )}
        </>
    );
};

export default Header;