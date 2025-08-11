import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getTransactions, addTransaction, deleteTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', auth, getTransactions);
router.post('/', auth, addTransaction);
router.delete('/:id', auth, deleteTransaction);

export default router;