import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // 'ref' tells Mongoose which model to connect to.
        // It uses the string name you gave the model in User.js
        ref: 'User',
        required: true
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'],
    },
    date: { type: Date, default: Date.now },
});

// Defines the 'Expense' model.
export default mongoose.model('Expense', ExpenseSchema);