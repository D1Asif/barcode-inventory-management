import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { token } = useAuth();

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://barcode-inventory-management.onrender.com/api/categories',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const categoryNames = response.data.categories.map(cat => cat.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      const response = await axios.get(
        `https://barcode-inventory-management.onrender.com/api/products/search?q=${encodeURIComponent(searchTerm.trim())}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setResults(response.data.products || []);
      
      if (response.data.products.length === 0) {
        toast.info('No products found matching your search');
      } else {
        toast.success(`Found ${response.data.products.length} product(s)`);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      const errorMessage = error.response?.data?.error || 'Failed to search products';
      toast.error(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    if (category === selectedCategory) {
      setSelectedCategory('');
      return;
    }

    setSelectedCategory(category);
    
    try {
      setLoading(true);
      
      const response = await axios.get(
        `https://barcode-inventory-management.onrender.com/api/products?category=${encodeURIComponent(category)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setResults(response.data.products || []);
      setSearchTerm(category);
      setHasSearched(true);
      
      if (response.data.products.length === 0) {
        toast.info(`No products found in ${category} category`);
      } else {
        toast.success(`Found ${response.data.products.length} product(s) in ${category}`);
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
      toast.error('Failed to filter by category');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
    setSelectedCategory('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                🔍 Product Search
              </h1>
              {hasSearched && (
                <button
                  onClick={clearSearch}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              )}
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by product name, barcode, or material ID..."
                    className="input-field"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !searchTerm.trim()}
                  className="btn-primary sm:w-auto"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Category Filters */}
            {categories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Filter by Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}

            {/* No Results */}
            {!loading && hasSearched && results.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  No products match your search criteria: "{searchTerm}"
                </p>
                <button
                  onClick={clearSearch}
                  className="btn-primary"
                >
                  Try a different search
                </button>
              </div>
            )}

            {/* Search Results */}
            {!loading && results.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results ({results.length})
                  </h2>
                  <div className="text-sm text-gray-500">
                    Showing {results.length} product(s)
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <div key={product._id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                          {product.description}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.category === 'In Stock' ? 'bg-green-100 text-green-800' :
                          product.category === 'Stock Out' ? 'bg-red-100 text-red-800' :
                          product.category === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {product.category}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-medium">Material ID:</span>
                          <span className="font-mono">{product.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Barcode:</span>
                          <span className="font-mono">{product.barcode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Added:</span>
                          <span>{formatDate(product.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Product ID: {product._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search; 