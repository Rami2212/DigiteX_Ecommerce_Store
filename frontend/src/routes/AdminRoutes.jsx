import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import admin components
import AdminLayout from '../layouts/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CategoriesPage from '../pages/admin/categories/categories';
import AddCategoryPage from '../pages/admin/categories/AddCategory';
import EditCategoryPage from '../pages/admin/categories/EditCategory';
import UsersPage from '../pages/admin/users/Users';
import AddUserPage from '../pages/admin/users/AddUser';
import EditUserPage from '../pages/admin/users/EditUser';
import AddonsPage from '../pages/admin/addons/Addons';
import AddAddonPage from '../pages/admin/addons/AddAddon';
import EditAddonPage from '../pages/admin/addons/EditAddon';
import AddProductPage from '../pages/admin/products/AddProduct';
import EditProductPage from '../pages/admin/products/EditProduct';
import ProductsPage from '../pages/admin/products/Products';

const AdminRoutes = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Admin login route - accessible when not authenticated */}
      <Route 
        path="/login" 
        element={
          isAuthenticated && isAdmin ? (
            <AdminLayout />
          ) : (
            <AdminLogin />
          )
        } 
      />
      
      {/* Protected admin routes */}
      <Route 
        path="/*" 
        element={
          isAuthenticated && isAdmin ? (
            <AdminLayout />
          ) : (
            <AdminLogin />
          )
        }
      >
        {/* Default admin dashboard */}
        <Route index element={<AdminDashboard />} />
        
        {/* Categories */}
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="add-category" element={<AddCategoryPage />} />
        <Route path="edit-category/:id" element={<EditCategoryPage />} />

        {/* Users */}
        <Route path="users" element={<UsersPage />} />
        <Route path="add-user" element={<AddUserPage />} />
        <Route path="edit-user/:id" element={<EditUserPage />} />
        
        {/* Adons */}
        <Route path="addons" element={<AddonsPage />} />
        <Route path="add-addon" element={<AddAddonPage />} />
        <Route path="edit-addon/:id" element={<EditAddonPage />} />

        {/* Products */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="edit-product/:id" element={<EditProductPage />} />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;