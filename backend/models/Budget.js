import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ }, // "YYYY-MM" format
});

// A user can only have one budget per category per month
BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

export default mongoose.model('Budget', BudgetSchema);