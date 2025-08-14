import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Alert from '../models/Alert.js';

// @route   POST api/transactions
// @desc    Add a new transaction
export const addTransaction = async (req, res) => {
    const { description, amount, category, type, date } = req.body;

    try {
        const newTransaction = new Transaction({
            user: req.user.id,
            description,
            amount,
            category,
            type,
            date: date || new Date()
        });

        const transaction = await newTransaction.save();
        let newAlert = null;

        if (transaction.type === 'expense') {
            const transactionDate = new Date(transaction.date);
            const year = transactionDate.getFullYear();
            const month = transactionDate.getMonth();
            const transactionMonthISO = transactionDate.toISOString().slice(0, 7);

            const budget = await Budget.findOne({
                user: req.user.id,
                category: transaction.category,
                month: transactionMonthISO
            });

            if (budget) {
                // ✅ This is the corrected, more reliable date query
                const userTransactions = await Transaction.find({
                    user: req.user.id,
                    category: transaction.category,
                    type: 'expense',
                    date: {
                        $gte: new Date(year, month, 1),
                        $lt: new Date(year, month + 1, 1)
                    }
                });
                
                const totalSpending = userTransactions.reduce((acc, t) => acc + t.amount, 0);
                const existingAlert = await Alert.findOne({
                    user: req.user.id,
                    category: transaction.category,
                    month: transactionMonthISO,
                });

                let alertMessage = '';
                if (!existingAlert && totalSpending >= budget.amount) {
                    alertMessage = `You have exceeded your budget of ₹${budget.amount} for ${budget.category}.`;
                } else if (!existingAlert && totalSpending >= budget.amount * 0.9) {
                    alertMessage = `You have used 90% of your budget for ${budget.category}.`;
                } else if (!existingAlert && totalSpending >= budget.amount * 0.5) {
                    alertMessage = `You have used 50% of your budget for ${budget.category}.`;
                }

                if (alertMessage) {
                    newAlert = new Alert({
                        user: req.user.id,
                        message: alertMessage,
                        category: transaction.category,
                        month: transactionMonthISO
                    });
                    await newAlert.save();
                }
            }
        }
        
        res.status(201).json({ transaction, newAlert });

    } catch (err) {
        console.error("Error adding transaction:", err.message);
        res.status(500).send('Server Error');
    }
};


// GET and DELETE functions remain the same
export const getTransactions = async (req, res) => {
    try {
        const query = { user: req.user.id };
        if (req.query.month) {
            const year = new Date(req.query.month).getFullYear();
            const month = new Date(req.query.month).getMonth();
            query.date = { 
                $gte: new Date(year, month, 1), 
                $lt: new Date(year, month + 1, 1) 
            };
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await transaction.deleteOne();
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};