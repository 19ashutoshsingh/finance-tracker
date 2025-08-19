import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getInsights } from '../controllers/insightsController.js';

const router = express.Router();

// @route   GET /api/insights
router.get('/', auth, getInsights);

export default router;