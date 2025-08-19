import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ✨ 1. Added state for handling errors

    const loadUser = useCallback(async () => {
        const localToken = localStorage.getItem('token');
        if (localToken) {
            try {
                const config = { headers: { 'x-auth-token': localToken } };
                const res = await axios.get(`${API_BASE_URL}/api/users`, config);
                setUser(res.data);
            } catch (err) {
                console.error("Token is invalid, logging out.", err);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        loadUser();
    }, [loadUser]);
    
    const login = async (formData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            setError(null); // Clear any previous errors
            const res = await axios.post(`${API_BASE_URL}/api/users/login`, formData, config);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await loadUser();
        } catch (err) {
            // ✨ 2. Set error state if login fails
            setError(err.response?.data?.message || 'Invalid credentials');
            throw err; // Re-throw error so the component knows it failed
        }
    };
    
    const register = async (formData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            setError(null); // Clear any previous errors
            const res = await axios.post(`${API_BASE_URL}/api/users/register`, formData, config);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await loadUser();
        } catch (err) {
            // ✨ 2. Set error state if registration fails
            setError(err.response?.data?.message || 'Registration failed');
            throw err; // Re-throw error so the component knows it failed
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // ✨ 3. A function to manually clear errors from components
    const clearError = () => {
        setError(null);
    };

    const value = {
        token,
        user,
        loading,
        error,      // ✨ 4. Provide the error state
        setError,   // ✨ 4. Provide the setError function (fixes the error)
        clearError, // ✨ 4. Provide the clearError function
        login,
        register,
        logout,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};