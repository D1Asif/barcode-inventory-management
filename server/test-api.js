import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const testProduct = {
  material: 12345,
  barcode: '1234567890123',
  description: 'Test Product',
  category: 'In Stock'
};

// Helper function to make authenticated requests
const authRequest = (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test functions
const testHealthCheck = async () => {
  try {
    console.log('🔍 Testing health check...');
    const response = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
};

const testRegistration = async () => {
  try {
    console.log('\n🔍 Testing user registration...');
    const response = await authRequest('POST', '/auth/register', testUser);
    authToken = response.data.token;
    console.log('✅ Registration successful:', response.data.message);
    return true;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.error.includes('already exists')) {
      console.log('⚠️  User already exists, trying login...');
      return await testLogin();
    }
    console.log('❌ Registration failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testLogin = async () => {
  try {
    console.log('\n🔍 Testing user login...');
    const response = await authRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.token;
    console.log('✅ Login successful:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testCreateProduct = async () => {
  try {
    console.log('\n🔍 Testing product creation...');
    const response = await authRequest('POST', '/products', testProduct);
    console.log('✅ Product created:', response.data.message);
    return response.data.product._id;
  } catch (error) {
    console.log('❌ Product creation failed:', error.response?.data?.error || error.message);
    return null;
  }
};

const testGetProducts = async () => {
  try {
    console.log('\n🔍 Testing get products...');
    const response = await authRequest('GET', '/products');
    console.log('✅ Products retrieved:', response.data.count, 'products');
    return true;
  } catch (error) {
    console.log('❌ Get products failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testSearchProducts = async () => {
  try {
    console.log('\n🔍 Testing product search...');
    const response = await authRequest('GET', '/products/search?q=test');
    console.log('✅ Search successful:', response.data.count, 'results');
    return true;
  } catch (error) {
    console.log('❌ Search failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testGetCategories = async () => {
  try {
    console.log('\n🔍 Testing get categories...');
    const response = await authRequest('GET', '/categories');
    console.log('✅ Categories retrieved:', response.data.count, 'categories');
    return true;
  } catch (error) {
    console.log('❌ Get categories failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testCreateCategory = async () => {
  try {
    console.log('\n🔍 Testing category creation...');
    const response = await authRequest('POST', '/categories', { name: 'Test Category' });
    console.log('✅ Category created:', response.data.message);
    return response.data.category._id;
  } catch (error) {
    console.log('❌ Category creation failed:', error.response?.data?.error || error.message);
    return null;
  }
};

const testAnalytics = async () => {
  try {
    console.log('\n🔍 Testing analytics...');
    const response = await authRequest('GET', '/analytics');
    console.log('✅ Analytics retrieved:', response.data.totalProducts, 'total products');
    return true;
  } catch (error) {
    console.log('❌ Analytics failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testUpdateProductCategory = async (productId) => {
  if (!productId) return false;
  
  try {
    console.log('\n🔍 Testing product category update...');
    const response = await authRequest('PATCH', `/products/${productId}/category`, {
      category: 'Stock Out'
    });
    console.log('✅ Product category updated:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Product category update failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testDeleteProduct = async (productId) => {
  if (!productId) return false;
  
  try {
    console.log('\n🔍 Testing product deletion...');
    const response = await authRequest('DELETE', `/products/${productId}`);
    console.log('✅ Product deleted:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Product deletion failed:', error.response?.data?.error || error.message);
    return false;
  }
};

const testDeleteCategory = async (categoryId) => {
  if (!categoryId) return false;
  
  try {
    console.log('\n🔍 Testing category deletion...');
    const response = await authRequest('DELETE', `/categories/${categoryId}`);
    console.log('✅ Category deleted:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Category deletion failed:', error.response?.data?.error || error.message);
    return false;
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting API tests...\n');
  
  // Test health check first
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Server is not running. Please start the server first.');
    return;
  }
  
  // Test authentication
  const authOk = await testRegistration();
  if (!authOk) {
    console.log('\n❌ Authentication failed. Stopping tests.');
    return;
  }
  
  // Test product operations
  const productId = await testCreateProduct();
  await testGetProducts();
  await testSearchProducts();
  
  // Test category operations
  const categoryId = await testCreateCategory();
  await testGetCategories();
  
  // Test analytics
  await testAnalytics();
  
  // Test updates
  await testUpdateProductCategory(productId);
  
  // Test deletions (cleanup)
  await testDeleteProduct(productId);
  await testDeleteCategory(categoryId);
  
  console.log('\n🎉 All tests completed!');
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export {
  runTests,
  testHealthCheck,
  testRegistration,
  testLogin
}; 