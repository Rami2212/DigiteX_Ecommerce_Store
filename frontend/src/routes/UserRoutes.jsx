import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

// Layouts
import UserLayout from '../layouts/UserLayout';
import UserDashboard from '../pages/user/UserDashboard';
import MyProfile from '../pages/user/profile/MyProfile';
import EditProfile from '../pages/user/profile/EditProfile';
import PasswordReset from '../pages/user/profile/ResetPassword';
import VerifyEmail from '../pages/user/profile/VerifyEmail';
import ChangeEmail from '../pages/user/profile/ChangeEmail';
import MyOrders from '../pages/user/orders/MyOrders';
import Order from '../pages/user/orders/Order';
import WishlistPage from '../pages/user/Wishlist';
import UserStatsPage from '../pages/user/stats/Stats';

// User pages
// Import your user pages here

const UserRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<UserDashboard />} />

          {/* Profile */}
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-email" element={<ChangeEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<PasswordReset />} />

          {/* Orders */}
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order/:orderId" element={<Order />} />

          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/stats" element={<UserStatsPage />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default UserRoutes;