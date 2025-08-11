import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const { token } = useContext(AuthContext);

    const API_URL = 'http://localhost:5000/api/transactions';

    const getAlerts = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('/api/alerts', config);
            if (Array.isArray(res.data)) setAlerts(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    const getTransactions = useCallback(async (queryParams = '') => {
        if (!token) return;
        setLoading(true);
        try {
            const config = { headers: { 'x-auth-token': token } };
            // Append the query string if it exists
            const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;
            const res = await axios.get(url, config);
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
            const res = await axios.post('/api/transactions', transactionData, config);
            
            // ✅ Update state with new transaction
            setTransactions(prev => [res.data.transaction, ...prev]);

            // ✅ Check if a new alert was returned
            if (res.data.newAlert) {
                toast.success('You have a new notification!'); // Show toaster
                setAlerts(prev => [res.data.newAlert, ...prev]); // Instantly update the bell
            }
            
            return res.data;
        } catch (err) {
            toast.error('Failed to add transaction.');
            throw err;
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
        alerts,
        getAlerts,
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