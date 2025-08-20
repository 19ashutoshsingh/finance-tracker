import React, { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/core/Layout';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

import avatar1 from '../assets/avatar1.avif';
import avatar2 from '../assets/avatar2.webp';
import avatar3 from '../assets/avatar3.avif';
import avatar4 from '../assets/avatar4.avif';
import avatar5 from '../assets/avatar5.avif';
import avatar6 from '../assets/avatar6.webp';

const avatarOptions = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
    const { user, token, setUser } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || avatarOptions[0]);
    const [isSaving, setIsSaving] = useState(false);

    const hasChanges = name !== user?.name || selectedAvatar !== user?.avatarUrl;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        setIsSaving(true);
        const loadingToast = toast.loading('Saving...');

        const updatedProfile = {
            name,
            avatarUrl: selectedAvatar
        };

        try {
            const config = { headers: { 
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }};
            
            const res = await axios.put(`${API_BASE_URL}/api/users/profile`, updatedProfile, config);
            
            setUser(res.data.user); 
            toast.success('Profile updated successfully!', { id: loadingToast });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile.', { id: loadingToast });
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* ✨ 1. HEADER LAYOUT UPDATED */}
                <div className="mb-4">
                    <Link to="/dashboard" className="inline-flex items-center text-theme-primary hover:underline font-semibold">
                        <FaArrowLeft className="mr-2" /> Back to Dashboard
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-theme-text-primary mb-6">Your Profile</h1>

                <div className="bg-theme-surface p-8 rounded-2xl shadow-md">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Left Column: Avatar Display and Selection */}
                        <div className="flex-shrink-0 w-full md:w-1/3 text-center">
                            <img src={selectedAvatar} alt="Current Avatar" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-theme-primary/50" />
                            <h3 className="text-lg font-semibold text-theme-text-secondary mb-2">Choose your avatar</h3>
                            
                            {/* ✨ 2. AVATAR PICKER IS NOW A 3x2 GRID */}
                            <div className="grid grid-cols-3 gap-4 justify-items-center">
                                {avatarOptions.map((avatar, index) => (
                                    <img
                                        key={index}
                                        src={avatar}
                                        alt={`Avatar ${index + 1}`}
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`w-14 h-14 rounded-full object-cover cursor-pointer transition-all duration-200 ${selectedAvatar === avatar ? 'ring-4 ring-theme-primary' : 'ring-2 ring-transparent hover:ring-theme-primary/50'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Edit Form */}
                        <div className="w-full md:w-2/3">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-theme-text-secondary font-semibold mb-2">Name</label>
                                    <input type="text" id="name" className="w-full px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-md focus:outline-none focus:border-theme-primary" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-theme-text-secondary font-semibold mb-2">Email</label>
                                    <input type="email" id="email" className="w-full px-4 py-2 bg-gray-200 border-2 border-gray-300 rounded-md cursor-not-allowed" value={user?.email || ''} disabled />
                                </div>
                                <button type="submit" className="w-full flex justify-center items-center bg-theme-primary text-white font-bold py-3 px-4 rounded-full transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90" disabled={!hasChanges || isSaving}>
                                    {isSaving ? <FaSpinner className="animate-spin" /> : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;