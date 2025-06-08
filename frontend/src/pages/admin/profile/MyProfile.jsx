import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiEdit3, FiKey, FiTrash2, FiSettings, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import DeleteModal from '../../../components/modals/DeleteModal';
import { useAuth } from '../../../hooks/useAuth';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminProfile = () => {
    const { user, isAuthenticated, deleteOwnUser, sendOtp, forgotPasswordLoggedIn } = useAuth();
    const { isLoading } = useUser();
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
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
            navigate('/admin/login');
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage your admin account settings and preferences
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button
                        variant="primary"
                        icon={<FiEdit3 className="h-4 w-4" />}
                        onClick={handleEditProfile}
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Profile Overview</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-white text-xl font-bold">
                                        {user.firstName?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'A'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.name || 'Admin User'}
                            </h3>
                            <p className="text-gray-600">@{user.username}</p>
                            <div className="mt-2 flex items-center">
                                <FiShield className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600 font-medium">Administrator</span>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div className="flex items-center mr-6">
                                <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center">
                            <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Full Name</p>
                                <p className="text-sm text-gray-500">
                                    {user.firstName && user.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.name || 'Not provided'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Phone</p>
                                <p className="text-sm text-gray-500">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Member Since</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Security */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 mb-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center mb-3 sm:mb-0">
                                <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email Address</p>
                                    <p className="text-sm text-gray-500">Change your email address</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleChangeEmail}
                                className="w-full sm:w-auto"
                            >
                                Change Email
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center mb-3 sm:mb-0">
                                <FiKey className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Password</p>
                                    <p className="text-sm text-gray-500">Change your account password</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleChangePassword}
                                className="w-full sm:w-auto"
                            >
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white shadow rounded-lg border-l-4 border-red-400">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
                </div>
                <div className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className='mb-3 sm:mb-0'>
                                <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                                <p className="text-sm text-red-600 mt-1">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                            </div>
                            <Button
                                variant="danger"
                                icon={<FiTrash2 className="h-4 w-4" />}
                                onClick={openDeleteModal}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteAccount}
                title="Delete Admin Account"
                message="Are you sure you want to delete your admin account? This action cannot be undone and you will lose access to all administrative functions."
                isLoading={isLoading}
            />
        </div>
    );
};

export default AdminProfile;