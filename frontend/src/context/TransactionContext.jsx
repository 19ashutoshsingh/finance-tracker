import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const { token } = useContext(AuthContext);

    const getAlerts = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get(`${API_BASE_URL}/api/alerts`, config);
            if (Array.isArray(res.data)) setAlerts(res.data);
        } catch (err) {
            console.error("Failed to fetch alerts", err);
        }
    }, [token]);

    const getTransactions = useCallback(async (queryParams = '') => {
        if (!token) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get(`${API_BASE_URL}/api/transactions?${queryParams}`, config);
            setTransactions(res.data);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    }, [token]);

    const addTransaction = async (transactionData) => {
        if (!token) throw new Error("No token found");
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.post(`${API_BASE_URL}/api/transactions`, transactionData, config);
            
            setTransactions(prev => [res.data.transaction, ...prev]);

            const type = transactionData.type.charAt(0).toUpperCase() + transactionData.type.slice(1);
            toast.success(`${type} added successfully!`);

            if (res.data.newAlert) {
                toast.success('You have a new notification!');
                setAlerts(prev => [res.data.newAlert, ...prev]);
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
            await axios.delete(`${API_BASE_URL}/api/transactions/${id}`, config);
            setTransactions(prev => prev.filter(t => t._id !== id));
            toast.success('Transaction deleted successfully.');
        } catch (err) {
            toast.error('Failed to delete transaction.');
        }
    };

    const value = { transactions, alerts, getAlerts, getTransactions, addTransaction, deleteTransaction };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};