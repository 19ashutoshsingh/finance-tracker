import mongoose from 'mongoose'; // ✅ 1. Import mongoose
import Transaction from '../models/Transaction.js';
import moment from 'moment';

// @desc    Get financial insights for the user
// @route   GET /api/insights
// @access  Private
export const getInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId); // ✅ 2. Convert string ID to ObjectId
        
        const targetMonth = req.query.month ? moment.utc(req.query.month) : moment.utc();
        const insights = [];

        const startOfMonth = targetMonth.clone().startOf('month').toDate();
        const endOfMonth = targetMonth.clone().endOf('month').toDate();

        // --- Insight 1: Top Spending Category This Month ---
        const topCategoryData = await Transaction.aggregate([
            // ✅ 3. Use the converted userObjectId in the query
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

        // --- Insight 2: Spending vs. 6-Month Average ---
        const sixMonthsAgo = targetMonth.clone().subtract(6, 'months').startOf('month').toDate();
        
        const averageSpendingData = await Transaction.aggregate([
             // ✅ 4. Also use the converted userObjectId here
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
             // ✅ 5. And here as well
            { $match: { user: userObjectId, type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
            { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
        ]);

        currentMonthSpendingData.forEach(item => {
            const category = item._id;
            const currentSpent = item.totalSpent;
            const avgSpent = averageSpendingMap[category];

            if (avgSpent && currentSpent > avgSpent * 1.2) {
                const percentIncrease = ((currentSpent - avgSpent) / avgSpent) * 100;
                insights.push({
                    type: 'warning',
                    message: `Heads up! Your spending on **${category}** is **${percentIncrease.toFixed(0)}% higher** than your average.`
                });
            }
        });

        res.json(insights);

    } catch (err) {
        console.error("Insights Controller Error:", err.message);
        res.status(500).send('Server Error');
    }
};