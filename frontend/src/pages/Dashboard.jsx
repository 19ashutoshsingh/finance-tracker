import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../components/core/Layout';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import ExpenseChart from '../components/charts/ExpenseChart';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const { token } = useContext(AuthContext);

    const fetchExpenses = async () => {
        const config = { headers: { 'x-auth-token': token } };
        try {
            const res = await axios.get('http://localhost:5000/api/expenses', config);
            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchExpenses();
        }
    }, [token]);

    const handleExpenseAdded = (newExpense) => {
        setExpenses([newExpense, ...expenses]);
    };

    const handleExpenseDeleted = async (id) => {
        const config = { headers: { 'x-auth-token': token } };
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`, config);
            setExpenses(expenses.filter(expense => expense._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <ExpenseForm token={token} onExpenseAdded={handleExpenseAdded} />
                    <ExpenseList expenses={expenses} onDelete={handleExpenseDeleted} />
                </div>
                <div className="lg:col-span-2">
                    <ExpenseChart expenses={expenses} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;