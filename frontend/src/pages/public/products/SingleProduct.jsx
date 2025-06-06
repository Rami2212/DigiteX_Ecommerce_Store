import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiShoppingCart,
  FiStar,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { useAuth } from '../../../hooks/useAuth';
import { useProduct } from '../../../hooks/useProduct';
import Button from '../../../components/common/Button';

const SingleProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById, getProductsByCategory, selectedProduct, isLoading } = useProduct();
  const { addToCart, isItemInCart, getItemQuantity, updateCartItem, removeFromCart, isLoading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist, isLoading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    if (selectedProduct?.variants && selectedProduct.variants.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct?.category?._id) {
      getProductsByCategory(selectedProduct.category._id);
    }
  }, [selectedProduct]);

  const fetchProductDetails = async () => {
    try {
      await getProductById(productId);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const product = selectedProduct;
  const discountPercentage = product?.salePrice && product?.price 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const finalPrice = product?.salePrice || product?.price;
  const inWishlist = product ? isItemInWishlist(product._id, selectedVariant?.color) : false;
  const inCart = product ? isItemInCart(product._id, selectedVariant?.color) : false;
  const cartQuantity = product ? getItemQuantity(product._id, selectedVariant?.color) : 0;

  const displayImages = product?.productImages || (product?.productImage ? [product.productImage] : []);
  const mainImage = selectedVariant?.variantImage || displayImages[selectedImageIndex] || product?.productImage;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="h-5 w-5 text-yellow-400 fill-current opacity-50" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    
    return stars;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show modal
      return;
    }

    try {
      const cartData = {
        productId: product._id,
        quantity: quantity,
        selectedVariant: selectedVariant || {}
      };
      
      await addToCart(cartData);
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleUpdateCartQuantity = async (newQuantity) => {
    if (!isAuthenticated || newQuantity < 0) return;
    
    try {
      if (newQuantity === 0) {
        await removeFromCart(product._id, selectedVariant?.color);
      } else {
        await updateCartItem(product._id, { quantity: newQuantity }, selectedVariant?.color);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      if (inWishlist) {
        await removeFromWishlist(product._id, selectedVariant?.color);
      } else {
        const wishlistData = {
          productId: product._id,
          selectedVariant: selectedVariant || {}
        };
        await addToWishlist(wishlistData);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast notification here
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

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
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div variants={itemVariants} className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          icon={<FiArrowLeft className="h-5 w-5" />}
          className="text-gray-600 hover:text-gray-900"
        >
          Back
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Product Title & Category */}
          <div>
            {product.category && (
              <p className="text-sm text-primary font-medium mb-2">
                {product.category.name}
              </p>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  ({product.reviewsCount || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">
              Rs. {finalPrice?.toFixed(2)}
            </span>
            {product.salePrice && product.price > product.salePrice && (
              <>
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  Rs. {product.price.toFixed(2)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                  -{discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Color: {selectedVariant?.color}
              </h3>
              <div className="flex gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleVariantChange(variant)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      selectedVariant?.color === variant.color
                        ? 'border-primary scale-110 shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:scale-105'
                    }`}
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                    title={variant.color}
                  >
                    {selectedVariant?.color === variant.color && (
                      <FiCheck className="h-6 w-6 text-white m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Cart Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="px-4 py-3 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.stock || 0)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
              
              {/* Stock Status */}
              <div className="text-sm">
                {product.stock > 0 ? (
                  <span className="text-green-600 dark:text-green-400">
                    {product.stock} items in stock
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!inCart ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || cartLoading}
                  variant="primary"
                  size="lg"
                  className="flex-1 py-4 text-lg"
                  icon={<FiShoppingCart className="h-5 w-5" />}
                  isLoading={cartLoading}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              ) : (
                <div className="flex-1 flex items-center gap-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    In Cart:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateCartQuantity(cartQuantity - 1)}
                      className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                      disabled={cartQuantity <= 1}
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    
                    <span className="font-bold text-lg min-w-[2rem] text-center">
                      {cartQuantity}
                    </span>
                    
                    <button
                      onClick={() => handleUpdateCartQuantity(cartQuantity + 1)}
                      className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <Button
                    onClick={() => handleUpdateCartQuantity(0)}
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    Remove
                  </Button>
                </div>
              )}
              
              <Button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                variant="outline"
                size="lg"
                className="px-4"
                isLoading={wishlistLoading}
              >
                <FiHeart 
                  className={`h-5 w-5 ${
                    inWishlist 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-500'
                  }`} 
                />
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="px-4"
              >
                <FiShare2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiTruck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                <p className="text-gray-500 dark:text-gray-400">On orders over Rs. 2000</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Secure Payment</p>
                <p className="text-gray-500 dark:text-gray-400">SSL encrypted</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiRefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Easy Returns</p>
                <p className="text-gray-500 dark:text-gray-400">30-day return policy</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Description */}
      {product.description && (
        <motion.div variants={itemVariants} className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Product Description
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SingleProductPage;