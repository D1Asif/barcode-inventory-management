import express from 'express';
import {
  createProduct,
  getAllProducts,
  searchProducts,
  updateProductCategory,
  deleteProduct,
  getProductById
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Add new product (from scanned barcode)
router.post('/', createProduct);

// Get all products (with optional category filter)
router.get('/', getAllProducts);

// Search products by barcode, description, or material
router.get('/search', searchProducts);

// Update product category
router.patch('/:id/category', updateProductCategory);

// Delete product
router.delete('/:id', deleteProduct);

// Get single product by ID
router.get('/:id', getProductById);

export default router; 