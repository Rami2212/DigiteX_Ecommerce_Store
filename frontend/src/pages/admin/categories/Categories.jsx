import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCategory } from '../../../hooks/useCategory';
import DeleteModal from '../../../components/modals/DeleteModal';
import Button from '../../../components/common/Button';

const CategoriesPage = () => {
  const { categories, isLoading, getCategories, deleteCategory } = useCategory();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete._id);
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  // Function to render table content based on loading state and data availability
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
            Loading categories...
          </td>
        </tr>
      );
    }
    
    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
            No categories available.
          </td>
        </tr>
      );
    }
    
    return categories.map((category) => (
      <tr key={category._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {category.name}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {renderSubcategories(category)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {renderCategoryImage(category)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(category.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <Link 
              to={`/admin/edit-category/${category._id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              <FiEdit2 className="h-5 w-5" />
            </Link>
            <button
              onClick={() => openDeleteModal(category)}
              className="text-red-600 hover:text-red-900"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // Function to render subcategories
  const renderSubcategories = (category) => {
    if (!category.subCategories || category.subCategories.length === 0) {
      return '-';
    }
    return category.subCategories.join(', ');
  };

  // Function to render category image
  const renderCategoryImage = (category) => {
    if (!category.categoryImage) {
      return '-';
    }
    return (
      <img 
        src={category.categoryImage} 
        alt={category.name}
        className="h-10 w-10 rounded-md object-cover"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your content categories
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/admin/add-category">
            <Button variant="primary" icon={<FiPlus className="h-4 w-4" />}>
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subcategories
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
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
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CategoriesPage;