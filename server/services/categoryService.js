import Category from '../models/Category.js';
import Product from '../models/Product.js';

const getAllCategories = async () => {
  const categories = await Category.find()
    .sort({ name: 1 });

  return {
    count: categories.length,
    categories
  };
};

const createCategory = async (categoryData) => {
  const { name } = categoryData;

  if (!name) {
    throw new Error('Category name is required');
  }

  // Check if category already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new Error('Category with this name already exists');
  }

  const category = new Category({ name });
  await category.save();

  return {
    message: 'Category created successfully',
    category
  };
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  // Check if category is being used by any products
  const productsWithCategory = await Product.findOne({ category: category.name });
  if (productsWithCategory) {
    throw new Error('Cannot delete category. It is being used by one or more products.');
  }

  await Category.findByIdAndDelete(categoryId);

  return {
    message: 'Category deleted successfully',
    category
  };
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  return { category };
};

export {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategoryById
}; 