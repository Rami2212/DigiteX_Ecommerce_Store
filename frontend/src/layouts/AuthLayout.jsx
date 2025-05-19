import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/dashboard');
    } else {
      setCheckedAuth(true);
    }
  }, [isAuthenticated, navigate]);

  if (!checkedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthHeader />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
