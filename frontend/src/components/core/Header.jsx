import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import { 
    FaSignOutAlt, 
    FaPlus, 
    FaBell, 
    FaClipboardList, 
    FaHandHoldingUsd, 
    FaBars,       
    FaTimes       
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Header = ({ onAddTransactionClick }) => {
    const { user, logout, token } = useContext(AuthContext);
    const { alerts, getAlerts } = useContext(TransactionContext); 
    
    const [localAlerts, setLocalAlerts] = useState([]); 
    const [showAlerts, setShowAlerts] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
    const [mobileAlertsOpen, setMobileAlertsOpen] = useState(false); 
    const navigate = useNavigate();
    const alertsRef = useRef(null);
    const menuRef = useRef(null);

    // Load alerts from localStorage first
    useEffect(() => {
        const saved = localStorage.getItem("alerts");
        if (saved) {
            setLocalAlerts(JSON.parse(saved));
        }
    }, []);

    // Fetch alerts from backend
    useEffect(() => {
        if (token) {
            getAlerts();
        }
    }, [token, getAlerts]);

    // Sync context alerts into local state + localStorage
    useEffect(() => {
        if (alerts.length > 0) {
            setLocalAlerts(alerts);
            localStorage.setItem("alerts", JSON.stringify(alerts));
        }
    }, [alerts]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (alertsRef.current && !alertsRef.current.contains(event.target)) {
                setShowAlerts(false);
            }
            if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const handleBellClick = () => {
        setShowAlerts(prev => !prev);
    };

    const handleClearAll = async () => {
    if (unreadAlertsCount === 0) return;

    // ✅ Update local state and localStorage immediately
    const updated = localAlerts.map(alert => ({ ...alert, isRead: true }));
    setLocalAlerts(updated);
    localStorage.setItem("alerts", JSON.stringify(updated));

    // ✅ Update backend, but DON'T call getAlerts() immediately
    try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.post(`${API_BASE_URL}/api/alerts/mark-read`, {}, config);
        // Optionally: re-fetch after a small delay if needed
        // setTimeout(() => getAlerts(), 1000);
    } catch (err) {
        console.error("Failed to mark alerts as read", err);
    }
};

    
    const unreadAlertsCount = localAlerts.filter(a => !a.isRead).length;

    return (
        <>
            <header className="shadow-sm bg-theme-surface/80 backdrop-blur-sm sticky top-0 z-50">
                <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center">
                        <img src={logo} alt="Site Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-theme-primary ml-2">
                            CashVue
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-2 sm:gap-6">
                        {user ? (
                            <>
                                <Link to="/debts" className="text-theme-text-secondary hover:text-theme-primary font-semibold flex items-center">
                                    <FaHandHoldingUsd className="mr-1" /> Debts & Loans
                                </Link>
                                <Link to="/budgets" className="text-theme-text-secondary hover:text-theme-primary font-semibold flex items-center">
                                    <FaClipboardList className="mr-1" /> Budgets
                                </Link>
                                
                                {/* Notifications (Desktop) */}
                                <div className="relative" ref={alertsRef}>
                                    <button onClick={handleBellClick} className="text-theme-text-secondary hover:text-theme-primary p-2 rounded-full relative">
                                        <FaBell size={22}/>
                                        {unreadAlertsCount > 0 && (
                                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                                {unreadAlertsCount}
                                            </span>
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
                                                {localAlerts.length > 0 ? localAlerts.map(alert => (
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
                                    className="flex items-center bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                                >
                                    <FaPlus className="mr-2" /> Add Transaction
                                </button>

                                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition duration-300 flex items-center py-2 px-4 rounded-full">
                                   <FaSignOutAlt size={18} />
                                   <span className="ml-2">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-theme-text-secondary hover:text-theme-text-primary px-3 py-2 font-semibold">Login</Link>
                                <Link to="/register" className="bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300">Register</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    {user && (
                        <button 
                            onClick={() => setMobileMenuOpen(true)} 
                            className="lg:hidden text-theme-text-secondary hover:text-theme-primary p-2 rounded-full"
                        >
                            <FaBars size={22} />
                        </button>
                    )}
                </nav>
            </header>

            {/* Mobile Slider Menu */}
            <div ref={menuRef} className={`fixed top-0 right-0 h-full w-64 bg-theme-surface shadow-lg z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-theme-primary">Menu</h3>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-red-500">
                        <FaTimes size={22} />
                    </button>
                </div>
                <div className="flex flex-col p-4 gap-4">
                    <Link to="/debts" className="flex items-center text-theme-text-secondary hover:text-theme-primary font-semibold" onClick={() => setMobileMenuOpen(false)}>
                        <FaHandHoldingUsd className="mr-2" /> Debts & Loans
                    </Link>
                    <Link to="/budgets" className="flex items-center text-theme-text-secondary hover:text-theme-primary font-semibold" onClick={() => setMobileMenuOpen(false)}>
                        <FaClipboardList className="mr-2" /> Budgets
                    </Link>

                    {/* Notifications (Mobile) */}
                    <button 
                        onClick={() => { setMobileMenuOpen(false); setMobileAlertsOpen(true); }} 
                        className="flex items-center text-theme-text-secondary hover:text-theme-primary font-semibold"
                    >
                        <FaBell className="mr-2" /> Notifications
                        {unreadAlertsCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 rounded-full">{unreadAlertsCount}</span>
                        )}
                    </button>

                    <button 
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </div>
            </div>

            {/* Mobile Notifications Panel */}
            {mobileAlertsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end">
                    <div className="bg-theme-surface w-full max-h-[70%] rounded-t-2xl shadow-xl p-4 overflow-y-auto">
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <h4 className="font-bold text-theme-text-primary">Notifications</h4>
                            <div className="flex gap-3 items-center">
                                {unreadAlertsCount > 0 && (
                                    <button onClick={handleClearAll} className="text-sm text-theme-primary font-semibold hover:underline">
                                        Mark all as read
                                    </button>
                                )}
                                <button onClick={() => setMobileAlertsOpen(false)} className="text-gray-600 hover:text-red-500">
                                    <FaTimes size={20}/>
                                </button>
                            </div>
                        </div>
                        <div>
                            {localAlerts.length > 0 ? localAlerts.map(alert => (
                                <div key={alert._id} className={`p-2 rounded-md ${!alert.isRead ? 'bg-sky-50' : ''}`}>
                                    <p className="text-sm text-theme-text-secondary">{alert.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                                </div>
                            )) : <p className="text-sm text-theme-text-secondary p-4 text-center">No new notifications.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button for Add Transaction */}
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
