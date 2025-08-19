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
    FaTimes,
    FaUserCircle
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Header = ({ onAddTransactionClick }) => {
    // ... all your existing state and functions are correct ...
    const { user, logout, token } = useContext(AuthContext);
    const { alerts, getAlerts } = useContext(TransactionContext);

    const [localAlerts, setLocalAlerts] = useState([]);
    const [showAlerts, setShowAlerts] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileAlertsOpen, setMobileAlertsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const alertsRef = useRef(null);
    const alertToggleRef = useRef(null);
    const menuRef = useRef(null);
    const menuToggleRef = useRef(null);
    const profileMenuRef = useRef(null);
    const profileToggleRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem("alerts");
        if (saved) { setLocalAlerts(JSON.parse(saved)); }
    }, []);

    useEffect(() => {
        if (token) { getAlerts(); }
    }, [token, getAlerts]);

    useEffect(() => {
        if (alerts.length > 0) {
            setLocalAlerts(alerts);
            localStorage.setItem("alerts", JSON.stringify(alerts));
        }
    }, [alerts]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (alertsRef.current && !alertsRef.current.contains(event.target) &&
                alertToggleRef.current && !alertToggleRef.current.contains(event.target)) {
                setShowAlerts(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                menuToggleRef.current && !menuToggleRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) &&
                profileToggleRef.current && !profileToggleRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBellClick = () => {
        setShowAlerts(prev => !prev);
    };

    const handleClearAll = async () => {
        if (localAlerts.filter(a => !a.isRead).length === 0) return;
        const updated = localAlerts.map(alert => ({ ...alert, isRead: true }));
        setLocalAlerts(updated);
        localStorage.setItem("alerts", JSON.stringify(updated));
        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`${API_BASE_URL}/api/alerts/mark-read`, {}, config);
        } catch (err) { console.error("Failed to mark alerts as read", err); }
    };

    const unreadAlertsCount = localAlerts.filter(a => !a.isRead).length;


    return (
        <>
            <header className="shadow-sm bg-theme-surface/80 backdrop-blur-sm sticky top-0 z-50">
                <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center">
                        <img src={logo} alt="Site Logo" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-theme-primary ml-2">CashVue</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-2 sm:gap-3">
                        {user ? (
                           // ... Logged-in desktop buttons
                           <>
                                <Link to="/debts" className="text-theme-text-secondary hover:text-theme-primary font-semibold flex items-center mr-2"><FaHandHoldingUsd className="mr-1" /> Debts & Loans</Link>
                                <Link to="/budgets" className="text-theme-text-secondary hover:text-theme-primary font-semibold flex items-center mr-2"><FaClipboardList className="mr-1" /> Budgets</Link>
                                <button onClick={onAddTransactionClick} className="flex items-center bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300"><FaPlus className="mr-2" /> Add Transaction</button>
                                <div className="relative">
                                    <button ref={alertToggleRef} onClick={handleBellClick} className="text-theme-text-secondary hover:text-theme-primary p-2 rounded-full relative">
                                        <FaBell size={22} />
                                        {unreadAlertsCount > 0 && (<span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{unreadAlertsCount}</span>)}
                                    </button>
                                    {showAlerts && (
                                        <div ref={alertsRef} className="absolute right-0 mt-2 w-72 sm:w-80 bg-theme-surface rounded-lg shadow-xl z-50 border border-gray-100">
                                            <div className="flex justify-between items-center p-4 border-b">
                                                <h4 className="font-bold text-theme-text-primary">Notifications</h4>
                                                {unreadAlertsCount > 0 && (<button onClick={handleClearAll} className="text-sm text-theme-primary font-semibold hover:underline">Mark all as read</button>)}
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
                                <div className="relative">
                                    <button ref={profileToggleRef} onClick={() => setShowProfileMenu(prev => !prev)} className="text-theme-text-secondary hover:text-theme-primary p-1 rounded-full"><FaUserCircle size={26} /></button>
                                    {showProfileMenu && (
                                        <div ref={profileMenuRef} className="absolute right-0 mt-2 w-48 bg-theme-surface rounded-md shadow-lg z-50 border border-gray-100">
                                            <div className="py-1">
                                                <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-theme-text-secondary hover:bg-gray-100"><FaUserCircle className="mr-3 text-gray-500" /> Profile</Link>
                                                <button onClick={() => { handleLogout(); setShowProfileMenu(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><FaSignOutAlt className="mr-3" /> Logout</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                           </>
                        ) : (
                            // Logged-out desktop buttons
                            <>
                                <Link to="/login" className="text-theme-text-secondary hover:text-theme-text-primary px-3 py-2 font-semibold">Login</Link>
                                <Link to="/register" className="bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition duration-300">Register</Link>
                            </>
                        )}
                    </div>

                    {/* ✨ FIX: Mobile buttons for LOGGED-OUT users */}
                    {!user && (
                        <div className="lg:hidden">
                            <Link to="/login" className="text-sm text-theme-text-secondary hover:text-theme-text-primary font-semibold">Login</Link>
                            <Link to="/register" className="ml-2 text-sm bg-theme-primary hover:opacity-90 text-white font-bold py-2 px-3 rounded-full transition duration-300">Register</Link>
                        </div>
                    )}

                    {/* Mobile Hamburger for LOGGED-IN users */}
                    {user && ( <button ref={menuToggleRef} onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-theme-text-secondary hover:text-theme-primary p-2 rounded-full"><FaBars size={22} /></button>)}
                </nav>
            </header>

            {/* ... rest of the component (Mobile Slider Menu, etc.) ... */}
            <div ref={menuRef} className={`fixed top-0 right-0 h-full w-64 bg-theme-surface shadow-lg z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-theme-primary">Menu</h3>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-gray-600 hover:text-red-500"><FaTimes size={22} /></button>
                </div>
                <div className="flex flex-col p-4 gap-4">
                    <Link to="/debts" className="flex items-center text-theme-text-secondary hover:text-theme-primary font-semibold" onClick={() => setMobileMenuOpen(false)}><FaHandHoldingUsd className="mr-2" /> Debts & Loans</Link>
                    <Link to="/budgets" className="flex items-center text-theme-text-secondary hover:text-theme-primary font-semibold" onClick={() => setMobileMenuOpen(false)}><FaClipboardList className="mr-2" /> Budgets</Link>
                    <Link to="/profile" className="flex items-center text-theme-text-secondary hover:text-theme-primary font-semibold" onClick={() => setMobileMenuOpen(false)}><FaUserCircle className="mr-2" /> Profile</Link>
                    <button onClick={() => { setMobileMenuOpen(false); setMobileAlertsOpen(true); }} className="flex items-center text-theme-text-secondary hover:text-theme-primary font-semibold text-left">
                        <FaBell className="mr-2" /> Notifications
                        {unreadAlertsCount > 0 && (<span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadAlertsCount}</span>)}
                    </button>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 mt-4"><FaSignOutAlt className="mr-2" /> Logout</button>
                </div>
            </div>
            
            {mobileAlertsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end" onClick={() => setMobileAlertsOpen(false)}>
                    <div className="bg-theme-surface w-full max-h-[70%] rounded-t-2xl shadow-xl p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <h4 className="font-bold text-theme-text-primary">Notifications</h4>
                            <div className="flex gap-3 items-center">
                                {unreadAlertsCount > 0 && (<button onClick={handleClearAll} className="text-sm text-theme-primary font-semibold hover:underline">Mark all as read</button>)}
                                <button onClick={() => setMobileAlertsOpen(false)} className="text-gray-600 hover:text-red-500"><FaTimes size={20} /></button>
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
            {user && (<button onClick={onAddTransactionClick} className="md:hidden fixed bottom-6 right-6 bg-theme-primary hover:opacity-90 text-white font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"><FaPlus size={24} /></button>)}
        </>
    );
};

export default Header;