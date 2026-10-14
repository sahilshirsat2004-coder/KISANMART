import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  getMyProducts 
} from '../controllers/productController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Specific routes MUST come before parameterized route (/:id)
router.get('/', getProducts);
router.get('/farmer/my-products', verifyToken, requireRole('FARMER', 'ADMIN'), getMyProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, requireRole('FARMER', 'ADMIN'), createProduct);

export default router;