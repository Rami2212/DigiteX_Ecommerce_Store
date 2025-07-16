import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  // Custom hooks
  const { login, isLoading, error, clearAuthError } = useAuth();

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
      await login({
        identifier: formData.identifier,
        password: formData.password,
      });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.assign('https://digitex-app.azurewebsites.net/api/auth/google');
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
    <motion.div
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="large" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <a href="/auth/register" className="font-medium text-primary hover:text-primary-dark transition-colors">
            create a new account
          </a>
        </p>
      </motion.div>

      <motion.form variants={itemVariants} className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md flex items-start space-x-2">
            <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <Input
            name="identifier"
            type="text"
            label="Email or Username"
            placeholder="Email address or username"
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
              placeholder="Password"
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
                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-right justify-right">

          <div className="text-sm">
            <a
              href="/auth/forgot-password"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign in
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            icon={<FcGoogle className="h-5 w-5" />}
            iconPosition="left"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Continue with Google
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default LoginPage;