import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedProduct: null,
  productsByCategory: [],
  isLoading: false,
  error: null,
  // Pagination states for all products
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
  // Pagination states for products by category
  categoryTotalPages: 1,
  categoryCurrentPage: 1,
  categoryTotalProducts: 0,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Fetch all products
    fetchProductsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.isLoading = false;
      state.products = action.payload.products;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalProducts = action.payload.totalProducts;
    },
    fetchProductsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch product by ID
    fetchProductByIdStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.selectedProduct = action.payload;
    },
    fetchProductByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch products by category
    fetchProductsByCategoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsByCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.productsByCategory = action.payload.products;
      state.categoryTotalPages = action.payload.totalPages;
      state.categoryCurrentPage = action.payload.currentPage;
      state.categoryTotalProducts = action.payload.totalProducts;
    },
    fetchProductsByCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Add product
    addProductStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addProductSuccess: (state, action) => {
      state.isLoading = false;
      // Add to beginning of products array if we're on the first page
      if (state.currentPage === 1) {
        state.products.unshift(action.payload);
        // Remove last item if we exceed the limit (assuming 20 per page)
        if (state.products.length > 20) {
          state.products.pop();
        }
      }
      // Update total count
      state.totalProducts += 1;
    },
    addProductFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update product
    updateProductStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProductSuccess: (state, action) => {
      state.isLoading = false;
      const updatedProduct = action.payload;
      
      // Update in products array
      const index = state.products.findIndex(p => p._id === updatedProduct._id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      
      // Update in productsByCategory array
      const categoryIndex = state.productsByCategory.findIndex(p => p._id === updatedProduct._id);
      if (categoryIndex !== -1) {
        state.productsByCategory[categoryIndex] = updatedProduct;
      }
      
      // Update selected product if it matches
      if (state.selectedProduct && state.selectedProduct._id === updatedProduct._id) {
        state.selectedProduct = updatedProduct;
      }
    },
    updateProductFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete product
    deleteProductStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteProductSuccess: (state, action) => {
      state.isLoading = false;
      const deletedProductId = action.payload;
      
      // Remove from products array
      state.products = state.products.filter(p => p._id !== deletedProductId);
      
      // Remove from category products
      state.productsByCategory = state.productsByCategory.filter(p => p._id !== deletedProductId);
      
      // Clear selected product if it was deleted
      if (state.selectedProduct && state.selectedProduct._id === deletedProductId) {
        state.selectedProduct = null;
      }
      
      // Update total counts
      state.totalProducts = Math.max(0, state.totalProducts - 1);
      state.categoryTotalProducts = Math.max(0, state.categoryTotalProducts - 1);
    },
    deleteProductFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear states
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearProductsByCategory: (state) => {
      state.productsByCategory = [];
      state.categoryTotalPages = 1;
      state.categoryCurrentPage = 1;
      state.categoryTotalProducts = 0;
    },
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductLoading: (state) => {
      state.isLoading = false;
    },
    clearProducts: (state) => {
      state.products = [];
      state.productsByCategory = [];
      state.selectedProduct = null;
      state.totalPages = 1;
      state.currentPage = 1;
      state.totalProducts = 0;
      state.categoryTotalPages = 1;
      state.categoryCurrentPage = 1;
      state.categoryTotalProducts = 0;
    },
  },
});

export const {
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
} = productSlice.actions;

export default productSlice.reducer;