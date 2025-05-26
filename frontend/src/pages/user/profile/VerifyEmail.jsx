import React, { useState, useEffect, useRef } from 'react';
import { FiMail, FiArrowLeft, FiRotateCcw, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const { sendOtp, verifyOtp, changeEmail, isLoading } = useAuth();
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setEmail(localStorage.getItem('verifyEmail'));
        setPurpose(localStorage.getItem('purpose'));
        // Auto-focus first input
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        // Timer countdown
        if (timer > 0 && !canResend) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, canResend]);

    const handleInputChange = (e, index) => {
        const { value } = e.target;

        // Only allow single digit numbers
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Clear any existing errors
        if (error) setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 6 digits are entered - use newOtp instead of otp
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
            // Use a longer timeout to ensure state is updated
            setTimeout(() => handleVerifyWithOtp(newOtp), 150);
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }

        // Handle enter
        if (e.key === 'Enter') {
            handleVerify();
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

        if (pastedData.length === 0) return;

        const newOtp = Array(6).fill('');
        for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);

        // Focus the next empty input or the last one
        const nextEmptyIndex = newOtp.findIndex(val => !val);
        const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
        inputRefs.current[focusIndex]?.focus();

        // Auto-verify if all digits are filled
        if (pastedData.length === 6) {
            setTimeout(() => handleVerifyWithOtp(newOtp), 150);
        }
    };

    // Helper function to verify with specific OTP array
    const handleVerifyWithOtp = async (otpArray) => {
        const otpString = otpArray.join('');
        
        try {
            setError('');

            if (localStorage.getItem('purpose') === 'profile') {
                await changeEmail({email, otp: otpString});
            }

            await verifyOtp({
                email,
                otp: otpString
            });

        } catch (error) {
            setError('Invalid verification code. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleVerify = async () => {
        handleVerifyWithOtp(otp);
    };

    const handleResendOtp = async () => {
        if (!canResend || isResending) return;

        try {
            setIsResending(true);
            setError('');

            await sendOtp(email);
            
            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

        } catch (error) {
            setError('Failed to resend code. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsResending(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
            className="space-y-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
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
                                Verify Email
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enter the verification code sent to your email
                            </p>
                        </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <FiMail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </motion.div>

            {/* Verification Form */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 text-center p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <div className="space-y-6">
                    {/* Email Display */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Verification code sent to:
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg inline-block">
                            {email}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center p-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <FiAlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* OTP Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Enter 6-digit verification code
                        </label>
                        <div className="flex justify-center space-x-3 mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleInputChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className={`
                                        w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
                                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                        transition-all duration-200 outline-none
                                        ${digit
                                            ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900/30'
                                            : 'border-gray-300 dark:border-gray-600'
                                        }
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30
                                        hover:border-gray-400 dark:hover:border-gray-500
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Enter the code or paste it from your clipboard
                        </p>
                    </div>

                    {/* Verify Button */}
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        icon={<FiCheck className="h-4 w-4" />}
                        onClick={handleVerify}
                        isLoading={isLoading}
                        disabled={isLoading || otp.join('').length !== 6}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    {/* Resend Section */}
                    <div className="text-center space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Didn't receive the code?
                        </p>
                        {canResend ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<FiRotateCcw className="h-4 w-4" />}
                                onClick={handleResendOtp}
                                isLoading={isResending}
                                disabled={isResending}
                            >
                                {isResending ? 'Sending...' : 'Resend Code'}
                            </Button>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Resend available in {formatTimer(timer)}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default VerifyEmail;