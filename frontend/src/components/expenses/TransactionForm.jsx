import React, { useEffect, useState, useContext } from 'react';
import { incomeCategories, expenseCategories } from '../../utils/categories';
import { TransactionContext } from '../../context/TransactionContext';

const TransactionForm = ({ onFormSubmit }) => {
    const { addTransaction } = useContext(TransactionContext);
    const [type, setType] = useState('expense');
    const [formData, setFormData] = useState({ description: '', amount: '', category: 'Food' });
    
    // ✅ Add this line back to define your variables
    const { description, amount, category } = formData;
    
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        setFormData(prev => ({ ...prev, category: categories[0] }));
    }, [type, categories]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await addTransaction({ ...formData, type });
            onFormSubmit(); // Close the modal
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    return (
        <div className="bg-theme-surface p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-theme-primary mb-4">New Transaction</h2>
            <div className="flex mb-4">
                <button onClick={() => setType('expense')} className={`flex-1 py-2 text-center font-semibold ${type === 'expense' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-500'}`}>Expense</button>
                <button onClick={() => setType('income')} className={`flex-1 py-2 text-center font-semibold ${type === 'income' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500'}`}>Income</button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
                 <div>
                    <label className="block text-gray-500 text-sm font-bold mb-2">Description</label>
                    <input type="text" name="description" value={description} onChange={onChange} required className="w-full px-3 py-2 text-gray-600 bg-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-500 text-sm font-bold mb-2">Amount ($)</label>
                        <input type="number" name="amount" value={amount} onChange={onChange} required className="w-full px-3 py-2 text-gray-600 bg-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                        <label className="block text-gray-500 text-sm font-bold mb-2">Category</label>
                        <select name="category" value={category} onChange={onChange} className="w-full px-3 py-2 text-gray-600 bg-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                           {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">Add Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;