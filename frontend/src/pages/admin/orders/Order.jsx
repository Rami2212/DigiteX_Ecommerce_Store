import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiCalendar,
  FiTruck,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useOrder } from '../../../hooks/useOrder';
import Button from '../../../components/common/Button';
import DeleteModal from '../../../components/modals/DeleteModal';

const SingleOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, isLoading, getOrderById, deleteOrder } = useOrder();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      await getOrderById(orderId);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    }
  };

  const handleBack = () => {
    navigate('/admin/orders');
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(orderId);
      closeDeleteModal();
      navigate('/admin/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Handle case where orderId is not provided
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Order ID Not Found
          </h1>
          <Button onClick={handleBack}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Handle case where order data is incomplete
  if (!currentOrder._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={handleBack}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

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
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
        {status || 'Unknown'}
      </span>
    );
  };

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
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${className}`}>
        {paymentStatus || 'Unknown'}
      </span>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<FiArrowLeft className="h-5 w-5" />}
              onClick={handleBack}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{currentOrder._id?.slice(-8)}
              </h1>
              <p className="text-sm text-gray-600">
                Created on {new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center sm:justify-end w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<FiTrash2 className="h-4 w-4" />}
              onClick={openDeleteModal}
              className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Order Status</span>
                {renderOrderStatus(currentOrder.status)}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Payment Status</span>
                {renderPaymentStatus(currentOrder.paymentStatus)}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Payment Method</span>
                <span className="text-sm text-gray-900 capitalize">
                  {currentOrder.paymentMethod === 'stripe' ? 'Credit/Debit Card' : currentOrder.paymentMethod || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Delivery Status</span>
                <span className={`text-sm ${currentOrder.isDelivered ? 'text-green-600' : 'text-yellow-600'}`}>
                  {currentOrder.isDelivered ? 'Delivered' : 'Not Delivered'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiPackage className="h-5 w-5" />
              Order Items ({currentOrder.items?.length || 0})
            </h2>

            <div className="space-y-4">
              {currentOrder.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      <span>Quantity: {item.quantity}</span>
                      {item.selectedVariant?.color && (
                        <span className="ml-4">Color: {item.selectedVariant.color}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rs. {item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  Rs. {currentOrder.totalAmount?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin className="h-5 w-5" />
              Shipping Address
            </h2>

            {currentOrder.shippingAddress ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">
                  {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
                </p>
                <p>{currentOrder.shippingAddress.addressLine1}</p>
                {currentOrder.shippingAddress.addressLine2 && (
                  <p>{currentOrder.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}
                </p>
                <p>{currentOrder.shippingAddress.country}</p>
                <p className="pt-2">
                  <span className="font-medium">Phone:</span> {currentOrder.shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No shipping address provided</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="h-5 w-5" />
              Customer Information
            </h2>

            {currentOrder.user ? (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600 block">Name</span>
                  <span className="text-sm text-gray-900">
                    {currentOrder.user.firstName} {currentOrder.user.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 block">Email</span>
                  <span className="text-sm text-gray-900">{currentOrder.user.email}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600 block">User ID</span>
                  <span className="text-sm text-gray-500 font-mono">
                    {currentOrder.user._id?.slice(-8)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Customer information not available</p>
            )}
          </div>

          {/* Order Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiCalendar className="h-5 w-5" />
              Order Timeline
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Created</span>
                <span className="text-gray-900">
                  {new Date(currentOrder.createdAt).toLocaleDateString()}
                </span>
              </div>

              {currentOrder.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Received</span>
                  <span className="text-gray-900">
                    {new Date(currentOrder.paidAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {currentOrder.deliveredAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivered</span>
                  <span className="text-gray-900">
                    {new Date(currentOrder.deliveredAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900">
                  {new Date(currentOrder.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiTruck className="h-5 w-5" />
              Shipping Method
            </h2>

            <div className="text-sm">
              <span className="capitalize text-gray-900">
                {currentOrder.shippingMethod || 'Standard Shipping'}
              </span>
            </div>
          </div>

          {/* Payment Information */}
          {currentOrder.paymentIntentId && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiCreditCard className="h-5 w-5" />
                Payment Information
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 block">Payment Intent ID</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {currentOrder.paymentIntentId}
                  </span>
                </div>
                {currentOrder.checkoutSessionId && (
                  <div>
                    <span className="text-gray-600 block">Checkout Session ID</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {currentOrder.checkoutSessionId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${currentOrder._id?.slice(-8)}? This action cannot be undone and will permanently remove all order data.`}
        isLoading={isLoading}
      />
    </motion.div>
  );
};

export default SingleOrderPage;