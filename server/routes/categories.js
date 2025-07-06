import express from 'express';
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategoryById
} from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all categories
router.get('/', getAllCategories);

// Create new category
router.post('/', createCategory);

// Delete category
router.delete('/:id', deleteCategory);

// Get single category by ID
router.get('/:id', getCategoryById);

export default router; 