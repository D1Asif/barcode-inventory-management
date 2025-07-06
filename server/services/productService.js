import Product from '../models/Product.js';

const createProduct = async (productData) => {
  const { material, barcode, description, category } = productData;

  // Check if product with same material or barcode already exists
  const existingProduct = await Product.findOne({
    $or: [{ material }, { barcode }]
  });

  if (existingProduct) {
    throw new Error('Product with this material number or barcode already exists');
  }

  const product = new Product({
    material,
    barcode,
    description,
    category: category || 'Uncategorized'
  });

  await product.save();

  return {
    message: 'Product added successfully',
    product
  };
};

const getAllProducts = async (category = null) => {
  const filter = category ? { category } : {};
  
  const products = await Product.find(filter)
    .sort({ createdAt: -1 });

  return {
    count: products.length,
    products
  };
};

const searchProducts = async (query) => {
  if (!query) {
    throw new Error('Search query is required');
  }

  // Check if query is a number (material search)
  const isMaterialSearch = !isNaN(query) && query.trim() !== '';

  let searchQuery;
  if (isMaterialSearch) {
    // Exact material number search
    searchQuery = { material: parseInt(query) };
  } else {
    // Partial search for barcode and description
    searchQuery = {
      $or: [
        { barcode: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };
  }

  const products = await Product.find(searchQuery)
    .sort({ createdAt: -1 });

  return {
    count: products.length,
    query,
    products
  };
};

const updateProductCategory = async (productId, category) => {
  if (!category) {
    throw new Error('Category is required');
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { category },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new Error('Product not found');
  }

  return {
    message: 'Product category updated successfully',
    product
  };
};

const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  return {
    message: 'Product deleted successfully',
    product
  };
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  return { product };
};

export {
  createProduct,
  getAllProducts,
  searchProducts,
  updateProductCategory,
  deleteProduct,
  getProductById
}; 