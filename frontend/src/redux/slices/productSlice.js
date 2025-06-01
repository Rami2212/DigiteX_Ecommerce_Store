import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedProduct: null,
  productsByCategory: [],
  isLoading: false,
  error: null,
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
      state.products = action.payload;
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
      state.productsByCategory = action.payload;
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
      state.products.push(action.payload);
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
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      // Update selected product if it matches
      if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
        state.selectedProduct = action.payload;
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
      state.products = state.products.filter(p => p._id !== action.payload);
      // Clear selected product if it was deleted
      if (state.selectedProduct && state.selectedProduct._id === action.payload) {
        state.selectedProduct = null;
      }
      // Remove from category products if present
      state.productsByCategory = state.productsByCategory.filter(p => p._id !== action.payload);
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
    },
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductLoading: (state) => {
      state.isLoading = false;
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
} = productSlice.actions;

export default productSlice.reducer;