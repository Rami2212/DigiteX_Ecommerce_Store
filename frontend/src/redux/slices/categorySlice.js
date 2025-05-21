import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    },
    fetchCategoriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addCategorySuccess: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategorySuccess: (state, action) => {
      const index = state.categories.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategorySuccess: (state, action) => {
      state.categories = state.categories.filter(c => c._id !== action.payload);
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  addCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
  clearCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;
