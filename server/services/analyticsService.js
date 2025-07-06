import Product from '../models/Product.js';
import Category from '../models/Category.js';

const getAnalyticsOverview = async () => {
  // Get product counts per category
  const categoryCounts = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get recent products (last 10)
  const recentProducts = await Product.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('material barcode description category createdAt');

  // Get total product count
  const totalProducts = await Product.countDocuments();

  // Get all categories for reference
  const allCategories = await Category.find()
    .sort({ name: 1 })
    .select('name');

  // Format category counts to include categories with 0 products
  const formattedCategoryCounts = allCategories.map(cat => {
    const countData = categoryCounts.find(cc => cc._id === cat.name);
    return {
      name: cat.name,
      count: countData ? countData.count : 0
    };
  });

  // Add any categories that exist in products but not in categories collection
  categoryCounts.forEach(cc => {
    const exists = formattedCategoryCounts.find(fc => fc.name === cc._id);
    if (!exists) {
      formattedCategoryCounts.push({
        name: cc._id,
        count: cc.count
      });
    }
  });

  return {
    totalProducts,
    categoryCounts: formattedCategoryCounts,
    recentProducts: {
      count: recentProducts.length,
      products: recentProducts
    }
  };
};

const getCategoryAnalytics = async (categoryName) => {
  if (!categoryName) {
    throw new Error('Category parameter is required');
  }

  // Get products in specific category
  const products = await Product.find({ category: categoryName })
    .sort({ createdAt: -1 });

  // Get category info
  const categoryInfo = await Category.findOne({ name: categoryName });

  return {
    category: categoryInfo || { name: categoryName },
    productCount: products.length,
    products
  };
};

export {
  getAnalyticsOverview,
  getCategoryAnalytics
}; 