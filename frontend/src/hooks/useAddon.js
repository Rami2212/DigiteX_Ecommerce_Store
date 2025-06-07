import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchAddonsStart,
  fetchAddonsSuccess,
  fetchAddonsFailure,
  addAddonSuccess,
  updateAddonSuccess,
  deleteAddonSuccess,
  clearAddonError,
} from '../redux/slices/addonSlice';
import { addonAPI } from '../lib/api/addon';

export const useAddon = () => {
  const dispatch = useDispatch();
  const { addons, isLoading, error } = useSelector((state) => state.addon);

  const getAddons = async () => {
    try {
      dispatch(fetchAddonsStart());
      const data = await addonAPI.getAddons();
      dispatch(fetchAddonsSuccess(data));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch addons';
      dispatch(fetchAddonsFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  const getAddonById = useCallback((id) => {
    return addons.find((cat) => cat._id === id || cat._id === parseInt(id)) || null;
  }, [addons]);

  const addAddon = async (formData) => {
    try {
      const data = await addonAPI.addAddon(formData);
      dispatch(addAddonSuccess(data));
      toast.success('Addon added successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add addon';
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateAddon = async (id, formData) => {
    try {
      const data = await addonAPI.updateAddon(id, formData);
      dispatch(updateAddonSuccess(data));
      toast.success('Addon updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update addon';
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteAddon = async (id) => {
    try {
      await addonAPI.deleteAddon(id);
      dispatch(deleteAddonSuccess(id));
      toast.success('Addon deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete addon';
      toast.error(errorMsg);
      throw err;
    }
  };

  const clearError = () => {
    dispatch(clearAddonError());
  };

  return {
    addons,
    isLoading,
    error,
    getAddons,
    getAddonById,
    addAddon,
    updateAddon,
    deleteAddon,
    clearError,
  };
};
