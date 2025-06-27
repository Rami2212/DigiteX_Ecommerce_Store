import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useProduct } from '../../../hooks/useProduct';
import { useCategory } from '../../../hooks/useCategory';
import DeleteModal from '../../../components/modals/DeleteModal';
import Button from '../../../components/common/Button';

const ProductsPage = () => {
  const { 
    products, 
    productsByCategory, 
    isLoading, 
    getProducts, 
    getProductsByCategory, 
    deleteProduct,
    clearCategoryProducts 
  } = useProduct();
  
  const { categories, getCategories } = useCategory();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  // Update filtered products when products or category selection changes
  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(productsByCategory);
    }
  }, [products, productsByCategory, selectedCategory]);

  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === '') {
      // Show all products
      clearCategoryProducts();
      setFilteredProducts(products);
    } else {
      // Fetch products by category
      try {
        await getProductsByCategory(categoryId);
      } catch (error) {
        console.error('Error filtering products by category:', error);
      }
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete._id);
        closeDeleteModal();
        // Refresh the current view
        if (selectedCategory === '') {
          getProducts();
        } else {
          getProductsByCategory(selectedCategory);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Function to render table content based on loading state and data availability
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
            Loading products...
          </td>
        </tr>
      );
    }
    
    if (filteredProducts.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
            {selectedCategory ? 'No products found in this category.' : 'No products available.'}
          </td>
        </tr>
      );
    }
    
    return filteredProducts.map((product) => (
      <tr key={product._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {product.name}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {renderProductImage(product)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {categories.find(cat => cat._id === product.category)?.name || 'Uncategorized'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${product.price?.toFixed(2) || '0.00'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {product.stock || 0}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(product.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <Link 
              to={`/admin/edit-product/${product._id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              <FiEdit2 className="h-5 w-5" />
            </Link>
            <button
              onClick={() => openDeleteModal(product)}
              className="text-red-600 hover:text-red-900"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // Function to render product image
  const renderProductImage = (product) => {
    if (!product.productImage || product.productImages.length === 0) {
      return (
        <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      );
    }
    return (
      <img 
        src={product.productImage || product.productImages[0]} 
        alt={product.name}
        className="h-10 w-10 rounded-md object-cover"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product inventory
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/admin/add-product">
            <Button variant="primary" icon={<FiPlus className="h-4 w-4" />}>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <FiFilter className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryFilter('')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableContent()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductsPage;