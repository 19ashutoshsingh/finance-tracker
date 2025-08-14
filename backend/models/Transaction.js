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
        enum: ['income', 'expense']
    },
    category: {
        type: String,
        required: true,
        // ✅ Update this list to match all your new categories
        enum: [
            // Income
            'Salary', 'Bonus', 'Freelance', 'Investments', 'Gifts', 'Rental Income', 'Other Income',
            // Expense
            'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Housing', 'Education', 'Subscriptions', 'Other Expense'
        ]
    },
    date: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('Transaction', TransactionSchema);