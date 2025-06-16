import React, { useState, useEffect } from 'react';
import {
    FiShoppingCart,
    FiTrash2,
    FiPlus,
    FiMinus,
    FiChevronRight,
    FiX,
    FiHeart,
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle,
    FiHome,
    FiArrowLeft,
    FiShoppingBag
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Assuming these are your common components' paths
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import DeleteModal from '../../../components/modals/DeleteModal';
import { useCart } from '../../../hooks/useCart';

const CartPage = () => {
    const {
        cart,
        itemCount,
        isLoading,
        error,
        getCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        clearError,
    } = useCart();

    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [removingItems, setRemovingItems] = useState(new Set());

    useEffect(() => {
        getCart();
    }, [getCart]);

    const handleQuantityChange = async (productId, newQuantity, variantColor = null) => {
        if (newQuantity < 1) return;

        const itemKey = `${productId}-${variantColor || 'default'}`;
        setUpdatingItems(prev => new Set([...prev, itemKey]));

        try {
            await updateCartItem(productId, { quantity: newQuantity }, variantColor);
        } catch (err) {
            console.error('Failed to update quantity:', err);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemKey);
                return newSet;
            });
        }
    };

    const confirmRemoveItem = (productId, variantColor) => {
        setItemToRemove({ productId, variantColor });
    };

    const handleRemoveConfirmed = async () => {
        if (!itemToRemove) return;

        const { productId, variantColor } = itemToRemove;
        const itemKey = `${productId}-${variantColor || 'default'}`;
        setRemovingItems(prev => new Set([...prev, itemKey]));

        try {
            await removeFromCart(productId, variantColor);
            setItemToRemove(null);
        } catch (err) {
            console.error('Failed to remove item:', err);
        } finally {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemKey);
                return newSet;
            });
        }
    };

    const handleClearCartConfirmed = async () => {
        try {
            await clearCart();
            setShowClearConfirm(false);
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    // Use pre-calculated values from API
    const subtotal = cart?.totalAmount || 0;
    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = subtotal > 2000 ? 0 : 199; // Free shipping over Rs. 2000
    const total = subtotal + tax + shipping;

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

    if (isLoading && !cart) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="container mx-auto px-4 space-y-6">
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Link to="/">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<FiArrowLeft className="h-5 w-5" />}
                                >
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <FiShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                                    Shopping Cart
                                </h1>
                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                                    {cart?.totalItems > 0 ? `${cart.totalItems} ${cart.totalItems === 1 ? 'item' : 'items'} in your cart` : 'Your cart is empty'}
                                </p>
                            </div>
                        </div>

                        {cart?.items?.length > 0 && (
                            <Button
                                onClick={() => setShowClearConfirm(true)}
                                variant="outline"
                                className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 w-full sm:w-auto"
                                icon={<FiTrash2 className="h-4 w-4" />}
                            >
                                Clear Cart
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Breadcrumb */}
                <motion.nav variants={itemVariants} className="flex items-center space-x-2 text-sm">
                    <Link to="/" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                        <FiHome className="h-4 w-4" />
                        Home
                    </Link>
                    <FiChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                        Shopping Cart
                    </span>
                </motion.nav>

                {/* Error Message */}
                {error && (
                    <motion.div variants={itemVariants} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                        <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-red-800 dark:text-red-200">{error}</p>
                        </div>
                        <Button
                            onClick={clearError}
                            variant="ghost"
                            className="text-red-600 hover:text-red-800"
                        >
                            <FiX className="h-5 w-5" />
                        </Button>
                    </motion.div>
                )}

                {/* Cart Content */}
                {!cart?.items || cart.items.length === 0 ? (
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors">
                        <FiShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Your cart is empty
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link to="/products">
                            <Button
                                variant="primary"
                                className="inline-flex items-center px-6 py-3"
                                icon={<FiShoppingBag className="h-4 w-4" />}
                            >
                                Continue Shopping
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Cart Items ({cart.items.length})
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {cart.items.map((item) => {
                                        const itemKey = `${item.product._id}-${item.selectedVariant?.color || 'default'}`;
                                        const isUpdating = updatingItems.has(itemKey);
                                        const isRemoving = removingItems.has(itemKey);
                                        const price = item.product.salePrice || item.product.price || 0;
                                        
                                        // Fixed image source priority
                                        const imageSource = item.selectedVariant?.variantImage || 
                                                           item.product.productImage || 
                                                           (item.product.productImages && item.product.productImages.length > 0 ? item.product.productImages[0] : null) ||
                                                           '/placeholder-product.jpg';

                                        return (
                                            <div
                                                key={itemKey}
                                                className={`p-4 md:p-6 relative ${isRemoving ? 'opacity-50' : ''} transition-opacity`}
                                            >
                                                {(isUpdating || isRemoving) && (
                                                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 rounded">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                                                        <img
                                                            src={imageSource}
                                                            alt={item.product.name}
                                                            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                            onError={(e) => {
                                                                console.log('Image failed to load, trying fallback...');
                                                                e.target.src = '/placeholder-product.jpg';
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                                                            <div className="flex-1">
                                                                <Link
                                                                    to={`/product/${item.product._id}`}
                                                                    className="text-base md:text-lg font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2 block"
                                                                >
                                                                    {item.product.name}
                                                                </Link>
                                                                {item.selectedVariant?.color && (
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400">Color:</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <div
                                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                                style={{ backgroundColor: item.selectedVariant.color.toLowerCase() }}
                                                                            ></div>
                                                                            <span className="text-sm text-gray-900 dark:text-white capitalize">
                                                                                {item.selectedVariant.color}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <Button
                                                                onClick={() => confirmRemoveItem(item.product._id, item.selectedVariant?.color)}
                                                                variant="ghost"
                                                                className="text-gray-400 hover:text-red-600 p-2 self-start"
                                                                disabled={isRemoving}
                                                            >
                                                                <FiTrash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="text-lg md:text-xl font-bold text-primary">
                                                                Rs. {price.toFixed(2)}
                                                            </span>
                                                            {item.product.price && item.product.salePrice && item.product.price > item.product.salePrice && (
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    Rs. {item.product.price.toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Quantity Controls - Mobile Friendly */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                            <div className="flex items-center justify-center sm:justify-start">
                                                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                                                    <Button
                                                                        onClick={() => handleQuantityChange(
                                                                            item.product._id,
                                                                            item.quantity - 1,
                                                                            item.selectedVariant?.color
                                                                        )}
                                                                        disabled={item.quantity <= 1 || isUpdating}
                                                                        variant="ghost"
                                                                        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <FiMinus className="h-4 w-4" />
                                                                    </Button>

                                                                    <Input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleQuantityChange(
                                                                            item.product._id,
                                                                            parseInt(e.target.value) || 1,
                                                                            item.selectedVariant?.color
                                                                        )}
                                                                        min="1"
                                                                        className="w-[60px] text-center bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white font-medium"
                                                                        disabled={isUpdating}
                                                                    />

                                                                    <Button
                                                                        onClick={() => handleQuantityChange(
                                                                            item.product._id,
                                                                            item.quantity + 1,
                                                                            item.selectedVariant?.color
                                                                        )}
                                                                        disabled={isUpdating}
                                                                        variant="ghost"
                                                                        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <FiPlus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            <div className="text-center sm:text-right">
                                                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    Rs. {(price * item.quantity).toFixed(2)}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Rs. {price.toFixed(2)} each
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Continue Shopping */}
                            <div className="text-center">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Continue Shopping
                                    <FiChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-6 transition-colors">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Rs. {subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Rs. {tax.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-gray-900 dark:text-white">Total</span>
                                            <span className="text-primary">Rs. {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            Add Rs. {(2000 - subtotal).toFixed(2)} more for free shipping!
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Link to="/checkout" className="block">
                                        <Button
                                            variant="primary"
                                            className="w-full py-3 px-4"
                                            icon={<FiShoppingBag className="h-4 w-4" />}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        icon={<FiHeart className="h-4 w-4" />}
                                    >
                                        Save to Wishlist
                                    </Button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <FiRefreshCw className="h-4 w-4" />
                                        30-day return policy
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <FiCheckCircle className="h-4 w-4" />
                                        Secure checkout
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Clear Cart Confirmation Modal */}
                <DeleteModal
                    isOpen={showClearConfirm}
                    onClose={() => setShowClearConfirm(false)}
                    onConfirm={handleClearCartConfirmed}
                    title="Clear Cart?"
                    description="Are you sure you want to remove all items from your cart? This action cannot be undone."
                    confirmButtonText="Clear Cart"
                    confirmButtonVariant="danger"
                />

                {/* Individual Item Removal Confirmation Modal */}
                {itemToRemove && (
                    <DeleteModal
                        isOpen={!!itemToRemove}
                        onClose={() => setItemToRemove(null)}
                        onConfirm={handleRemoveConfirmed}
                        title="Remove Item?"
                        description={`Are you sure you want to remove "${cart.items.find(item =>
                            item.product._id === itemToRemove.productId &&
                            (item.selectedVariant?.color === itemToRemove.variantColor || !itemToRemove.variantColor)
                        )?.product.name}" from your cart?`}
                        confirmButtonText="Remove"
                        confirmButtonVariant="danger"
                    />
                )}
            </div>
        </motion.div>
    );
};

export default CartPage;