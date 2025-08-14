import Budget from '../models/Budget.js';

// Set or update a budget for a given category and month
export const setBudget = async (req, res) => {
    const { category, amount, month } = req.body;

    // Add validation to the backend
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ msg: 'Please provide a valid, positive amount for the budget.' });
    }

    try {
        const userId = req.user.id;
        
        let budget = await Budget.findOneAndUpdate(
            { user: userId, category, month },
            { amount: numericAmount }, // Use the validated numeric amount
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(budget);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getBudgets = async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) {
            return res.status(400).json({ msg: 'Month query parameter is required' });
        }
        const budgets = await Budget.find({ user: req.user.id, month: month });
        res.json(budgets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};