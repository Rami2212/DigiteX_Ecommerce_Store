import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTheme } from './hooks/useTheme';
import PublicRoutes from './routes/PublicRoutes';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

const App = () => {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      
      <Routes location={location} key={location.pathname}>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </main>
  );
};

export default App;