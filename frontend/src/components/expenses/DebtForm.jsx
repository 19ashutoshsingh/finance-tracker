import React, { useState, useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import toast from 'react-hot-toast';

const DebtForm = ({ onFormSubmit }) => {
    const { addDebt } = useContext(TransactionContext);
    const [formData, setFormData] = useState({
        type: 'lent',
        person: '',
        description: '',
        amount: '',
        dueDate: ''
    });

    const { type, person, description, amount, dueDate } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (!person || !amount) {
            toast.error("Person's name and amount are required.");
            return;
        }
        try {
            await addDebt(formData);
            onFormSubmit(); // Close modal after submission
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" value={type} onChange={onChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary">
                    <option value="lent">I Lent Money (Payable to me)</option>
                    <option value="borrowed">I Borrowed Money (Receivable from me)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Person's Name</label>
                <input type="text" name="person" value={person} onChange={onChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <input type="text" name="description" value={description} onChange={onChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                    <input type="number" name="amount" value={amount} onChange={onChange} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date (Optional)</label>
                    <input type="date" name="dueDate" value={dueDate} onChange={onChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary" />
                </div>
            </div>
            <button type="submit" className="w-full py-2 px-4 font-bold text-white bg-theme-primary rounded-md hover:opacity-90">
                Save Record
            </button>
        </form>
    );
};

export default DebtForm;