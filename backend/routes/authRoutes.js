import express from 'express';
import multer from 'multer'; // ✨ 1. Import multer
import { register, login, getUser, updateUserProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ✨ 2. Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/register', register);
router.post('/login', login);
router.get('/', authMiddleware, getUser);

// ✨ 3. Add the multer middleware to the profile route
router.put('/profile', authMiddleware, updateUserProfile);

export default router;