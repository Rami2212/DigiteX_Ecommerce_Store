import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  submitContactStart,
  submitContactSuccess,
  submitContactFailure,
  clearSubmitStatus,
  fetchContactsStart,
  fetchContactsSuccess,
  fetchContactsFailure,
  fetchContactByIdStart,
  fetchContactByIdSuccess,
  fetchContactByIdFailure,
  updateContactStart,
  updateContactSuccess,
  updateContactFailure,
  deleteContactStart,
  deleteContactSuccess,
  deleteContactFailure,
  fetchContactStatsStart,
  fetchContactStatsSuccess,
  fetchContactStatsFailure,
  setFilters,
  resetFilters,
  clearError,
  clearCurrentContact,
} from '../redux/slices/contactSlice';
import { contactAPI } from '../lib/api/contact';

export const useContact = () => {
  const dispatch = useDispatch();
  const {
    isSubmitting,
    submitSuccess,
    submitError,
    contacts,
    currentContact,
    contactStats,
    pagination,
    isLoading,
    error,
    filters,
  } = useSelector((state) => state.contact);

  // Submit contact form (public)
  const submitContact = async (contactData) => {
    try {
      dispatch(submitContactStart());
      const data = await contactAPI.submitContact(contactData);
      dispatch(submitContactSuccess(data));
      toast.success(data.message || 'Message sent successfully! We will get back to you soon.');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send message. Please try again.';
      dispatch(submitContactFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Admin functions
  const getContacts = async (customFilters = {}) => {
    try {
      dispatch(fetchContactsStart());
      const filterParams = { ...filters, ...customFilters };
      const data = await contactAPI.getContacts(filterParams);
      dispatch(fetchContactsSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch contacts';
      dispatch(fetchContactsFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const getContactById = async (contactId) => {
    try {
      dispatch(fetchContactByIdStart());
      const data = await contactAPI.getContactById(contactId);
      dispatch(fetchContactByIdSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch contact details';
      dispatch(fetchContactByIdFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateContactStatus = async (contactId, updateData) => {
    try {
      dispatch(updateContactStart());
      const data = await contactAPI.updateContactStatus(contactId, updateData);
      dispatch(updateContactSuccess(data));
      toast.success(data.message || 'Contact updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update contact';
      dispatch(updateContactFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteContact = async (contactId) => {
    try {
      dispatch(deleteContactStart());
      await contactAPI.deleteContact(contactId);
      dispatch(deleteContactSuccess(contactId));
      toast.success('Contact deleted successfully');
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete contact';
      dispatch(deleteContactFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const getContactsByEmail = async (email) => {
    try {
      const data = await contactAPI.getContactsByEmail(email);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch contacts by email';
      toast.error(errorMsg);
      throw err;
    }
  };

  const getContactStats = async () => {
    try {
      dispatch(fetchContactStatsStart());
      const data = await contactAPI.getContactStats();
      dispatch(fetchContactStatsSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch contact statistics';
      dispatch(fetchContactStatsFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  // Utility functions
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const resetContactFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const clearContactError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearSubmitContactStatus = useCallback(() => {
    dispatch(clearSubmitStatus());
  }, [dispatch]);

  const clearContact = useCallback(() => {
    dispatch(clearCurrentContact());
  }, [dispatch]);

  // Helper functions
  const getStatusColor = useCallback((status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }, []);

  const getPriorityColor = useCallback((priority) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800';
  }, []);

  const formatContactDate = useCallback((date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return {
    // State
    isSubmitting,
    submitSuccess,
    submitError,
    contacts,
    currentContact,
    contactStats,
    pagination,
    isLoading,
    error,
    filters,

    // Actions
    submitContact,
    getContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    getContactsByEmail,
    getContactStats,

    // Utilities
    updateFilters,
    resetContactFilters,
    clearContactError,
    clearSubmitContactStatus,
    clearContact,

    // Helpers
    getStatusColor,
    getPriorityColor,
    formatContactDate,
  };
};