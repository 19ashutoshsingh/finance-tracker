import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/core/Layout';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
    const { user, token, setUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            return toast.error('Name is required.');
        }

        const loadingToast = toast.loading('Saving...');
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.put(`${API_BASE_URL}/api/users/profile`, { name }, config);
            
            localStorage.setItem('token', res.data.token);
            setUser(res.data); 

            toast.success('Profile updated successfully!', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to update profile.', { id: loadingToast });
            console.error(error);
        }
    };

    return (
        // ✅ Pass a placeholder function for the "Add Transaction" button
        <Layout onAddTransactionClick={() => {}}>
            <div className="max-w-md mx-auto">
                 <div className="mb-6">
                    <Link to="/dashboard" className="inline-flex items-center text-theme-primary hover:underline font-semibold">
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-3xl font-bold mb-6 text-theme-text-primary">Your Profile</h1>
                <form onSubmit={handleSubmit} className="bg-theme-surface p-8 rounded-2xl shadow-md">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-theme-text-secondary font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:border-theme-primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                     <div className="mb-6">
                        <label htmlFor="email" className="block text-theme-text-secondary font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 bg-gray-200 border-2 border-gray-300 rounded-md cursor-not-allowed"
                            value={user?.email || ''}
                            disabled
                        />
                    </div>
                    <button type="submit" className="w-full bg-theme-primary text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ProfilePage;