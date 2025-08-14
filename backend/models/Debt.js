import mongoose from 'mongoose';

const DebtSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['lent', 'borrowed'] // 'lent' = I gave money, 'borrowed' = I took money
    },
    person: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('Debt', DebtSchema);