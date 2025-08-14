import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import { FaSignOutAlt, FaPlus, FaBell, FaClipboardList } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ✅ The Header now receives onAddTransactionClick as a prop from its parent (Layout)
const Header = ({ onAddTransactionClick }) => {
    const { user, logout, token } = useContext(AuthContext);
    // ✅ The Header no longer needs to know about `addTransaction`
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
                    <Link to="/dashboard" className="flex items-center">
                        <img src={logo} alt="FinanceTracker Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-theme-primary ml-2">FinanceTracker</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link to="/budgets" className="text-theme-text-secondary hover:text-theme-primary px-3 py-2 font-semibold hidden md:block">
                                    Budgets
                                </Link>
                                <Link to="/budgets" className="text-theme-text-secondary hover:text-theme-primary md:hidden">
                                    <FaClipboardList size={22} />
                                </Link>
                                
                                <div className="relative mx-2" ref={alertsRef}>
                                    <button onClick={handleBellClick} className="text-theme-text-secondary hover:text-theme-primary mt-1">
                                        <FaBell size={22}/>
                                        {unreadAlertsCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{unreadAlertsCount}</span>
                                        )}
                                    </button>
                                    {showAlerts && (
                                        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-theme-surface rounded-lg shadow-xl z-50 border border-gray-100">
                                            <div className="flex justify-between items-center p-4 border-b">
                                                <h4 className="font-bold text-theme-text-primary">Notifications</h4>
                                                {unreadAlertsCount > 0 && (
                                                    <button onClick={handleClearAll} className="text-sm text-theme-primary font-semibold hover:underline">
                                                        Clear All
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-2 max-h-80 overflow-y-auto">
                                                {alerts.length > 0 ? alerts.map(alert => (
                                                    <div key={alert._id} className="p-2 border-b border-gray-100 last:border-0">
                                                        <p className="text-sm text-theme-text-secondary">{alert.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                                                    </div>
                                                )) : <p className="text-sm text-theme-text-secondary p-4 text-center">No new notifications.</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ✅ This button now calls the function passed down from the parent page */}
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
            
            {/* ✅ The floating action button for mobile also calls the same function */}
            {user && (
                <button
                    onClick={onAddTransactionClick}
                    className="md:hidden fixed bottom-6 right-6 bg-theme-primary hover:opacity-90 text-white font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
                >
                    <FaPlus size={24} />
                </button>
            )}
            
            {/* ❌ The Modal and TransactionForm are no longer rendered here */}
        </>
    );
};

export default Header;