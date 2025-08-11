import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Alert from '../models/Alert.js';

// Get all transactions for a user (with filtering)
export const getTransactions = async (req, res) => {
    try {
        const { type, category, month } = req.query;
        const filter = { user: req.user.id };

        if (type) filter.type = type;
        if (category) filter.category = category;

        if (month) {
            const year = parseInt(month.split('-')[0]);
            const monthIndex = parseInt(month.split('-')[1]) - 1;
            const startDate = new Date(year, monthIndex, 1);
            const endDate = new Date(year, monthIndex + 1, 0);
            filter.date = { $gte: startDate, $lte: endDate };
        }

        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a new transaction (with budget/alert logic)
export const addTransaction = async (req, res) => {
    const { description, amount, category, type } = req.body;
    try {
        const newTransaction = new Transaction({ user: req.user.id, description, amount, category, type });
        const transaction = await newTransaction.save();
        
        let newAlert = null;

        if (type === 'expense') {
            const date = new Date(transaction.date);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const budget = await Budget.findOne({ user: req.user.id, category, month });

            if (budget && budget.amount > 0) {
                const beginningOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                const pipeline = [
                    { $match: { 
                        user: new mongoose.Types.ObjectId(req.user.id),
                        category: transaction.category, 
                        type: 'expense',
                        date: { $gte: beginningOfMonth, $lte: endOfMonth }
                    }},
                    { $group: { 
                        _id: null, 
                        totalSpending: { $sum: '$amount' } 
                    }}
                ];

                const result = await Transaction.aggregate(pipeline);
                const totalSpending = result[0]?.totalSpending || 0;
                const spendingBefore = totalSpending - transaction.amount;

                const thresholds = [
                    { percent: 100, message: `You've exceeded your ₹${budget.amount} budget for ${category}.` },
                    { percent: 90, message: `You've spent 90% of your ₹${budget.amount} budget for ${category}.` },
                    { percent: 50, message: `You've spent 50% of your ₹${budget.amount} budget for ${category}.` }
                ];

                for (const t of thresholds) {
                    const thresholdAmount = budget.amount * (t.percent / 100);
                    if (spendingBefore < thresholdAmount && totalSpending >= thresholdAmount) {
                        newAlert = await new Alert({
                            user: req.user.id,
                            message: t.message,
                            threshold: t.percent
                        }).save();
                        break;
                    }
                }
            }
        }
        
        res.status(201).json({ transaction, newAlert });

    } catch (err) {
        console.error("❌ Error in addTransaction:", err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};