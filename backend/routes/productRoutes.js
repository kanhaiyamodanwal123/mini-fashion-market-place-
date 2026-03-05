import express from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getBrandProducts,
  getBrandStats
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (Brand only)
router.post('/', protect, authorize('brand'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('brand'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('brand'), deleteProduct);

// Brand dashboard routes
router.get('/brand/my-products', protect, authorize('brand'), getBrandProducts);
router.get('/brand/stats', protect, authorize('brand'), getBrandStats);

export default router;

