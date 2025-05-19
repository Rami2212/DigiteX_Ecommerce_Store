import React, { useState, useEffect, useRef } from 'react';
import { FiAlertCircle, FiMail, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from state or localStorage
  const email = location.state?.email || localStorage.getItem('registrationEmail') || '';

  // Custom hooks
  const { verifyOtp, resendOtp, isLoading, error, clearAuthError } = useAuth();

  // Redirect if no email found
  useEffect(() => {
    if (!email) {
      navigate('/auth/register');
      return;
    }
  }, [email, navigate]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  // Clear errors when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    if (error) {
      clearAuthError();
    }

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus the last input
      otpRefs.current[5]?.focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      newErrors.otp = 'Please enter the complete 6-digit code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await verifyOtp({
        email,
        otp: otp.join('')
      });
      
      // Clear stored email after successful verification
      localStorage.removeItem('registrationEmail');
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await resendOtp(email);
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend OTP failed:', err);
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

  if (!email) {
    return null; // Will redirect
  }

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
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-medium text-gray-900 dark:text-white break-all">
          {email}
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
          <div>
            <label className="block text-sm font-medium text-center text-gray-700 dark:text-gray-300 mb-2">
              Enter verification code
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => otpRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg
                    ${errors.otp 
                      ? 'border-red-300 dark:border-red-600 ring-red-500 dark:ring-red-400' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:outline-none transition-colors`}
                  disabled={isLoading}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.otp}</p>
            )}
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
            Verify Email
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className={`mt-1 text-sm font-medium transition-colors ${
                canResend && !isLoading
                  ? 'text-primary hover:text-primary-dark cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {canResend ? (
                <span className="flex items-center justify-center gap-1">
                  <FiRefreshCw className="h-4 w-4" />
                  Resend code
                </span>
              ) : (
                `Resend in ${resendTimer}s`
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/auth/register"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              ← Back to registration
            </a>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default VerifyEmailPage;