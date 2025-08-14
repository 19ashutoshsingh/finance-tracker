import express from 'express';
const router = express.Router();
import { getDebts, addDebt, updateDebt, deleteDebt } from '../controllers/debtController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Defines GET and POST routes for /api/debts
router.route('/').get(authMiddleware, getDebts).post(authMiddleware, addDebt);

// Defines the PUT route for updating a specific debt (e.g., /api/debts/12345)
router.route('/:id').put(authMiddleware, updateDebt).delete(authMiddleware, deleteDebt);

export default router;