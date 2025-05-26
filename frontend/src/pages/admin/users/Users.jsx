import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser';
import DeleteModal from '../../../components/modals/DeleteModal';
import Button from '../../../components/common/Button';

const UsersPage = () => {
  const { users, isLoading, getUsers, deleteUser } = useUser();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete._id);
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Function to render table content based on loading state and data availability
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
            Loading users...
          </td>
        </tr>
      );
    }
    
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
            No users available.
          </td>
        </tr>
      );
    }
    
    return users.map((user) => (
      <tr key={user._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              {renderUserImage(user)}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">
                @{user.username}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.phone || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {renderRoleBadge(user.role)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {renderVerificationStatus(user.isVerified)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <Link 
              to={`/admin/edit-user/${user._id}`}
              className="text-blue-600 hover:text-blue-900"
            >
              <FiEdit2 className="h-5 w-5" />
            </Link>
            <button
              onClick={() => openDeleteModal(user)}
              className="text-red-600 hover:text-red-900"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // Function to render user profile image
  const renderUserImage = (user) => {
    if (user.profileImage) {
      return (
        <img 
          src={user.profileImage} 
          alt={`${user.firstName} ${user.lastName}`}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
        <FiUser className="h-5 w-5 text-gray-500" />
      </div>
    );
  };

  // Function to render role badge
  const renderRoleBadge = (role) => {
    const isAdmin = role === 'admin';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isAdmin 
          ? 'bg-purple-100 text-purple-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {isAdmin ? <FiShield className="mr-1 h-3 w-3" /> : <FiUser className="mr-1 h-3 w-3" />}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // Function to render verification status
  const renderVerificationStatus = (isVerified) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isVerified 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isVerified ? 'Verified' : 'Not Verified'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all users in your system
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/admin/add-user">
            <Button variant="primary" icon={<FiPlus className="h-4 w-4" />}>
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
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
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.firstName} ${userToDelete?.lastName}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersPage;