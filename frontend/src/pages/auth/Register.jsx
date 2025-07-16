import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    // Custom hooks
    const { register, isLoading, error, clearAuthError } = useAuth();

    // Clear errors
    useEffect(() => {
        return () => {
            clearAuthError();
        };
    }, [clearAuthError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (error) {
            clearAuthError();
        }
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
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
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
            // Store email in localStorage for OTP verification
            localStorage.setItem('registrationEmail', formData.email);

            const { confirmPassword, ...registrationData } = formData;

            await register(registrationData);
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    const handleGoogleRegister = () => {
        window.location.assign('https://digitex-app.azurewebsites.net/api/auth/google');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <Logo size="large" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Create your account
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <a href="/auth/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
                        Sign in here
                    </a>
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
                    {/* First Name and Last Name */}
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

                    {/* Username */}
                    <Input
                        name="username"
                        type="text"
                        label="Username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        error={errors.username}
                        icon={<FiUser className="h-5 w-5" />}
                        iconPosition="left"
                        required
                        disabled={isLoading}
                    />

                    {/* Email */}
                    <Input
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        icon={<FiMail className="h-5 w-5" />}
                        iconPosition="left"
                        required
                        disabled={isLoading}
                    />

                    {/* Phone with Country Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number
                        </label>
                        <PhoneInput
                            country={'us'}
                            value={formData.phone}
                            onChange={(phone) => {
                                setFormData(prev => ({ ...prev, phone }));
                                if (errors.phone) {
                                    setErrors(prev => ({ ...prev, phone: '' }));
                                }
                                if (error) {
                                    clearAuthError();
                                }
                            }}
                            inputProps={{
                                name: 'phone',
                                required: true,
                                disabled: isLoading,
                            }}
                            containerClass="w-full"
                            inputClass={`
                                            !w-full !pl-[56px] !pr-4 !py-5 !text-base
                                            !border !rounded-md
                                            !focus:outline-none !focus:ring-2 !focus:ring-primary !focus:border-transparent
                                            !transition-colors !duration-200
                                            !bg-white !text-gray-900
                                            dark:!bg-gray-800 dark:!text-gray-100
                                            ${errors.phone ? '!border-red-300 dark:!border-red-600' : '!border-gray-300 dark:!border-gray-600'}
                                        `}
                            buttonClass={`
                                            !bg-white dark:!bg-gray-800
                                            !border-r !border-gray-300 dark:!border-gray-600
                                            !rounded-l-md
                                            !px-2 !w-14
                                        `}
                            dropdownClass="react-tel-dropdown"
                            searchClass="react-tel-search"
                            containerStyle={{ width: '100%' }}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                            icon={<FiLock className="h-5 w-5" />}
                            iconPosition="left"
                            required
                            disabled={isLoading}
                            className="pr-12"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 flex items-center z-10"
                            onClick={togglePasswordVisibility}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                            ) : (
                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                            )}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                            icon={<FiLock className="h-5 w-5" />}
                            iconPosition="left"
                            required
                            disabled={isLoading}
                            className="pr-12"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 flex items-center z-10"
                            onClick={toggleConfirmPasswordVisibility}
                            disabled={isLoading}
                        >
                            {showConfirmPassword ? (
                                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                            ) : (
                                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                            )}
                        </button>
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
                        Create Account
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        fullWidth
                        icon={<FcGoogle className="h-5 w-5" />}
                        iconPosition="left"
                        onClick={handleGoogleRegister}
                        disabled={isLoading}
                    >
                        Continue with Google
                    </Button>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default RegisterPage;