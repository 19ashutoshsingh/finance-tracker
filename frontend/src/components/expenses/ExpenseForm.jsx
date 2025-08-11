import React, { useState } from 'react';
import axios from 'axios';

const ExpenseForm = ({ token, onExpenseAdded }) => {
    const [formData, setFormData] = useState({ description: '', amount: '', category: 'Food' });
    const { description, amount, category } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const config = { headers: { 'x-auth-token': token } };
        try {
            const res = await axios.post('http://localhost:5000/api/expenses', formData, config);
            onExpenseAdded(res.data);
            setFormData({ description: '', amount: '', category: 'Food' }); // Reset form
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Expense</h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm font-bold mb-2">Description</label>
                    <input type="text" name="description" value={description} onChange={onChange} required className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2">Amount ($)</label>
                    <input type="number" name="amount" value={amount} onChange={onChange} required className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-bold mb-2">Category</label>
                    <select name="category" value={category} onChange={onChange} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button type="submit" className="md:col-start-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 w-full">Add Expense</button>
            </form>
        </div>
    );
};

export default ExpenseForm;