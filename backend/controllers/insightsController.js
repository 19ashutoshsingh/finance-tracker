import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import moment from 'moment';

// ✨ 1. Define your default budget for new users
// These values are just examples; adjust them to what you think is reasonable.
const DEFAULT_AVERAGES = {
    'Food': 3000,
    'Transport': 1500,
    'Utilities': 15000,
    'Shopping': 1000,
    'Entertainment': 1000,
    // Add other common categories
};

export const getInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        const targetMonth = req.query.month ? moment.utc(req.query.month) : moment.utc();
        const insights = [];

        const startOfMonth = targetMonth.clone().startOf('month').toDate();
        const endOfMonth = targetMonth.clone().endOf('month').toDate();

        // --- Insight 1: Top Spending Category This Month ---
        const topCategoryData = await Transaction.aggregate([
            { $match: { user: userObjectId, type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } },
            { $sort: { totalSpent: -1 } },
            { $limit: 1 }
        ]);

        if (topCategoryData.length > 0) {
            insights.push({
                type: 'info',
                message: `Your top spending category for ${targetMonth.format("MMMM")} was **${topCategoryData[0]._id}**.`
            });
        }

        // --- Insight 2: Spending vs. Average ---
        const sixMonthsAgo = targetMonth.clone().subtract(6, 'months').startOf('month').toDate();
        
        const averageSpendingData = await Transaction.aggregate([
            { $match: { user: userObjectId, type: 'expense', date: { $gte: sixMonthsAgo, $lt: startOfMonth } } },
            { $group: {
                _id: { category: '$category', month: { $month: '$date' } },
                monthlyTotal: { $sum: '$amount' }
            }},
            { $group: {
                _id: '$_id.category',
                avgMonthly: { $avg: '$monthlyTotal' }
            }}
        ]);
        
        const averageSpendingMap = averageSpendingData.reduce((acc, item) => {
            acc[item._id] = item.avgMonthly;
            return acc;
        }, {});

        const currentMonthSpendingData = await Transaction.aggregate([
            { $match: { user: userObjectId, type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
        ]);

        currentMonthSpendingData.forEach(item => {
            const category = item._id;
            const currentSpent = item.totalSpent;
            let avgSpent = averageSpendingMap[category]; // Get user's personal average

            if (!avgSpent) {
                avgSpent = DEFAULT_AVERAGES[category];
            }

            if (avgSpent && currentSpent > avgSpent * 1.2) {
                const percentIncrease = ((currentSpent - avgSpent) / avgSpent) * 100;
                
                if (percentIncrease > 25) { // Only show significant warnings
                    insights.push({
                        type: 'warning',
                        message: `Heads up! Your spending on **${category}** is **${percentIncrease.toFixed(0)}% higher** than your average.`
                    });
                }
            }
        });

        res.json(insights);

    } catch (err) {
        console.error("Insights Controller Error:", err.message);
        res.status(500).send('Server Error');
    }
};