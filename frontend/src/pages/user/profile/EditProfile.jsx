import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiSave, FiArrowLeft, FiCamera, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useAuth } from '../../../hooks/useAuth';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const { user, isAuthenticated, updateUserProfile } = useAuth();
    const { isLoading } = useUser();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        profileImage: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login');
            return;
        }

        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || '',
                phone: user.phone || '',
                profileImage: user.profileImage || null,
            });

            if (user.profileImage) {
                setImagePreview(user.profileImage);
            }
        }
    }, [user, isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, profileImage: 'Please select a valid image file (JPEG, PNG, or GIF)' }));
                return;
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, profileImage: 'Image size must be less than 5MB' }));
                return;
            }

            // Clear any previous errors
            setErrors(prev => ({ ...prev, profileImage: '' }));

            // Set the file for upload
            setImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setImagePreview(null);
        setImageFile(null);
        setFormData(prev => ({ ...prev, profileImage: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const updateData = { ...formData };
            
            // If there's a new image file, include it in the update
            if (imageFile) {
                updateData.profileImage = imageFile;
            }

            await updateUserProfile(updateData);
            navigate('/user/my-profile');
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleCancel = () => {
        navigate('/user/my-profile');
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
                            onClick={handleCancel}
                        >
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                            <p className="text-gray-600 dark:text-gray-400">Update your personal information</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Edit Form */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Image</h2>
                        <div className="flex flex-col items-center space-y-4">
                            {/* Image Preview */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiUser className="h-16 w-16 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Remove button */}
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                                    >
                                        <FiX className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Upload Button */}
                            <div className="flex flex-col items-center space-y-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    icon={<FiCamera className="h-4 w-4" />}
                                    onClick={triggerFileInput}
                                    disabled={isLoading}
                                >
                                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                                </Button>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Supported formats: JPEG, PNG, GIF<br />
                                    Maximum size: 5MB
                                </p>
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {/* Image upload error */}
                            {errors.profileImage && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.profileImage}</p>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                name="firstName"
                                type="text"
                                label="First Name"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                error={errors.firstName}
                                icon={<FiUser className="h-5 w-5" />}
                                iconPosition="left"
                                required
                                disabled={isLoading}
                            />

                            <Input
                                name="lastName"
                                type="text"
                                label="Last Name"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                error={errors.lastName}
                                icon={<FiUser className="h-5 w-5" />}
                                iconPosition="left"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="mt-4">
                            <Input
                                name="username"
                                type="text"
                                label="Username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleInputChange}
                                error={errors.username}
                                icon={<FiUser className="h-5 w-5" />}
                                iconPosition="left"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <Input
                                name="phone"
                                type="tel"
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={errors.phone}
                                icon={<FiPhone className="h-5 w-5" />}
                                iconPosition="left"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={<FiSave className="h-4 w-4" />}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditProfile;