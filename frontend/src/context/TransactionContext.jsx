import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    const API_URL = 'http://localhost:5000/api/transactions';

    const getTransactions = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get(API_URL, config);
            setTransactions(res.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const addTransaction = async (transactionData) => {
        if (!token) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.post(API_URL, transactionData, config);
            setTransactions(prev => [res.data, ...prev]); // Add to state immediately
            return res.data;
        } catch (err) {
            setError(err);
            throw err; // Re-throw error for form handling
        }
    };

    const deleteTransaction = async (id) => {
        if (!token) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.delete(`${API_URL}/${id}`, config);
            setTransactions(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const value = {
        transactions,
        loading,
        error,
        getTransactions,
        addTransaction,
        deleteTransaction
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};