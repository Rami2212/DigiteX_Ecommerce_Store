import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  // Custom hooks
  const { adminLogin, isLoading, error, clearAuthError } = useAuth();

  // Clear errors when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (error) {
      clearAuthError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await adminLogin({
        identifier: formData.identifier,
        password: formData.password,
      });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
          variants={itemVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="large" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access the admin dashboard
            </p>
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 p-4 rounded-md flex items-start space-x-2">
                <FiAlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                name="identifier"
                type="text"
                label="Email or Username"
                placeholder="Enter your email or username"
                value={formData.identifier}
                onChange={handleInputChange}
                error={errors.identifier}
                icon={<FiMail className="h-5 w-5" />}
                iconPosition="left"
                required
                disabled={isLoading}
              />

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  icon={<FiLock className="h-5 w-5" />}
                  iconPosition="left"
                  required
                  disabled={isLoading}
                  className="pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 flex items-center z-10"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </div>

            <div className="text-center">
              <a
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;