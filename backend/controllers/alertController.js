import Alert from '../models/Alert.js';

// Get all unread alerts for the user
export const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user.id, isRead: false }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Mark all alerts as read
export const markAllAsRead = async (req, res) => {
    try {
        await Alert.updateMany({ user: req.user.id, isRead: false }, { $set: { isRead: true } });
        res.status(200).json({ msg: 'Alerts marked as read' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};