import express from 'express';
import { createProduct, getProducts, getProductById, getMyProducts } from '../controllers/productController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, requireRole('FARMER', 'ADMIN'), createProduct);
router.get('/farmer/my-products', verifyToken, requireRole('FARMER', 'ADMIN'), getMyProducts);

export default router;
