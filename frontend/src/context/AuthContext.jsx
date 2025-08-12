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
            console.error("Invalid token", err);
            logout();
        } finally {
            setLoading(false);
        }
    }, [token, logout]);

    const login = async (formData) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            const res = await axios.post(`${API_BASE_URL}/api/users/login`, formData, config);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
            throw err;
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
            setError(err.response?.data?.msg || 'Registration failed');
            throw err;
        }
    };

    const value = { user, token, loading, error, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};