import React, { useState, useEffect } from 'react';
import { FiMail, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Custom hooks
  const { forgotPassword, isLoading, error, clearAuthError } = useAuth();

  // Clear errors when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }

    if (error) {
      clearAuthError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  const handleResendEmail = async () => {
    try {
      await forgotPassword(email);
    } catch (err) {
      console.error('Resend email failed:', err);
    }
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
          {isSuccess ? 'Check your email' : 'Forgot password?'}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isSuccess 
            ? "We've sent a password reset link to your email address."
            : "No worries! Enter your email and we'll send you a reset link."
          }
        </p>
      </motion.div>

      {isSuccess ? (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <FiMail className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Reset link sent to {email}
              </span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check your inbox and click the link to reset your password. 
              The link will expire in 10 minutes.
            </p>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the email?
              </p>
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isLoading}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Resend email'}
              </button>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/auth/login"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <FiArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </a>
          </div>
        </motion.div>
      ) : (
        <motion.form variants={itemVariants} className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md flex items-start space-x-2">
              <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              label="Email address"
              placeholder="Enter your email address"
              value={email}
              onChange={handleInputChange}
              error={errors.email}
              icon={<FiMail className="h-5 w-5" />}
              iconPosition="left"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Send reset link
            </Button>

            <div className="text-center">
              <a
                href="/auth/login"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <FiArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </a>
            </div>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default ForgotPasswordPage;