import Budget from '../models/Budget.js';

// Set or update a budget for a given category and month
export const setBudget = async (req, res) => {
    const { category, amount, month } = req.body;
    try {
        const budget = await Budget.findOneAndUpdate(
            { user: req.user.id, category, month },
            { amount },
            { new: true, upsert: true, runValidators: true } // Upsert creates it if it doesn't exist
        );
        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all budgets for a specific month
export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id, month: req.query.month });
        res.json(budgets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};