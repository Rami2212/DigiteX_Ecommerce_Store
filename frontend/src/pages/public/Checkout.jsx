import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiMapPin, FiCreditCard, FiTruck, FiShoppingBag, FiArrowLeft, FiCheck, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useOrder } from '../../hooks/useOrder';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { createOrderFromCart, isLoading } = useOrder();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        phone: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [errors, setErrors] = useState({});

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

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleShippingMethodChange = (method) => {
        setShippingMethod(method);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address line 1 is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required';
        }

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const orderData = {
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    addressLine1: formData.addressLine1,
                    addressLine2: formData.addressLine2,
                    phone: formData.phone,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country
                },
                paymentMethod,
                shippingMethod
            };

            const result = await createOrderFromCart(orderData);
            
            // Navigate to success page or order details
            navigate(`/orders/${result.order?._id || result._id}`);
            
        } catch (error) {
            console.error('Failed to place order:', error);
        }
    };

    const handleCancel = () => {
        navigate('/cart');
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

    const paymentMethods = [
        {
            id: 'stripe',
            name: 'Credit/Debit Card',
            description: 'Pay securely with your card',
            icon: <FiCreditCard className="h-5 w-5" />
        },
        {
            id: 'COD',
            name: 'Cash on Delivery',
            description: 'Pay when you receive your order',
            icon: <FiDollarSign className="h-5 w-5" />
        }
    ];

    const shippingMethods = [
        {
            id: 'standard',
            name: 'Standard Shipping',
            description: '5-7 business days',
            price: 'Free',
            icon: <FiTruck className="h-5 w-5" />
        },
        {
            id: 'express',
            name: 'Express Shipping',
            description: '2-3 business days',
            price: '$9.99',
            icon: <FiTruck className="h-5 w-5" />
        },
        {
            id: 'overnight',
            name: 'Overnight Shipping',
            description: 'Next business day',
            price: '$24.99',
            icon: <FiTruck className="h-5 w-5" />
        }
    ];

    return (
        <motion.div
            className="container mx-auto px-4 space-y-6 m-6"
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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <FiShoppingBag className="h-8 w-8 text-primary" />
                                Checkout
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Complete your order details</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Shipping Address Form */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Address */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiMapPin className="h-5 w-5 text-primary" />
                                Shipping Address
                            </h2>
                            
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
                                    name="addressLine1"
                                    type="text"
                                    label="Address Line 1"
                                    placeholder="Street address, apartment, suite, etc."
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    error={errors.addressLine1}
                                    icon={<FiMapPin className="h-5 w-5" />}
                                    iconPosition="left"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="mt-4">
                                <Input
                                    name="addressLine2"
                                    type="text"
                                    label="Address Line 2 (Optional)"
                                    placeholder="Building, floor, landmark"
                                    value={formData.addressLine2}
                                    onChange={handleInputChange}
                                    icon={<FiMapPin className="h-5 w-5" />}
                                    iconPosition="left"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                                    required
                                    disabled={isLoading}
                                />

                                <Input
                                    name="city"
                                    type="text"
                                    label="City"
                                    placeholder="Enter your city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    error={errors.city}
                                    icon={<FiMapPin className="h-5 w-5" />}
                                    iconPosition="left"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <Input
                                    name="postalCode"
                                    type="text"
                                    label="Postal Code"
                                    placeholder="Enter postal code"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    error={errors.postalCode}
                                    icon={<FiMapPin className="h-5 w-5" />}
                                    iconPosition="left"
                                    required
                                    disabled={isLoading}
                                />

                                <Input
                                    name="country"
                                    type="text"
                                    label="Country"
                                    placeholder="Enter your country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    error={errors.country}
                                    icon={<FiMapPin className="h-5 w-5" />}
                                    iconPosition="left"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </form>
                </motion.div>

                {/* Right Side - Shipping & Payment Methods */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Shipping Method */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiTruck className="h-5 w-5 text-primary" />
                            Shipping Method
                        </h2>
                        
                        <div className="space-y-3">
                            {shippingMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`relative flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${
                                        shippingMethod === method.id
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    onClick={() => handleShippingMethodChange(method.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value={method.id}
                                                checked={shippingMethod === method.id}
                                                onChange={() => handleShippingMethodChange(method.id)}
                                                className="h-4 w-4 text-primary focus:ring-primary"
                                            />
                                            <div className="ml-3 flex items-center space-x-2">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    {method.icon}
                                                </div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {method.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                            {method.price}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-7 mt-1">
                                        {method.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Payment Method */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiCreditCard className="h-5 w-5 text-primary" />
                            Payment Method
                        </h2>
                        
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`relative flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${
                                        paymentMethod === method.id
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    onClick={() => handlePaymentMethodChange(method.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={() => handlePaymentMethodChange(method.id)}
                                                className="h-4 w-4 text-primary focus:ring-primary"
                                            />
                                            <div className="ml-3 flex items-center space-x-2">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    {method.icon}
                                                </div>
                                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {method.name}
                                                </div>
                                            </div>
                                        </div>
                                        {paymentMethod === method.id && (
                                            <div className="text-primary">
                                                <FiCheck className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-7 mt-1">
                                        {method.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="w-full"
                            >
                                Back to Cart
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                icon={<FiShoppingBag className="h-4 w-4" />}
                                isLoading={isLoading}
                                disabled={isLoading}
                                onClick={handleSubmit}
                                className="w-full"
                            >
                                Place Order
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckoutPage;