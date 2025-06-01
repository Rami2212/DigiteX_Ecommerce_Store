import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdStart,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  fetchProductsByCategoryStart,
  fetchProductsByCategorySuccess,
  fetchProductsByCategoryFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  clearSelectedProduct,
  clearProductsByCategory,
  clearProductError,
  clearProductLoading,
} from '../redux/slices/productSlice';
import { productAPI } from '../lib/api/product';

export const useProduct = () => {
  const dispatch = useDispatch();
  const { 
    products, 
    selectedProduct, 
    productsByCategory, 
    isLoading, 
    error 
  } = useSelector((state) => state.product);

  const getProducts = async () => {
    try {
      dispatch(fetchProductsStart());
      const data = await productAPI.getProducts();
      dispatch(fetchProductsSuccess(data));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch products';
      dispatch(fetchProductsFailure(errorMsg));
      toast.error(errorMsg);
    }
  };

  const getProductById = async (id) => {
    try {
      dispatch(fetchProductByIdStart());
      const data = await productAPI.getProductsById(id);
      dispatch(fetchProductByIdSuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch product';
      dispatch(fetchProductByIdFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      dispatch(fetchProductsByCategoryStart());
      const data = await productAPI.getProductsByCategory(categoryId);
      dispatch(fetchProductsByCategorySuccess(data));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch products by category';
      dispatch(fetchProductsByCategoryFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const findProductById = useCallback((id) => {
    return products.find((product) => product._id === id || product._id === parseInt(id)) || null;
  }, [products]);

  const addProduct = async (formData) => {
    try {
      dispatch(addProductStart());
      const data = await productAPI.addProduct(formData);
      dispatch(addProductSuccess(data));
      toast.success('Product added successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to add product';
      dispatch(addProductFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      dispatch(updateProductStart());
      const data = await productAPI.updateProducts(id, formData);
      dispatch(updateProductSuccess(data));
      toast.success('Product updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to update product';
      dispatch(updateProductFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      dispatch(deleteProductStart());
      await productAPI.deleteProduct(id);
      dispatch(deleteProductSuccess(id));
      toast.success('Product deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to delete product';
      dispatch(deleteProductFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    }
  };

  const clearError = () => {
    dispatch(clearProductError());
  };

  const clearLoading = () => {
    dispatch(clearProductLoading());
  };

  const clearSelected = () => {
    dispatch(clearSelectedProduct());
  };

  const clearCategoryProducts = () => {
    dispatch(clearProductsByCategory());
  };

  return {
    // State
    products,
    selectedProduct,
    productsByCategory,
    isLoading,
    error,
    
    // Actions
    getProducts,
    getProductById,
    getProductsByCategory,
    findProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Utility functions
    clearError,
    clearLoading,
    clearSelected,
    clearCategoryProducts,
  };
};