import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import AuthSuccess from '../pages/auth/AuthSuccess';
import AuthFailed from '../pages/auth/AuthFailed';
import CategoriesPage from '../pages/public/categories/Categories';
import CategoryProductsPage from '../pages/public/categories/CategoryProduct';
import CartPage from '../pages/public/payment/Cart';
import CheckoutPage from '../pages/public/payment/Checkout';
import OrderSuccessPage from '../pages/public/payment/OrderSuccess';
import PaymentFailedPage from '../pages/public/payment/PaymentFailed';
import RetryPaymentPage from '../pages/public/payment/RetryPayment';
import OrderPendingPage from '../pages/public/payment/OrderPending';
import SingleProductPage from '../pages/public/products/SingleProduct';
import ProductsPage from '../pages/public/products/Products';
import HomePage from '../pages/public/Home';
import NotFoundPage from '../pages/public/NotFoundPage';
import AboutPage from '../pages/public/About';
import ContactPage from '../pages/public/Contact';
import PopupManager from '../components/popups/PopupManager';

const PublicRoutes = () => {
  const location = useLocation(); // required for AnimatePresence

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="auth-success" element={<AuthSuccess />} />
          <Route path="auth-failed" element={<AuthFailed />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categorySlug" element={<CategoryProductsPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:productId/:slug?" element={<SingleProductPage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/payment-failed/:orderId" element={<PaymentFailedPage />} />
          <Route path="/order-pending/:orderId" element={<OrderPendingPage />} />
          <Route path="/retry-payment/:orderId" element={<RetryPaymentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <PopupManager />
    </AnimatePresence>
  );
};

export default PublicRoutes;