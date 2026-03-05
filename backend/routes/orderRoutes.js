import express from 'express';
import { 
  createOrder,
  getCustomerOrders,
  getSellerOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my-orders', getCustomerOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Seller routes
router.get('/seller/orders', getSellerOrders);
router.put('/:id/status', updateOrderStatus);

export default router;

