import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: null,
  itemCount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    fetchCartStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action) => {
      state.isLoading = false;
      state.cart = action.payload;
      state.itemCount = action.payload?.totalItems || 0;
    },
    fetchCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addToCartStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.isLoading = false;
      state.cart = action.payload.cart;
      state.itemCount = action.payload.cart?.totalItems || 0;
    },
    addToCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateCartItemStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCartItemSuccess: (state, action) => {
      state.isLoading = false;
      state.cart = action.payload.cart;
      state.itemCount = action.payload.cart?.totalItems || 0;
    },
    updateCartItemFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    removeFromCartStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    removeFromCartSuccess: (state, action) => {
      state.isLoading = false;
      state.cart = action.payload.cart;
      state.itemCount = action.payload.cart?.totalItems || 0;
    },
    removeFromCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearCartStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    clearCartSuccess: (state, action) => {
      state.isLoading = false;
      state.cart = action.payload.cart;
      state.itemCount = 0;
    },
    clearCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateItemCountSuccess: (state, action) => {
      state.itemCount = action.payload.itemCount;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartStart,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
  updateItemCountSuccess,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;