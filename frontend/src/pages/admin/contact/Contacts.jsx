import React, { useEffect, useState } from 'react';
import { FiMail, FiEye, FiTrash2, FiFilter, FiSearch, FiPhone, FiClock } from 'react-icons/fi';
import { HiOutlineExclamation, HiOutlineCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useContact } from '../../../hooks/useContact';
import DeleteModal from '../../../components/modals/DeleteModal';
import Button from '../../../components/common/Button';

const ContactsPage = () => {
  const {
    contacts,
    contactStats,
    pagination,
    isLoading,
    filters,
    getContacts,
    deleteContact,
    getContactStats,
    updateFilters,
    getStatusColor,
    getPriorityColor,
    formatContactDate,
  } = useContact();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    getContacts();
    getContactStats();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ page: 1, search: searchTerm });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    updateFilters({ page: 1, status: status || undefined });
  };

  const handlePriorityFilter = (priority) => {
    setPriorityFilter(priority);
    updateFilters({ page: 1, priority: priority || undefined });
  };

  const handlePageChange = (page) => {
    updateFilters({ page });
  };

  const openDeleteModal = (contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setContactToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (contactToDelete) {
      try {
        await deleteContact(contactToDelete._id);
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    const icons = {
      urgent: <HiOutlineExclamation className="h-3 w-3 mr-1" />,
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>
        {icons[priority]}
        {priority}
      </span>
    );
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
            Loading contacts...
          </td>
        </tr>
      );
    }

    if (contacts.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
            No contacts found.
          </td>
        </tr>
      );
    }

    return contacts.map((contact) => (
      <tr key={contact._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div>
            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
            <div className="text-sm text-gray-500">{contact.email}</div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900 max-w-xs truncate">{contact.subject}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {getStatusBadge(contact.status)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {getPriorityBadge(contact.priority)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {contact.phone || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatContactDate(contact.createdAt)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <Link
              to={`/admin/contact-detail/${contact._id}`}
              className="text-blue-600 hover:text-blue-900"
              title="View Contact"
            >
              <FiEye className="h-5 w-5" />
            </Link>
            <button
              onClick={() => openDeleteModal(contact)}
              className="text-red-600 hover:text-red-900"
              title="Delete Contact"
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
          <h1 className="text-2xl font-semibold text-gray-900">Contact Messages</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage customer inquiries and support requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {contactStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {contactStats.statusStats && contactStats.statusStats.map((stat) => (
            <div key={stat._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat._id === 'pending' && <FiClock className="h-8 w-8 text-yellow-500" />}
                  {stat._id === 'in-progress' && <FiMail className="h-8 w-8 text-blue-500" />}
                  {stat._id === 'resolved' && <HiOutlineCheckCircle className="h-8 w-8 text-green-500" />}
                  {stat._id === 'closed' && <FiTrash2 className="h-8 w-8 text-gray-500" />}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                      {stat._id.replace('-', ' ')}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.count}</dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiSearch className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => handlePriorityFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalContacts} total contacts)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Contact"
        message={`Are you sure you want to delete the message from "${contactToDelete?.name}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ContactsPage;