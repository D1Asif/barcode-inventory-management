const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              📊 Analytics Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Total Products
                </h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-blue-700 mt-1">Products in inventory</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Categories
                </h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-green-700 mt-1">Product categories</p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Low Stock
                </h3>
                <p className="text-3xl font-bold text-yellow-600">0</p>
                <p className="text-sm text-yellow-700 mt-1">Items below threshold</p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Out of Stock
                </h3>
                <p className="text-3xl font-bold text-red-600">0</p>
                <p className="text-sm text-red-700 mt-1">Items with zero stock</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>No recent activity to display</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Categories
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>No categories available</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Analytics Features Coming Soon
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time inventory tracking</li>
                <li>• Stock level alerts</li>
                <li>• Sales and purchase history</li>
                <li>• Category-wise analytics</li>
                <li>• Export reports to PDF/Excel</li>
                <li>• Barcode scan statistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 