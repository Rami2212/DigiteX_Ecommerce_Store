import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineHeart,
    HiHeart,
    HiOutlineShoppingCart,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlinePlus,
    HiOutlineX
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/common/Button';

const WishlistPage = () => {
    const {
        wishlist,
        isLoading,
        getWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        moveAllToCart,
        isWishlistEmpty
    } = useWishlist();

    const { addToCart } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        getWishlist();
    }, [getWishlist]);

    // Helper function to validate wishlist item
    const isValidItem = (item) => {
        return item && item.product && item.product._id && item.product.name;
    };

    // Get only valid items
    const validItems = wishlist?.items?.filter(isValidItem) || [];

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === validItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(validItems.map((item, index) => index));
        }
    };

    const handleRemoveSelected = async () => {
        try {
            for (const itemIndex of selectedItems) {
                const item = validItems[itemIndex];
                if (item && item.product && item.product._id) {
                    await removeFromWishlist(item.product._id);
                }
            }
            setSelectedItems([]);
        } catch (error) {
            console.error('Error removing selected items:', error);
        }
    };

    const handleMoveToCart = async (item) => {
        try {
            if (item && item.product && item.product._id) {
                await moveToCart(item.product._id, null, 1);
            }
        } catch (error) {
            console.error('Error moving to cart:', error);
        }
    };

    const handleMoveAllToCart = async () => {
        try {
            await moveAllToCart();
        } catch (error) {
            console.error('Error moving all to cart:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            if (productId) {
                await removeFromWishlist(productId);
            }
        } catch (error) {
            console.error('Error removing item:', error);
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
        },
        exit: {
            x: -300,
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {validItems.length} item{validItems.length !== 1 ? 's' : ''} saved for later
                        </p>
                    </div>
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                        {validItems.length > 0 && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleMoveAllToCart}
                                    icon={<HiOutlineShoppingCart className="h-4 w-4" />}
                                >
                                    Move All to Cart
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={clearWishlist}
                                    icon={<HiOutlineTrash className="h-4 w-4" />}
                                >
                                    Clear All
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {validItems.length === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-16"
                >
                    <HiOutlineHeart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Your wishlist is empty
                    </h2>
                    <p className="text-gray-500 dark:text-gray-500 mb-8">
                        Save items you love to your wishlist and shop them later.
                    </p>
                    <Link to="/products">
                        <Button icon={<HiOutlinePlus className="h-4 w-4" />}>
                            Start Shopping
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <>
                    {/* Bulk Actions */}
                    {validItems.length > 0 && (
                        <motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === validItems.length && validItems.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            Select All ({validItems.length})
                                        </span>
                                    </label>
                                    {selectedItems.length > 0 && (
                                        <span className="text-sm text-gray-500">
                                            {selectedItems.length} selected
                                        </span>
                                    )}
                                </div>
                                {selectedItems.length > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRemoveSelected}
                                            icon={<HiOutlineTrash className="h-4 w-4" />}
                                        >
                                            Remove Selected
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Wishlist Items */}
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {validItems.map((item, index) => {
                                // Additional safety check
                                if (!isValidItem(item)) {
                                    console.warn('Invalid wishlist item found:', item);
                                    return null;
                                }

                                const product = item.product;
                                const productImage = product.productImage || 
                                                   product.productImages?.[0] || 
                                                   '/placeholder-image.jpg';
                                const productSlug = product.name?.toLowerCase().replace(/\s+/g, '-') || '';

                                return (
                                    <motion.div
                                        key={`${product._id}-${index}`}
                                        variants={itemVariants}
                                        exit="exit"
                                        layout
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
                                    >
                                        <div className="relative">
                                            {/* Product Image */}
                                            <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
                                                <img
                                                    src={productImage}
                                                    alt={product.name || 'Product'}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                            </div>

                                            {/* Selection Checkbox */}
                                            <div className="absolute top-3 left-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(index)}
                                                    onChange={() => handleSelectItem(index)}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary bg-white"
                                                />
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(product._id)}
                                                className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 dark:hover:bg-red-900"
                                            >
                                                <HiOutlineX className="h-4 w-4 text-gray-600 dark:text-gray-400 hover:text-red-600" />
                                            </button>

                                            {/* Sale Badge */}
                                            {product.salePrice && product.price && product.salePrice < product.price && (
                                                <div className="absolute top-3 right-12 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Sale
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                {product.name || 'Unknown Product'}
                                            </h3>

                                            {/* Short Description */}
                                            {product.shortDescription && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                    {product.shortDescription}
                                                </p>
                                            )}

                                            {/* Price */}
                                            <div className="flex items-center mb-3">
                                                {product.salePrice && product.price && product.salePrice < product.price ? (
                                                    <>
                                                        <span className="text-lg font-bold text-primary">
                                                            Rs. {product.salePrice.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-500 line-through ml-2">
                                                            Rs. {product.price.toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                        Rs. {(product.price || 0).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Added Date */}
                                            {item.addedAt && (
                                                <div className="mb-3">
                                                    <span className="text-xs text-gray-500">
                                                        Added {new Date(item.addedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Stock Status */}
                                            {product.stock !== undefined && (
                                                <div className="mb-3">
                                                    {product.stock > 0 ? (
                                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                            In Stock ({product.stock} available)
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="space-y-2">
                                                <Link
                                                    to={`/product/${product._id}/${productSlug}`}
                                                    className="w-full"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        icon={<HiOutlineEye className="h-4 w-4" />}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
};

export default WishlistPage;