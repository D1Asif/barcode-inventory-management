import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <h1 className="text-lg sm:text-xl font-bold text-primary-600">
                📦 Barcode Inventory
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/scanner"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              📱 Scanner
            </Link>
            <Link
              to="/analytics"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Analytics
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Search
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <Link
            to="/"
            className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/scanner"
            className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={closeMenu}
          >
            📱 Scanner
          </Link>
          <Link
            to="/analytics"
            className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={closeMenu}
          >
            Analytics
          </Link>
          <Link
            to="/search"
            className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={closeMenu}
          >
            Search
          </Link>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="px-3 py-2">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 