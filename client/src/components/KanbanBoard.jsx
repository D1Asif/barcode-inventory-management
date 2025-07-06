import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

// Sortable Product Item Component
const SortableProductItem = ({ product, category }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow duration-200 mb-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {product.description}
          </h4>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Material:</span> {product.material}
            </p>
            <p className="text-xs text-gray-500 font-mono">
              <span className="font-medium">Barcode:</span> {product.barcode}
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium">Category:</span> {product.category}
            </p>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Category Column Component
const CategoryColumn = ({ category, products, onProductMove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-50 rounded-lg p-4 min-h-[500px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {category}
        </h3>
        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
          {products.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-2">
        <SortableContext items={products.map(p => p._id)} strategy={verticalListSortingStrategy}>
          {products.map((product) => (
            <SortableProductItem key={product._id} product={product} category={category} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const { token } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch categories and products
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch categories
      const categoriesResponse = await axios.get(
        'https://barcode-inventory-management.onrender.com/api/categories',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Fetch products
      const productsResponse = await axios.get(
        'https://barcode-inventory-management.onrender.com/api/products',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const fetchedCategories = categoriesResponse.data.categories || [];
      const fetchedProducts = productsResponse.data.products || [];

      console.log('Fetched categories:', fetchedCategories);
      console.log('Fetched products:', fetchedProducts);

      // Extract category names from the API response
      // API returns: { count: number, categories: [{ _id, name, createdAt, __v }] }
      const categoryNames = fetchedCategories.map(cat => cat.name);
      
      // Only use categories that exist in the backend
      const allCategories = [...new Set(categoryNames)];

      console.log('Processed categories:', allCategories);

      setCategories(allCategories);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load kanban board data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success('Kanban board refreshed!');
  };

  // Add new category function
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    // Check for duplicate category names
    if (categories.includes(newCategoryName.trim())) {
      toast.error('Category with this name already exists');
      return;
    }

    try {
      setAddingCategory(true);
      
      const response = await axios.post(
        'https://barcode-inventory-management.onrender.com/api/categories',
        { name: newCategoryName.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        // Add the new category to the list
        setCategories(prev => [...prev, newCategoryName.trim()]);
        setNewCategoryName('');
        setShowAddCategory(false);
        toast.success(`Category "${newCategoryName.trim()}" created successfully!`);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create category';
      toast.error(errorMessage);
    } finally {
      setAddingCategory(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find the product being dragged
    const draggedProduct = products.find(p => p._id === active.id);
    if (!draggedProduct) return;

    // Find the target category
    const targetCategory = over.id;
    
    // Don't allow dropping on the same category
    if (draggedProduct.category === targetCategory) {
      return;
    }

    try {
      // Update product category in backend
      const response = await axios.patch(
        `https://barcode-inventory-management.onrender.com/api/products/${active.id}/category`,
        { category: targetCategory },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Update local state
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product._id === active.id
              ? { ...product, category: targetCategory }
              : product
          )
        );

        toast.success(`Product moved to ${targetCategory}`);
      }
    } catch (error) {
      console.error('Error updating product category:', error);
      toast.error('Failed to update product category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📋 Inventory Kanban Board
          </h2>
          <p className="text-gray-600">
            Drag and drop products between categories to organize your inventory
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddCategory(true)}
            className="btn-primary flex items-center gap-2"
          >
            ➕ Add Category
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh
              </>
            )}
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories
            .filter(category => typeof category === 'string')
            .map((category) => (
            <CategoryColumn
              key={category}
              category={category}
              products={productsByCategory[category] || []}
            />
          ))}
        </div>
      </DndContext>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No products found</div>
          <p className="text-sm text-gray-400">
            Add some products to see them in the kanban board
          </p>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                ➕ Add New Category
              </h3>
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={addingCategory || !newCategoryName.trim()}
                  className="btn-primary flex-1"
                >
                  {addingCategory ? 'Creating...' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  disabled={addingCategory}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard; 