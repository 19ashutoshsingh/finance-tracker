import Debt from '../models/Debt.js';

// Get all debts for the logged-in user
export const getDebts = async (req, res) => {
    try {
        const debts = await Debt.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(debts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a new debt or loan record
export const addDebt = async (req, res) => {
    const { type, person, description, amount, dueDate } = req.body;
    try {
        const newDebt = new Debt({
            user: req.user.id,
            type,
            person,
            description,
            amount,
            dueDate
        });
        const debt = await newDebt.save();
        res.status(201).json(debt);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a debt's status to 'paid'
export const updateDebt = async (req, res) => {
    try {
        let debt = await Debt.findById(req.params.id);
        if (!debt) return res.status(404).json({ msg: 'Debt record not found' });

        if (debt.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // ✅ Toggle the status
        debt.status = debt.status === 'pending' ? 'paid' : 'pending';

        await debt.save();
        res.json(debt);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const deleteDebt = async (req, res) => {
    try {
        const debt = await Debt.findById(req.params.id);

        if (!debt) {
            return res.status(404).json({ msg: 'Debt record not found' });
        }
        if (debt.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await debt.deleteOne();
        res.json({ msg: 'Debt record removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};