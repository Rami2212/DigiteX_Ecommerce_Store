import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addons: [],
  isLoading: false,
  error: null,
};

const addonSlice = createSlice({
  name: 'addon',
  initialState,
  reducers: {
    fetchAddonsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAddonsSuccess: (state, action) => {
      state.isLoading = false;
      state.addons = action.payload;
    },
    fetchAddonsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addAddonSuccess: (state, action) => {
      state.addons.push(action.payload);
    },
    updateAddonSuccess: (state, action) => {
      const index = state.addons.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.addons[index] = action.payload;
      }
    },
    deleteAddonSuccess: (state, action) => {
      state.addons = state.addons.filter(c => c._id !== action.payload);
    },
    clearAddonError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchAddonsStart,
  fetchAddonsSuccess,
  fetchAddonsFailure,
  addAddonSuccess,
  updateAddonSuccess,
  deleteAddonSuccess,
  clearAddonError,
} = addonSlice.actions;

export default addonSlice.reducer;
