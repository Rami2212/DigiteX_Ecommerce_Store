import React, { useState } from 'react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ChangeEmail = () => {
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { sendOtp } = useAuth();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = async () => {
        setError('');

        if (!newEmail) {
            setError('New email is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            localStorage.setItem('verifyEmail', newEmail);
            localStorage.setItem('purpose', 'profile');
            await sendOtp(newEmail);
            navigate('/user/verify-email');
        } catch (err) {
            setError('Failed to update email. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                                Change Email
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enter your new email address to receive a verification code.
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
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <div className="space-y-6">
                    {/* Email Input */}
                    <motion.div variants={itemVariants} className="mb-4">
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Email
                        </label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                id="newEmail"
                                type="email"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    if (error) setError('');
                                }}
                                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="example@email.com"
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="mt-6">
                        <Button
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Verification Code'}
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ChangeEmail;
