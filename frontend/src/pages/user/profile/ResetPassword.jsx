import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

const PasswordReset = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetToken, setResetToken] = useState('');

    // Mock function to simulate the useAuth hook behavior
    const resetPassword = async (token, password) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        console.log('Resetting password with token:', token, 'and new password');
        setIsLoading(false);
        // Mock success - in real app this would call the actual API
    };

    const navigate = (path) => {
        console.log('Navigating to:', path);
        // Mock navigation - in real app this would use react-router
    };

    useEffect(() => {
        // Get reset token from URL params or localStorage
        // In real app: const urlParams = new URLSearchParams(window.location.search);
        // const token = urlParams.get('token') || localStorage.getItem('resetToken');
        const mockToken = 'mock-reset-token-123'; // Mock token
        
        if (!mockToken) {
            navigate('/auth/login');
            return;
        }
        
        setResetToken(mockToken);
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await resetPassword(resetToken, formData.password);
            
            // Clear any stored data
            console.log('Clearing localStorage: resetToken, verifyEmail, purpose');
            
            // In real app:
            // localStorage.removeItem('resetToken');
            // localStorage.removeItem('verifyEmail');
            // localStorage.removeItem('purpose');
            
            // Navigate to login with success message
            navigate('/auth/login');
            alert('Password reset successfully! You can now log in with your new password.');
        } catch (error) {
            if (error.response?.status === 400) {
                setErrors({ general: 'Invalid or expired reset token. Please request a new password reset.' });
            } else {
                setErrors({ general: 'Failed to reset password. Please try again.' });
            }
        }
    };

    const handleGoBack = () => {
        navigate('/auth/login');
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Enter your new password below
                    </p>
                </div>

                {/* Password Reset Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="space-y-6">
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.general}
                                </p>
                            </div>
                        )}

                        {/* New Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    placeholder="Enter your new password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
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
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    placeholder="Confirm your new password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Password Match Indicator */}
                            {formData.confirmPassword && (
                                <div className="mt-2 flex items-center">
                                    {formData.password === formData.confirmPassword ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                            <span className="text-xs text-green-600 dark:text-green-400">Passwords match</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-red-600 dark:text-red-400">Passwords do not match</span>
                                    )}
                                </div>
                            )}
                            
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
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
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Resetting Password...
                                </div>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors duration-200"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;