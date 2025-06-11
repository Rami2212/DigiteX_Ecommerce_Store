import { useCallback, useRef } from 'react';
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
  clearProducts,
} from '../redux/slices/productSlice';
import { productAPI } from '../lib/api/product';

export const useProduct = () => {
  const dispatch = useDispatch();
  const { 
    products, 
    selectedProduct, 
    productsByCategory, 
    isLoading, 
    error,
    totalPages,
    currentPage,
    totalProducts,
    categoryTotalPages,
    categoryCurrentPage,
    categoryTotalProducts,
  } = useSelector((state) => state.product);

  // Refs to track ongoing requests and prevent duplicates
  const productRequestsRef = useRef(new Set());
  const categoryRequestsRef = useRef(new Set());
  const lastProductIdRef = useRef(null);
  const lastCategoryIdRef = useRef(null);

  const getProducts = useCallback(async (page = 1, limit = 20) => {
    try {
      dispatch(fetchProductsStart());
      const data = await productAPI.getProducts(page, limit);
      dispatch(fetchProductsSuccess(data));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch products';
      dispatch(fetchProductsFailure(errorMsg));
      toast.error(errorMsg);
    }
  }, [dispatch]);

  const getProductById = useCallback(async (id) => {
    // Return early if same product is already selected and loaded
    if (selectedProduct && selectedProduct._id === id && !isLoading) {
      return selectedProduct;
    }

    // Return early if same product ID was just requested
    if (lastProductIdRef.current === id) {
      return selectedProduct;
    }

    // Check if request is already in progress
    if (productRequestsRef.current.has(id)) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (selectedProduct && selectedProduct._id === id) {
            resolve(selectedProduct);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    try {
      // Mark request as in progress
      productRequestsRef.current.add(id);
      lastProductIdRef.current = id;
      
      dispatch(fetchProductByIdStart());
      const data = await productAPI.getProductsById(id);
      dispatch(fetchProductByIdSuccess(data));
      
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch product';
      dispatch(fetchProductByIdFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    } finally {
      // Remove request from progress tracking
      productRequestsRef.current.delete(id);
    }
  }, [dispatch, selectedProduct, isLoading]);

  const getProductsByCategory = useCallback(async (categoryId, page = 1, limit = 20) => {
    const requestKey = `${categoryId}-${page}-${limit}`;
    
    // Return early if same category request was just made
    if (lastCategoryIdRef.current === requestKey) {
      return productsByCategory;
    }

    // Check if request is already in progress
    if (categoryRequestsRef.current.has(requestKey)) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (productsByCategory && productsByCategory.length > 0) {
            resolve(productsByCategory);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    try {
      // Mark request as in progress
      categoryRequestsRef.current.add(requestKey);
      lastCategoryIdRef.current = requestKey;
      
      dispatch(fetchProductsByCategoryStart());
      const data = await productAPI.getProductsByCategory(categoryId, page, limit);
      dispatch(fetchProductsByCategorySuccess(data));
      
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch products by category';
      dispatch(fetchProductsByCategoryFailure(errorMsg));
      toast.error(errorMsg);
      throw err;
    } finally {
      // Remove request from progress tracking
      categoryRequestsRef.current.delete(requestKey);
    }
  }, [dispatch, productsByCategory]);

  const findProductById = useCallback((id) => {
    // Check in main products first
    let product = products.find((product) => product._id === id || product._id === parseInt(id));
    if (product) return product;
    
    // Check in category products
    product = productsByCategory.find((product) => product._id === id || product._id === parseInt(id));
    if (product) return product;
    
    // Check selected product
    if (selectedProduct && (selectedProduct._id === id || selectedProduct._id === parseInt(id))) {
      return selectedProduct;
    }
    
    return null;
  }, [products, productsByCategory, selectedProduct]);

  const addProduct = useCallback(async (formData) => {
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
  }, [dispatch]);

  const updateProduct = useCallback(async (id, formData) => {
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
  }, [dispatch]);

  const deleteProduct = useCallback(async (id) => {
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
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearProductError());
  }, [dispatch]);

  const clearLoading = useCallback(() => {
    dispatch(clearProductLoading());
  }, [dispatch]);

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedProduct());
    // Reset tracking refs when clearing
    lastProductIdRef.current = null;
    productRequestsRef.current.clear();
  }, [dispatch]);

  const clearCategoryProducts = useCallback(() => {
    dispatch(clearProductsByCategory());
    // Reset tracking refs when clearing
    lastCategoryIdRef.current = null;
    categoryRequestsRef.current.clear();
  }, [dispatch]);

  const clearAllProducts = useCallback(() => {
    dispatch(clearProducts());
    // Reset all tracking refs when clearing
    lastProductIdRef.current = null;
    lastCategoryIdRef.current = null;
    productRequestsRef.current.clear();
    categoryRequestsRef.current.clear();
  }, [dispatch]);

  return {
    // State
    products,
    selectedProduct,
    productsByCategory,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalProducts,
    categoryTotalPages,
    categoryCurrentPage,
    categoryTotalProducts,
    
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
    clearAllProducts,
  };
};