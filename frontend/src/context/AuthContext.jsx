import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    }, []);

    useEffect(() => {
        setLoading(true);
        try {
            if (token) {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ id: decoded.user.id });
                }
            }
        } catch (err) {
            console.error("Invalid token found, logging out.", err);
            logout();
        } finally {
            setLoading(false);
        }
    }, [token, logout]);
    
    // ✅ This is the corrected login function
    const login = async (formData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            // It sends the formData (email/password) as the body
            const res = await axios.post(`${API_BASE_URL}/api/users/login`, formData, config);
            
            // It receives a new token in the response
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const register = async (formData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            const res = await axios.post(`${API_BASE_URL}/api/users/register`, formData, config);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Registration failed.';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const value = { user, token, loading, error, login, register, logout, setError };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};