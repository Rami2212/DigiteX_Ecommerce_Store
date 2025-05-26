import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
  clearCategoryError,
} from '../redux/slices/categorySlice';
import { categoryAPI } from '../lib/api/category';

export const useCategory = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.category);

  const getCategories = async () => {
    try {
      dispatch(fetchCategoriesStart());
      const data = await categoryAPI.getCategories();
      dispatch(fetchCategoriesSuccess(data));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch categories';
      dispatch(fetchCategoriesFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  const getCategoryById = useCallback((id) => {
    return categories.find((cat) => cat._id === id || cat._id === parseInt(id)) || null;
  }, [categories]);

  const addCategory = async (formData) => {
    try {
      const data = await categoryAPI.addCategory(formData);
      dispatch(addCategorySuccess(data));
      toast.success('Category added successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add category';
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateCategory = async (id, formData) => {
    try {
      const data = await categoryAPI.updateCategory(id, formData);
      dispatch(updateCategorySuccess(data));
      toast.success('Category updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update category';
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryAPI.deleteCategory(id);
      dispatch(deleteCategorySuccess(id));
      toast.success('Category deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete category';
      toast.error(errorMsg);
      throw err;
    }
  };

  const clearError = () => {
    dispatch(clearCategoryError());
  };

  return {
    categories,
    isLoading,
    error,
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };
};
