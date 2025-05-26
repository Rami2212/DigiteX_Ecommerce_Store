import React, { useState, useEffect } from 'react';
import { FiLock, FiArrowLeft, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PasswordReset = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    useEffect(() => {
        // Verify token exists
        if (!token) {
            navigate('/auth/login');
            toast.error('Invalid reset link. Please request a new password reset.');
        }
    }, [token, navigate]);

    const handleGoBack = () => {
        navigate('/auth/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        const errors = [];
        if (password.length < minLength) errors.push(`At least ${minLength} characters`);
        if (!hasUpperCase) errors.push('One uppercase letter');
        if (!hasLowerCase) errors.push('One lowercase letter');
        if (!hasNumbers) errors.push('One number');
        if (!hasSpecialChar) errors.push('One special character (!@#$%^&*)');

        return errors;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordErrors = validatePassword(formData.password);
            if (passwordErrors.length > 0) {
                newErrors.password = 'Password must contain: ' + passwordErrors.join(', ');
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setErrors({});

        if (!validateForm()) return;

        try {
            setIsLoading(true);
            await resetPassword(token, formData.password);
            navigate('/auth/login');
            toast.success('Password reset successfully! You can now log in with your new password.');
        } catch (error) {
            if (error.response?.status === 400) {
                setErrors({ general: 'Invalid or expired reset token. Please request a new password reset.' });
            } else {
                setErrors({ general: 'Failed to reset password. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        const checks = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*]/.test(password)
        ];
        
        const strength = checks.filter(Boolean).length;
        
        if (strength < 2) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
        if (strength < 4) return { label: 'Fair', color: 'bg-yellow-500', width: '60%' };
        if (strength < 5) return { label: 'Good', color: 'bg-blue-500', width: '80%' };
        return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

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
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6 mb-12"
        >
            {/* Header */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiArrowLeft className="h-8 w-8" />}
                            onClick={handleGoBack}
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Reset Your Password
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enter your new password below
                            </p>
                        </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <FiLock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </motion.div>

            {/* Password Reset Form */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <div className="space-y-6">
                    {/* General Error */}
                    {errors.general && (
                        <motion.div variants={itemVariants} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.general}
                            </p>
                        </motion.div>
                    )}

                    {/* New Password */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="pl-10 pr-12 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your new password"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <FiEyeOff className="h-4 w-4" />
                                ) : (
                                    <FiEye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {passwordStrength && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Password strength:</span>
                                    <span className={`text-xs font-medium ${
                                        passwordStrength.label === 'Strong' ? 'text-green-600 dark:text-green-400' :
                                        passwordStrength.label === 'Good' ? 'text-blue-600 dark:text-blue-400' :
                                        passwordStrength.label === 'Fair' ? 'text-yellow-600 dark:text-yellow-400' :
                                        'text-red-600 dark:text-red-400'
                                    }`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${passwordStrength.color} transition-all duration-300`}
                                        style={{ width: passwordStrength.width }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div variants={itemVariants}>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="pl-10 pr-12 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm your new password"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <FiEyeOff className="h-4 w-4" />
                                ) : (
                                    <FiEye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        
                        {/* Password Match Indicator */}
                        {formData.confirmPassword && (
                            <div className="mt-2 flex items-center">
                                {formData.password === formData.confirmPassword ? (
                                    <>
                                        <FiCheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                        <span className="text-xs text-green-600 dark:text-green-400">Passwords match</span>
                                    </>
                                ) : (
                                    <span className="text-xs text-red-600 dark:text-red-400">Passwords do not match</span>
                                )}
                            </div>
                        )}
                        
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </motion.div>

                    {/* Password Requirements */}
                    <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password Requirements:
                        </h4>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            <li className="flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}></span>
                                At least 8 characters
                            </li>
                            <li className="flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    /[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}></span>
                                One uppercase letter
                            </li>
                            <li className="flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    /[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}></span>
                                One lowercase letter
                            </li>
                            <li className="flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    /\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}></span>
                                One number
                            </li>
                            <li className="flex items-center">
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    /[!@#$%^&*]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}></span>
                                One special character (!@#$%^&*)
                            </li>
                        </ul>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="mt-6">
                        <Button
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PasswordReset;