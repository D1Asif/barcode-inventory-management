import {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategoryById
} from '../services/categoryService.js';

const getAllCategoriesHandler = async (req, res) => {
  try {
    const result = await getAllCategories();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const createCategoryHandler = async (req, res) => {
  try {
    const result = await createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: error.message || 'Failed to create category' });
  }
};

const deleteCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCategory(id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Failed to delete category' });
  }
};

const getCategoryByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getCategoryById(id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export {
  getAllCategoriesHandler as getAllCategories,
  createCategoryHandler as createCategory,
  deleteCategoryHandler as deleteCategory,
  getCategoryByIdHandler as getCategoryById
}; 