import express from 'express';
import { register, login, getUser, updateUserProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authMiddleware, getUser);
router.put('/profile', authMiddleware, updateUserProfile);

export default router;