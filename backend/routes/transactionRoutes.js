import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getTransactions, addTransaction, deleteTransaction, exportTransactions } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', auth, getTransactions);
router.post('/', auth, addTransaction);
router.delete('/:id', auth, deleteTransaction);
router.get('/export', auth, exportTransactions);

export default router;