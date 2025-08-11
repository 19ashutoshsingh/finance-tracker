import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { setBudget, getBudgets } from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', authMiddleware, getBudgets);
router.post('/', authMiddleware, setBudget);

export default router;