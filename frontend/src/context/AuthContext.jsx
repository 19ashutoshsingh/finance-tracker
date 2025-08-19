import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

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
        // On initial load, set the token from localStorage and load the user
        setToken(localStorage.getItem('token'));
        loadUser();
    }, [loadUser]);
    
    const login = async (formData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const res = await axios.post(`${API_BASE_URL}/api/users/login`, formData, config);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        // After login, immediately load the user data
        await loadUser();
    };
    
    const register = async (formData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const res = await axios.post(`${API_BASE_URL}/api/users/register`, formData, config);
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        // After registration, immediately load the user data
        await loadUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        loading,
        login,
        register,
        logout,
        setUser // For the Profile Page to update the user state
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};