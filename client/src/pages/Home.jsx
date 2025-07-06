import { useAuth } from '../contexts/AuthContext.jsx';
import BarcodeScanner from '../components/BarcodeScanner.jsx';
import KanbanBoard from '../components/KanbanBoard.jsx';
import { useState } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showScanner ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  📱 Barcode Scanner
                </h1>
                <button
                  onClick={() => setShowScanner(false)}
                  className="btn-secondary"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <BarcodeScanner />
            </div>
          ) : (
            <>
              <div className="card mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to Barcode Inventory Management
                </h1>
                
                <p className="text-gray-600 mb-6">
                  Hello, {user?.name || 'User'}! Welcome to your inventory management dashboard.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      📦 Products
                    </h3>
                    <p className="text-blue-700">
                      Manage your product inventory with barcode scanning capabilities.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      📊 Analytics
                    </h3>
                    <p className="text-green-700">
                      View detailed analytics and reports about your inventory.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      🔍 Search
                    </h3>
                    <p className="text-purple-700">
                      Search and filter products by barcode, name, or category.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button 
                      onClick={() => setShowScanner(true)}
                      className="btn-primary"
                    >
                      📱 Scan Barcode
                    </button>
                  </div>
                </div>
              </div>

              {/* Kanban Board Section */}
              <div className="card">
                <KanbanBoard />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 