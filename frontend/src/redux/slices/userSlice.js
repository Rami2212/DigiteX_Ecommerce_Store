import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Get all users
    getUsersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.totalUsers = action.payload.length;
      state.error = null;
    },
    getUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get single user
    getUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getUserSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    getUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create user
    createUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createUserSuccess: (state, action) => {
      state.isLoading = false;
      state.users.push(action.payload);
      state.totalUsers += 1;
      state.error = null;
    },
    createUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update user by admin
    updateUserByAdminStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserByAdminSuccess: (state, action) => {
      state.isLoading = false;
      const updatedUser = action.payload;
      const index = state.users.findIndex(user => user._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
      if (state.currentUser && state.currentUser._id === updatedUser._id) {
        state.currentUser = updatedUser;
      }
      state.error = null;
    },
    updateUserByAdminFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update user profile (by user)
    updateUserProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserProfileSuccess: (state, action) => {
      state.isLoading = false;
      const updatedUser = action.payload;
      const index = state.users.findIndex(user => user._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
      if (state.currentUser && state.currentUser._id === updatedUser._id) {
        state.currentUser = updatedUser;
      }
      state.error = null;
    },
    updateUserProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete user
    deleteUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.isLoading = false;
      const userId = action.payload;
      state.users = state.users.filter(user => user._id !== userId);
      state.totalUsers -= 1;
      if (state.currentUser && state.currentUser._id === userId) {
        state.currentUser = null;
      }
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Change email
    changeEmailStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    changeEmailSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    changeEmailFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearUserError: (state) => {
      state.error = null;
    },

    // Clear current user
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },

    // Reset user state
    resetUserState: (state) => {
      state.users = [];
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
      state.totalUsers = 0;
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  getUserStart,
  getUserSuccess,
  getUserFailure,
  createUserStart,
  createUserSuccess,
  createUserFailure,
  updateUserByAdminStart,
  updateUserByAdminSuccess,
  updateUserByAdminFailure,
  updateUserProfileStart,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  changeEmailStart,
  changeEmailSuccess,
  changeEmailFailure,
  clearUserError,
  clearCurrentUser,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;