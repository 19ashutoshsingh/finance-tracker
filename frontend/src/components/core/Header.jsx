import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-teal-400">ExpenseTracker</Link>
                <div className="flex items-center">
                    {user ? (
                        <>
                            <span className="text-gray-300 mr-4 hidden sm:block"><FaUserCircle className="inline mr-2" /> Welcome!</span>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center">
                               <FaSignOutAlt className="mr-2" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2">Login</Link>
                            <Link to="/register" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">Register</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;