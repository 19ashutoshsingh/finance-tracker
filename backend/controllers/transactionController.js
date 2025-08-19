import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Alert from '../models/Alert.js';
import { Parser } from 'json2csv';

export const addTransaction = async (req, res) => {
    const { description, amount, category, type, date } = req.body;

    try {
        const newTransaction = new Transaction({
            user: req.user.id,
            description,
            amount: Number(amount),
            category,
            type,
            date: date || new Date()
        });

        const transaction = await newTransaction.save();
        let newAlert = null;

        // --- Failsafe Budget & Alert Checking ---
        try {
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
                    const userTransactions = await Transaction.find({
                        user: req.user.id,
                        category: transaction.category,
                        type: 'expense',
                        date: { $gte: new Date(year, month, 1), $lt: new Date(year, month + 1, 1) }
                    });
                    
                    const totalSpending = userTransactions.reduce((acc, t) => acc + t.amount, 0);
                    const existingAlert = await Alert.findOne({
                        user: req.user.id,
                        category: transaction.category,
                        month: transactionMonthISO,
                    });

                    let alertMessage = '';
                    let alertThreshold = 0;

                    if (!existingAlert && totalSpending >= budget.amount) {
                        alertMessage = `You have exceeded your budget of ₹${budget.amount} for ${budget.category}.`;
                        alertThreshold = 100;
                    } else if (!existingAlert && totalSpending >= budget.amount * 0.9) {
                        alertMessage = `You have used 90% of your budget for ${budget.category}.`;
                        alertThreshold = 90;
                    } else if (!existingAlert && totalSpending >= budget.amount * 0.5) {
                        alertMessage = `You have used 50% of your budget for ${budget.category}.`;
                        alertThreshold = 50;
                    }

                    if (alertMessage) {
                        newAlert = new Alert({
                            user: req.user.id,
                            message: alertMessage,
                            category: transaction.category,
                            month: transactionMonthISO,
                            threshold: alertThreshold
                        });
                        await newAlert.save();
                    }
                }
            }
        } catch (alertError) {
            console.error("Could not process budget alerts:", alertError.message);
        }
        
        res.status(201).json({ transaction, newAlert });

    } catch (err) {
        console.error("Error saving transaction:", err.message);
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


export const exportTransactions = async (req, res) => {
    try {
        const query = { user: req.user.id };

        // Reuse the filtering logic from your getTransactions function
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

        const transactions = await Transaction.find(query).sort({ date: -1 }).lean();

        // Define which fields to include in the CSV
        const fields = ['date', 'type', 'category', 'amount', 'description'];
        const opts = { fields };
        
        const parser = new Parser(opts);
        const csv = parser.parse(transactions);

        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        return res.send(csv);

    } catch (err) {
        console.error('Export Error:', err.message);
        res.status(500).send('Server Error');
    }
};