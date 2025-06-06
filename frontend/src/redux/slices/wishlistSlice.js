import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlist: null,
  itemCount: 0,
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    fetchWishlistStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchWishlistSuccess: (state, action) => {
      state.isLoading = false;
      state.wishlist = action.payload;
      state.itemCount = action.payload?.totalItems || 0;
    },
    fetchWishlistFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addToWishlistStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addToWishlistSuccess: (state, action) => {
      state.isLoading = false;
      state.wishlist = action.payload.wishlist;
      state.itemCount = action.payload.wishlist?.totalItems || 0;
    },
    addToWishlistFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    removeFromWishlistStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    removeFromWishlistSuccess: (state, action) => {
      state.isLoading = false;
      state.wishlist = action.payload.wishlist;
      state.itemCount = action.payload.wishlist?.totalItems || 0;
    },
    removeFromWishlistFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearWishlistStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    clearWishlistSuccess: (state, action) => {
      state.isLoading = false;
      state.wishlist = action.payload.wishlist;
      state.itemCount = 0;
    },
    clearWishlistFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    moveToCartStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    moveToCartSuccess: (state, action) => {
      state.isLoading = false;
      state.wishlist = action.payload.wishlist;
      state.itemCount = action.payload.wishlist?.totalItems || 0;
    },
    moveToCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    moveAllToCartStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    moveAllToCartSuccess: (state, action) => {
      state.isLoading = false;
      state.wishlist = action.payload.wishlist;
      state.itemCount = action.payload.wishlist?.totalItems || 0;
    },
    moveAllToCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateItemCountSuccess: (state, action) => {
      state.itemCount = action.payload.itemCount;
    },
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchWishlistStart,
  fetchWishlistSuccess,
  fetchWishlistFailure,
  addToWishlistStart,
  addToWishlistSuccess,
  addToWishlistFailure,
  removeFromWishlistStart,
  removeFromWishlistSuccess,
  removeFromWishlistFailure,
  clearWishlistStart,
  clearWishlistSuccess,
  clearWishlistFailure,
  moveToCartStart,
  moveToCartSuccess,
  moveToCartFailure,
  moveAllToCartStart,
  moveAllToCartSuccess,
  moveAllToCartFailure,
  updateItemCountSuccess,
  clearWishlistError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
