import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMonthlyExpenses } from '../controllers/reportController.js';

const router = express.Router();
router.get('/monthly-expenses', authMiddleware, getMonthlyExpenses);
export default router;