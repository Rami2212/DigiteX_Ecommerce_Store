import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAddon } from '../../../hooks/useAddon';
import DeleteModal from '../../../components/modals/DeleteModal';
import Button from '../../../components/common/Button';
import * as Icons from 'react-icons/fi';

const AddonsPage = () => {
  const { addons, isLoading, getAddons, deleteAddon } = useAddon();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState(null);

  useEffect(() => {
    getAddons();
  }, []);

  const openDeleteModal = (addon) => {
    setAddonToDelete(addon);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setAddonToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (addonToDelete) {
      try {
        await deleteAddon(addonToDelete._id);
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting addon:', error);
      }
    }
  };

  // Function to render icon from icon name
  const renderIcon = (iconName) => {
    if (!iconName) return '-';
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6 text-gray-600" />;
    }
    return '-';
  };

  // Function to render table content based on loading state and data availability
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
            Loading addons...
          </td>
        </tr>
      );
    }
    
    if (addons.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
            No addons available.
          </td>
        </tr>
      );
    }
    
    return addons.map((addon) => (
      <tr key={addon._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {addon.name}
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
          <div className="truncate" title={addon.description}>
            {addon.description}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex justify-center">
            {renderIcon(addon.icon)}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Rs.{addon.price}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(addon.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <Link 
              to={`/admin/edit-addon/${addon._id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              <FiEdit2 className="h-5 w-5" />
            </Link>
            <button
              onClick={() => openDeleteModal(addon)}
              className="text-red-600 hover:text-red-900"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Addons</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your service addons
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/admin/add-addon">
            <Button variant="primary" icon={<FiPlus className="h-4 w-4" />}>
              Add Addon
            </Button>
          </Link>
        </div>
      </div>

      {/* Addons Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Icon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
        title="Delete Addon"
        message={`Are you sure you want to delete "${addonToDelete?.name}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AddonsPage;