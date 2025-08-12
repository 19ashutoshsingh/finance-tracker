import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

export const getMonthlyExpenses = async (req, res) => {
    const year = new Date().getFullYear();
    try {
        const monthlyExpenses = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: 'expense',
                    date: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$date' }, // Group by month
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { '_id': 1 } }, // Sort by month
        ]);
        res.json(monthlyExpenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};