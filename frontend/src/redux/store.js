import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import categoryReducer from './slices/categorySlice';
import useReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    category: categoryReducer,
    user: useReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;