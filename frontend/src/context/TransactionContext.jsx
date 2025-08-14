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
    const [debts, setDebts] = useState([]);

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

    // Functions to manage debts
    const getDebts = useCallback(async () => {
        if (!token) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get(`${API_BASE_URL}/api/debts`, config);
            setDebts(res.data);
        } catch (err) { console.error("Failed to fetch debts", err); }
    }, [token]);

    const addDebt = async (debtData) => {
        if (!token) throw new Error("No token found");
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.post(`${API_BASE_URL}/api/debts`, debtData, config);
            setDebts(prev => [res.data, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            toast.success('Record added successfully!');
        } catch (err) { 
            toast.error('Failed to add record.');
            throw err;
        }
    };

    const updateDebt = async (id) => {
        if (!token) return;
        try {
            const config = { headers: { 'x-auth-token': token } };
            // The PUT request now has an empty body, the backend does the toggle
            const res = await axios.put(`${API_BASE_URL}/api/debts/${id}`, {}, config);
            setDebts(prev => prev.map(debt => (debt._id === id ? res.data : debt)));
            toast.success(`Record status updated!`);
        } catch (err) {
            toast.error('Failed to update record.');
            throw err;
        }
    };

    const deleteDebt = async (id) => {
        if (!token) return;
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`${API_BASE_URL}/api/debts/${id}`, config);
                setDebts(prev => prev.filter(debt => debt._id !== id));
                toast.success('Record deleted successfully.');
            } catch (err) {
                toast.error('Failed to delete record.');
            }
        }
    };

    const value = { transactions, alerts, getAlerts, getTransactions, addTransaction, deleteTransaction, debts, getDebts, addDebt, updateDebt, deleteDebt };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};