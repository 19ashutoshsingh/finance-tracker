import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAlerts, markAllAsRead } from '../controllers/alertController.js';

const router = express.Router();

// GET /api/alerts
router.get('/', authMiddleware, getAlerts);

// POST /api/alerts/mark-read
router.post('/mark-read', authMiddleware, markAllAsRead);

export default router;