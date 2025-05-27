import { createSlice } from '@reduxjs/toolkit';

let userFromStorage = null;

try {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    userFromStorage = JSON.parse(storedUser);
  }
} catch (err) {
  //console.error('Failed to parse user from localStorage:', err);
}


const initialState = {
  user: userFromStorage,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  isAdmin: localStorage.getItem('role') === 'admin',
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('role', action.payload.user.role);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    // Update user profile (by user)
    updateUserProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserProfileSuccess: (state, action) => {
      state.isLoading = false;
      const updatedUser = action.payload;

      state.user = { ...state.user, ...updatedUser };

      localStorage.setItem('user', JSON.stringify(state.user));

      state.error = null;
    },

    updateUserProfileFailure: (state, action) => {
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

    // Delete own user account
    deleteUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    deleteUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
  updateUserProfileStart,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  changeEmailStart,
  changeEmailSuccess,
  changeEmailFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = authSlice.actions;

export default authSlice.reducer;