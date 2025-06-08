import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit3, FiKey, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import DeleteModal from '../../../components/modals/DeleteModal';
import { useAuth } from '../../../hooks/useAuth';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const { user, isAuthenticated, deleteOwnUser, sendOtp, forgotPasswordLoggedIn } = useAuth();
    const { isLoading } = useUser();
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login');
        }
    }, [isAuthenticated, navigate]);

    const handleEditProfile = () => {
        navigate('/user/edit-profile');
    };


    const handleChangeEmail = async () => {
        try {
            localStorage.setItem('verifyEmail', user.email);
            localStorage.setItem('purpose', 'changeEmail');
            await sendOtp(user.email);
            navigate('/user/verify-email');
        } catch (error) {
            console.error('Error while sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        }
    };

    const handleChangePassword = async () => {
        try {
            localStorage.setItem('verifyEmail', user.email);
            await forgotPasswordLoggedIn(user.email);
            navigate('/user/reset-password');
        } catch (error) {
            console.error('Error while sending reset link:', error);
            toast.error('Failed to initiate password reset. Please try again.');
        }
    };

    const openDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteOwnUser(user?._id);
            navigate('/auth/login');
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const ProfileField = ({ icon: Icon, label, value, iconColor = 'text-gray-400' }) => (
        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className={`p-2 rounded-lg bg-white dark:bg-gray-600 mr-4`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-gray-900 dark:text-white font-medium">{value || 'Not provided'}</p>
            </div>
        </div>
    );

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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Profile Header */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    user.firstName?.charAt(0).toUpperCase()
                                )}
                            </span>

                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.name || 'User'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {user.username}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        icon={<FiEdit3 className="h-4 w-4" />}
                        onClick={handleEditProfile}
                    >
                        Edit Profile
                    </Button>
                </div>
            </motion.div>

            {/* Profile Information */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField
                        icon={FiUser}
                        label="Full Name"
                        value={user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.name}
                        iconColor="text-blue-600"
                    />
                    <ProfileField
                        icon={FiMail}
                        label="Email Address"
                        value={user.email}
                        iconColor="text-green-600"
                    />
                    <ProfileField
                        icon={FiPhone}
                        label="Phone Number"
                        value={user.phone}
                        iconColor="text-purple-600"
                    />
                    <ProfileField
                        icon={FiCalendar}
                        label="Member Since"
                        value={new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                        })}
                        iconColor="text-indigo-600"
                    />
                </div>
            </motion.div>

            {/* Account Security */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account Security</h2>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-white dark:bg-gray-600">
                                <FiMail className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Email Address</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Change your email address</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleChangeEmail}
                            className="mt-4 sm:mt-0"
                        >
                            Change Email
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-white dark:bg-gray-600">
                                <FiKey className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Password</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Change your account password</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleChangePassword}
                            className="mt-4 sm:mt-0"
                        >
                            Change Password
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-red-200 dark:border-red-800"
            >
                <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Delete Account</h2>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex flex-col sm:flex-row md:items-center justify-between">
                        <div>
                            <h3 className="font-medium text-red-900 dark:text-red-100">Delete Account</h3>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                        </div>
                        <Button
                            variant="danger"
                            icon={<FiTrash2 className="h-4 w-4" />}
                            onClick={openDeleteModal}
                            className="mt-4 sm:mt-0"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </motion.div>

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
                isLoading={isLoading}
            />
        </motion.div>
    );
};

export default MyProfile;