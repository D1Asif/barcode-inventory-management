import { useState } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    // TODO: Implement actual search API call
    // For now, just simulate loading
    setTimeout(() => {
      setResults([]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🔍 Product Search
            </h1>
            
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for products..."
                    className="input-field"
                  />
                </div>
                
                <div className="sm:w-48">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="input-field"
                  >
                    <option value="name">Product Name</option>
                    <option value="barcode">Barcode</option>
                    <option value="category">Category</option>
                  </select>
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

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            )}

            {!loading && searchTerm && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No products found matching your search.</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results ({results.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.barcode}</p>
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !searchTerm && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📦</div>
                    <h4 className="font-medium text-gray-900">Search by Name</h4>
                    <p className="text-sm text-gray-600">Find products by their name</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">📱</div>
                    <h4 className="font-medium text-gray-900">Scan Barcode</h4>
                    <p className="text-sm text-gray-600">Use barcode scanner for quick lookup</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏷️</div>
                    <h4 className="font-medium text-gray-900">Filter by Category</h4>
                    <p className="text-sm text-gray-600">Browse products by category</p>
                  </div>
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