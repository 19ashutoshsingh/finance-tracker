import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense'] // Transaction can only be 'income' or 'expense'
    },
    category: {
        type: String,
        required: true,
        // Categories for both income and expense
        enum: ['Salary', 'Bonus', 'Freelance', 'Other Income', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Other Expense']
    },
    date: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('Transaction', TransactionSchema);