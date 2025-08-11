import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'], // Example categories
    },
    date: { type: Date, default: Date.now },
});

export default mongoose.model('User', ExpenseSchema);