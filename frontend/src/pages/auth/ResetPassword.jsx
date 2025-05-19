import React, { useState, useEffect } from 'react';
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const { token } = useParams();

  // Custom hooks
  const { resetPassword, isLoading, error, clearAuthError } = useAuth();

  // Clear errors when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await resetPassword(token, formData.password);
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ];
    
    checks.forEach(check => check && strength++);
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

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
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="large" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below
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
          {/* New Password */}
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              label="New Password"
              placeholder="Enter your new password"
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Password strength</span>
                <span className={`font-medium ${
                  passwordStrength <= 2 ? 'text-red-600' :
                  passwordStrength <= 3 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                </span>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full ${
                      level <= passwordStrength 
                        ? strengthColors[passwordStrength - 1] || 'bg-red-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Password Requirements */}
          {formData.password && (
            <div className="text-xs space-y-1">
              <div className={`flex items-center space-x-2 ${
                formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'
              }`}>
                <FiCheckCircle className="h-3 w-3" />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center space-x-2 ${
                /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) 
                  ? 'text-green-600' : 'text-gray-500'
              }`}>
                <FiCheckCircle className="h-3 w-3" />
                <span>Mix of uppercase and lowercase letters</span>
              </div>
              <div className={`flex items-center space-x-2 ${
                /\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
              }`}>
                <FiCheckCircle className="h-3 w-3" />
                <span>At least one number</span>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              icon={<FiLock className="h-5 w-5" />}
              iconPosition="left"
              required
              disabled={isLoading}
              className="pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-9 flex items-center z-10"
              onClick={toggleConfirmPasswordVisibility}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              )}
            </button>
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
            Reset Password
          </Button>

          <div className="text-center">
            <a
              href="/auth/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Remember your password? Sign in
            </a>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ResetPasswordPage;