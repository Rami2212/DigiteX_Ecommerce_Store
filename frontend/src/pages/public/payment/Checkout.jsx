import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiMapPin, FiCreditCard, FiTruck, FiShoppingBag, FiArrowLeft, FiCheck, FiDollarSign, FiShoppingCart, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useOrder } from '../../../hooks/useOrder';
import { useCart } from '../../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
    const { createOrderFromCart, isLoading } = useOrder();
    const { cart, getCart } = useCart();
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
    const [currentOrder, setCurrentOrder] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [showCartItems, setShowCartItems] = useState(false);

    // Debug effect to track state changes
    useEffect(() => {
        console.log('State updated:', {
            showPayment,
            hasCurrentOrder: !!currentOrder,
            hasClientSecret: !!clientSecret,
            currentOrderId: currentOrder?._id,
            clientSecretPreview: clientSecret ? clientSecret.substring(0, 20) + '...' : null
        });
    }, [showPayment, currentOrder, clientSecret]);

    // Load cart data on component mount
    useEffect(() => {
        getCart();
    }, [getCart]);

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
            };

            console.log('Creating order with data:', orderData);
            const result = await createOrderFromCart(orderData);
            console.log('Order creation result:', result); // Debug log

            if (paymentMethod === 'stripe') {
                // For Stripe orders, show payment form
                const orderData = result.order.order;
                const clientSecretValue = result.order.clientSecret;

                console.log('Setting up Stripe payment:', {
                    order: orderData,
                    clientSecret: clientSecretValue,
                    hasOrder: !!orderData,
                    hasClientSecret: !!clientSecretValue
                }); // Debug log

                // Update all state at once to avoid timing issues
                setCurrentOrder(orderData);
                setClientSecret(clientSecretValue);

                // Use setTimeout to ensure state is updated before showing payment
                setTimeout(() => {
                    setShowPayment(true);
                }, 0);
            } else {
                // For COD orders, navigate directly to order confirmation
                navigate(`/order-success/${result.order.order._id}`);
            }

        } catch (error) {
            console.error('Failed to place order:', error);
        }
    };

    const handlePaymentSuccess = (orderId) => {
        setShowPayment(false);
        navigate(`/order-success/${orderId}`);
    };

    const handlePaymentError = (error) => {
        console.error('Payment failed:', error);
        setShowPayment(false);
        // Navigate to payment failed page with order ID for retry option
        navigate(`/payment-failed/${currentOrder._id}`);
    };

    const handlePaymentCancel = () => {
        setShowPayment(false);
        // Navigate back to checkout or order pending page
        navigate(`/order-pending/${currentOrder._id}`);
    };

    const handleCancel = () => {
        navigate('/cart');
    };

    // Calculate order summary
    const subtotal = cart?.totalAmount || 0;

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
            price: 'Rs. 299',
            icon: <FiTruck className="h-5 w-5" />
        },
        {
            id: 'overnight',
            name: 'Overnight Shipping',
            description: 'Next business day',
            price: 'Rs. 799',
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
            {showPayment && currentOrder && clientSecret ? (
                // Show Stripe Payment Form using CheckoutProvider

                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    {/* Render Payment Form */}
                    <PaymentForm
                        order={currentOrder}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onCancel={handlePaymentCancel}
                    />
                </Elements>
            ) : (
                // Show Checkout Form
                <>
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

                    {/* Cart Items Summary */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        {/* Cart Summary Header */}
                        <div
                            className="p-4 md:p-6 cursor-pointer"
                            onClick={() => setShowCartItems(!showCartItems)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <FiShoppingCart className="h-5 w-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Order Summary
                                    </h2>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ({cart?.totalItems || 0} items)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-lg font-bold text-primary">
                                        Rs. {subtotal.toFixed(2)}
                                    </span>
                                    {showCartItems ?
                                        <FiChevronUp className="h-5 w-5 text-gray-400" /> :
                                        <FiChevronDown className="h-5 w-5 text-gray-400" />
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Expandable Cart Items */}
                        {showCartItems && (
                            <div className="border-t border-gray-200 dark:border-gray-700">
                                {/* Cart Items List */}
                                <div className="p-4 md:p-6 space-y-4">
                                    {cart?.items?.map((item) => {
                                        const price = item.product.salePrice || item.product.price || 0;
                                        const imageSource = item.selectedVariant?.variantImage ||
                                            item.product.productImage ||
                                            (item.product.productImages && item.product.productImages.length > 0 ? item.product.productImages[0] : null) ||
                                            '/placeholder-product.jpg';

                                        return (
                                            <div key={`${item.product._id}-${item.selectedVariant?.color || 'default'}`} className="flex items-center space-x-4">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={imageSource}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-product.jpg';
                                                        }}
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                                        {item.product.name}
                                                    </h3>
                                                    {item.selectedVariant?.color && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div
                                                                className="w-3 h-3 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: item.selectedVariant.color.toLowerCase() }}
                                                            ></div>
                                                            <span className="text-xs text-gray-500 capitalize">
                                                                {item.selectedVariant.color}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            Qty: {item.quantity}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            Rs. {(price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-3">
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-gray-900 dark:text-white">Total</span>
                                            <span className="text-primary">Rs. {subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Side - Shipping Address Form */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                            <div className="space-y-8">
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
                            </div>
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
                                            className={`relative flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${shippingMethod === method.id
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
                                            className={`relative flex flex-col p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === method.id
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
                </>
            )}
        </motion.div>
    );
};

export default CheckoutPage;