import React from 'react';
import PropTypes from 'prop-types';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../common/Button';

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 -top-10 flex items-center justify-center px-4 py-6 bg-black bg-opacity-50 overflow-y-auto">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900" id="modal-title">
            {title}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end sm:flex-row gap-3 sm:gap-0">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full sm:w-auto sm:ml-3"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  isLoading: PropTypes.bool
};

export default DeleteModal;
