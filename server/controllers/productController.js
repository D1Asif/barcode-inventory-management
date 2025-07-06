import {
  createProduct,
  getAllProducts,
  searchProducts,
  updateProductCategory,
  deleteProduct,
  getProductById
} from '../services/productService.js';

const createProductHandler = async (req, res) => {
  try {
    const result = await createProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: error.message || 'Failed to add product' });
  }
};

const getAllProductsHandler = async (req, res) => {
  try {
    const { category } = req.query;
    const result = await getAllProducts(category);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const searchProductsHandler = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await searchProducts(q);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Search failed' });
  }
};

const updateProductCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const result = await updateProductCategory(id, category);
    res.json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Failed to update product category' });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduct(id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const getProductByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProductById(id);
    res.json(result);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export {
  createProductHandler as createProduct,
  getAllProductsHandler as getAllProducts,
  searchProductsHandler as searchProducts,
  updateProductCategoryHandler as updateProductCategory,
  deleteProductHandler as deleteProduct,
  getProductByIdHandler as getProductById
}; 