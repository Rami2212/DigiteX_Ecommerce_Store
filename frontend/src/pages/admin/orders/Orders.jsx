import React, { useEffect, useState } from 'react';
import { FiEye, FiTrash2, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useOrder } from '../../../hooks/useOrder';
import DeleteModal from '../../../components/modals/DeleteModal';
import Button from '../../../components/common/Button';

const OrdersPage = () => {
  const { 
    orders, 
    isLoading, 
    totalPages, 
    currentPage, 
    totalOrders,
    getAllOrders, 
    deleteOrder 
  } = useOrder();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentPageState, setCurrentPageState] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [limit] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, [currentPageState, statusFilter]);

  const fetchOrders = () => {
    getAllOrders(currentPageState, limit, statusFilter || null);
  };

  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setOrderToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete._id);
        closeDeleteModal();
        fetchOrders(); // Refresh the list
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPageState(page);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPageState(1); // Reset to first page when filtering
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  // Function to render table content based on loading state and data availability
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
            Loading orders...
          </td>
        </tr>
      );
    }
    
    if (orders.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
            {statusFilter ? `No orders found with status "${statusFilter}".` : 'No orders available.'}
          </td>
        </tr>
      );
    }
    
    return orders.map((order) => (
      <tr key={order._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          #{order._id?.slice(-8) || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.user?.firstName} {order.user?.lastName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.items?.length || 0} item(s)
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          Rs. {order.totalAmount?.toFixed(2) || '0.00'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {renderOrderStatus(order.status)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {renderPaymentStatus(order.paymentStatus)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            <Link 
              to={`/admin/order/${order._id}`}
              className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
              title="View Order"
            >
              <FiEye className="h-5 w-5" />
            </Link>
            <button
              onClick={() => openDeleteModal(order)}
              className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
              title="Delete Order"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  // Function to render order status badge
  const renderOrderStatus = (status) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-indigo-100 text-indigo-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Failed': 'bg-gray-100 text-gray-800',
    };

    const className = statusConfig[status] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  // Function to render payment status badge
  const renderPaymentStatus = (paymentStatus) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Paid': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Refunded': 'bg-gray-100 text-gray-800',
    };

    const className = statusConfig[paymentStatus] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
        {paymentStatus || 'Unknown'}
      </span>
    );
  };

  // Function to render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages} ({totalOrders} total orders)
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Failed', label: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage customer orders and track their status
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            icon={<FiRefreshCw className="h-4 w-4" />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
        {renderPagination()}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${orderToDelete?._id?.slice(-8)}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OrdersPage;