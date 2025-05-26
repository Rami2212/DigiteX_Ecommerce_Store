import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState('');
const { forgotPassword, isLoading } = useAuth();


 // use real nav

    useEffect(() => {
        setEmail(localStorage.getItem('verifyEmail') || '');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email address is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            
            await forgotPassword(email);
            
    
            
            setIsEmailSent(true);
        } catch (error) {
            if (error.response?.status === 404) {
                setError('No account found with this email address');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        }
    };

    const handleGoBack = () => {
        navigate('/user/my-profile');
    };

// only 
    if (isEmailSent) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Success Header */}
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Check Your Email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            We've sent password reset instructions to
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {email}
                        </p>
                    </div>

                    {/* Success Message */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="space-y-6">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Mail className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                                            Email Sent Successfully
                                        </h3>
                                        <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                                            <p>
                                                Please check your email and follow the instructions to reset your password. 
                                                The link will expire in 1 hour.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                                
                                <button
                                    onClick={() => setIsEmailSent(false)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                                >
                                    Try a different email address
                                </button>
                            </div>

                            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handleBackToLogin}
                                    className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
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
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Forgot Password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Forgot Password Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    placeholder="Enter your email address"
                                    disabled={isLoading}
                                />
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sending Reset Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        {/* Back Button */}
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Remember your password? 
                        <button
                            onClick={handleBackToLogin}
                            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;