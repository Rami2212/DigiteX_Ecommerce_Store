import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import categoryReducer from './slices/categorySlice';
import useReducer from './slices/userSlice';
import addonSlice from './slices/addonSlice';
import productSlice from './slices/productSlice';
import cartSlice from './slices/cartSlice';
import orderSlice from './slices/orderSlice';
import paymentSlice from './slices/paymentSlice';
import wishlistSlice from './slices/wishlistSlice';
import contactSlice from './slices/contactSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    category: categoryReducer,
    user: useReducer,
    addon: addonSlice,
    product: productSlice,
    cart: cartSlice,
    order: orderSlice,
    payment: paymentSlice,
    wishlist: wishlistSlice,
    contact: contactSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;