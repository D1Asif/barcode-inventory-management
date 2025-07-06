import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(
          'https://barcode-inventory-management.onrender.com/api/analytics',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        const errorMessage = error.response?.data?.error || 'Failed to load analytics data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  // Calculate additional statistics
  const getCategoryStats = () => {
    if (!analyticsData?.categoryCounts) return { totalCategories: 0, topCategory: null };
    
    const categories = analyticsData.categoryCounts;
    const totalCategories = categories.length;
    const topCategory = categories.reduce((max, current) => 
      current.count > max.count ? current : max
    );
    
    return { totalCategories, topCategory };
  };

  const getStockStatus = () => {
    if (!analyticsData?.categoryCounts) return { inStock: 0, outOfStock: 0, lowStock: 0 };
    
    const categories = analyticsData.categoryCounts;
    const inStock = categories.find(cat => cat.name === 'In Stock')?.count || 0;
    const outOfStock = categories.find(cat => cat.name === 'Stock Out')?.count || 0;
    const lowStock = categories.find(cat => cat.name === 'Low Stock')?.count || 0;
    
    return { inStock, outOfStock, lowStock };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="card text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { totalCategories, topCategory } = getCategoryStats();
  const { inStock, outOfStock, lowStock } = getStockStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Analytics Dashboard
              </h1>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Total Products
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {analyticsData?.totalProducts || 0}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">Products in inventory</p>
                  </div>
                  <div className="text-3xl">📦</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Categories
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {totalCategories}
                    </p>
                    <p className="text-sm text-green-700 mt-1">Product categories</p>
                  </div>
                  <div className="text-3xl">🏷️</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                      In Stock
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600">
                      {inStock}
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">Available items</p>
                  </div>
                  <div className="text-3xl">✅</div>
                </div>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Out of Stock
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                      {outOfStock}
                    </p>
                    <p className="text-sm text-red-700 mt-1">Items with zero stock</p>
                  </div>
                  <div className="text-3xl">❌</div>
                </div>
              </div>
            </div>

            {/* Category Distribution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Category Distribution
                </h3>
                <div className="space-y-3">
                  {analyticsData?.categoryCounts?.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{
                            backgroundColor: [
                              '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                            ][index % 5]
                          }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-gray-900 mr-2">
                          {category.count}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({((category.count / analyticsData.totalProducts) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🏆 Top Category
                </h3>
                {topCategory ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {topCategory.name}
                    </h4>
                    <p className="text-3xl font-bold text-primary-600 mb-2">
                      {topCategory.count}
                    </p>
                    <p className="text-sm text-gray-600">
                      {((topCategory.count / analyticsData.totalProducts) * 100).toFixed(1)}% of total products
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No categories available
                  </div>
                )}
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📦 Recent Products
              </h3>
              {analyticsData?.recentProducts?.products?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Barcode
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Added
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analyticsData.recentProducts.products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {product.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">
                              {product.material}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">
                              {product.barcode}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(product.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent products to display
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">📈 Inventory Growth</h3>
                <p className="text-2xl font-bold">{analyticsData?.totalProducts || 0}</p>
                <p className="text-sm opacity-90">Total products tracked</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">📊 Category Diversity</h3>
                <p className="text-2xl font-bold">{totalCategories}</p>
                <p className="text-sm opacity-90">Active categories</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">🔄 Recent Activity</h3>
                <p className="text-2xl font-bold">{analyticsData?.recentProducts?.count || 0}</p>
                <p className="text-sm opacity-90">Recent additions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 