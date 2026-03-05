import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  refreshToken, 
  getMe,
  updateProfile,
  updateAvatar,
  uploadAvatar,
  updatePaymentSettings,
  getSellerPaymentDetails
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/seller/:sellerId/payment', getSellerPaymentDetails);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, updateAvatar);
router.post('/avatar/upload', protect, upload.single('avatar'), uploadAvatar);
router.put('/payment-settings', protect, updatePaymentSettings);

export default router;

