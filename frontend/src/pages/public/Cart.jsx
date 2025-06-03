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
    FiHome // Correctly imported FiHome
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Assuming these are your common components' paths
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import DeleteModal from '../../components/modals/DeleteModal';
import { useCart } from '../../hooks/useCart';

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
        // No need to set setShowClearConfirm(false) here, as this is for individual item removal
        // and setShowClearConfirm is for clearing the entire cart.

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
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    if (isLoading && !cart) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm mb-6">
                    <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                        {/* Used the imported FiHome component directly */}
                        <FiHome className="h-4 w-4" />
                        Home
                    </Link>
                    <FiChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                        Shopping Cart
                    </span>
                </nav>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="flex items-center gap-3 mb-4 sm:mb-0"> {/* Added mb-4 for spacing on mobile */}
                        <FiShoppingCart className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Shopping Cart
                        </h1>
                        {cart?.totalItems > 0 && (
                            <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                                {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </div>

                    {cart?.items?.length > 0 && (
                        <Button
                            onClick={() => setShowClearConfirm(true)}
                            variant="outline"
                            className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 w-full sm:w-auto" // Added w-full and sm:w-auto
                        >
                            <FiTrash2 className="h-5 w-5" />
                            Clear Cart
                        </Button>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center gap-3">
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
                    </div>
                )}

                {/* Cart Content */}
                {!cart?.items || cart.items.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center transition-colors">
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
                            >
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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

                                        return (
                                            <div
                                                key={itemKey}
                                                className={`p-6 relative ${isRemoving ? 'opacity-50' : ''} transition-opacity`}
                                            >
                                                {(isUpdating || isRemoving) && (
                                                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 rounded">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                    </div>
                                                )}

                                                <div className="flex gap-4">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={item.selectedVariant?.variantImage || item.product.productImage || '/placeholder-product.jpg'}
                                                            alt={item.product.name}
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                        />
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <Link
                                                                    to={`/products/${item.product.slug || item.product._id}`}
                                                                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2"
                                                                >
                                                                    {item.product.name}
                                                                </Link>
                                                                {item.selectedVariant && (
                                                                    <div className="flex items-center gap-4 mt-1">
                                                                        {item.selectedVariant.color && (
                                                                            <div className="flex items-center gap-2">
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
                                                                        {item.selectedVariant.size && (
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
                                                                                <span className="text-sm text-gray-900 dark:text-white">
                                                                                    {item.selectedVariant.size}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <Button
                                                                onClick={() => confirmRemoveItem(item.product._id, item.selectedVariant?.color)}
                                                                variant="ghost"
                                                                className="text-gray-400 hover:text-red-600"
                                                                disabled={isRemoving}
                                                            >
                                                                <FiTrash2 className="h-5 w-5" />
                                                            </Button>
                                                        </div>

                                                        {/* Price and Stock Info */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xl font-bold text-blue-600">
                                                                    ${price.toFixed(2)}
                                                                </span>
                                                                {item.product.price && item.product.salePrice && item.product.price > item.product.salePrice && (
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        ${item.product.price.toFixed(2)}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {item.product.stock !== undefined && (
                                                                <div className="flex items-center gap-1">
                                                                    {item.product.stock > 0 ? (
                                                                        <>
                                                                            <FiCheckCircle className="h-4 w-4 text-green-500" />
                                                                            <span className="text-sm text-green-600 dark:text-green-400">
                                                                                {item.product.stock} in stock
                                                                            </span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FiAlertCircle className="h-4 w-4 text-red-500" />
                                                                            <span className="text-sm text-red-600 dark:text-red-400">
                                                                                Out of stock
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
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
                                                                        parseInt(e.target.value),
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
                                                                    disabled={isUpdating || (item.product.stock !== undefined && item.quantity >= item.product.stock)}
                                                                    variant="ghost"
                                                                    className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <FiPlus className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="text-right">
                                                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                                    ${item.totalPrice.toFixed(2)}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ${price.toFixed(2)} each
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
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                                >
                                    Continue Shopping
                                    <FiChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6 transition-colors">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            ${tax.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-gray-900 dark:text-white">Total</span>
                                            <span className="text-blue-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-6">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Link to="/checkout" className="block">
                                        <Button
                                            variant="primary"
                                            className="w-full py-3 px-4"
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <FiHeart className="h-5 w-5" />
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
                        </div>
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
        </div>
    );
};

export default CartPage;