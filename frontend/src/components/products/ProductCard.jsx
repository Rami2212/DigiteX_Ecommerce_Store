import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiShoppingCart,
  FiStar,
  FiEye,
  FiCheck
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const ProductCard = ({ product }) => {
  const { addToCart, isItemInCart, isLoading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist, isLoading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const productSlug = product.name?.toLowerCase().replace(/\s+/g, '-') || '';
  const discountPercentage = product.salePrice && product.price 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const finalPrice = product.salePrice || product.price;
  
  // Check if the specific variant (or no variant) is in cart
  const inCart = selectedVariant 
    ? isItemInCart(product._id, selectedVariant.color)
    : isItemInCart(product._id, null);

  // Update local wishlist state when component mounts or product changes
  useEffect(() => {
    if (product) {
      setIsInWishlist(isItemInWishlist(product._id));
    }
  }, [product, isItemInWishlist]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FiStar key="half" className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // You might want to show a login modal or redirect
      return;
    }

    try {
      const cartData = {
        productId: product._id,
        quantity: quantity,
        selectedVariant: selectedVariant || {}
      };
      
      await addToCart(cartData);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleViewCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/cart');
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // You might want to show a login modal or redirect
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id);
        setIsInWishlist(false);
      } else {
        const wishlistData = {
          productId: product._id
        };
        await addToWishlist(wishlistData);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const displayImage = selectedVariant?.variantImage || product.productImage || product.productImages?.[0];

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative border border-gray-200 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Link to={`/product/${product._id}/${productSlug}`}>
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <motion.div 
              className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              -{discountPercentage}%
            </motion.div>
          )}
          {product.isNew && (
            <motion.div 
              className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              New
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="absolute top-3 right-3 flex flex-col gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            disabled={wishlistLoading}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <FiHeart 
              className={`h-5 w-5 transition-colors ${
                isInWishlist 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Quick View Button */}
          <Link
            to={`/product/${product._id}/${productSlug}`}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <FiEye className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
          </Link>
        </motion.div>

        {/* Stock Status Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Cart Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
        >
          {!inCart ? (
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || cartLoading}
              variant="primary"
              className="w-full py-2 text-sm font-medium shadow-lg"
              icon={<FiShoppingCart className="h-4 w-4" />}
              isLoading={cartLoading}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          ) : (
            <Button
              onClick={handleViewCart}
              variant="outline"
              className="w-full py-2 text-sm font-medium shadow-lg bg-white dark:bg-gray-800 border-primary text-primary hover:bg-primary hover:text-white"
              icon={<FiShoppingCart className="h-4 w-4" />}
            >
              View Cart
            </Button>
          )}
        </motion.div>
      </div>
      
      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <div>
          <Link 
            to={`/product/${product._id}/${productSlug}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2 leading-tight"
          >
            {product.name}
          </Link>
          
          {product.category && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {product.category.name}
            </p>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({product.reviewsCount || 0})
            </span>
          </div>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Colors:</p>
            <div className="flex gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => handleVariantChange(variant)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedVariant?.color === variant.color
                      ? 'border-primary scale-110 shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:scale-105'
                  }`}
                  style={{ backgroundColor: variant.color.toLowerCase() }}
                  title={variant.color}
                >
                  {selectedVariant?.color === variant.color && (
                    <FiCheck className="h-4 w-4 text-white m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-primary">
            Rs. {finalPrice?.toFixed(2)}
          </span>
          {product.salePrice && product.price > product.salePrice && (
            <span className="text-base text-gray-500 dark:text-gray-400 line-through">
              Rs. {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex gap-2 md:hidden">
          {!inCart ? (
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || cartLoading}
              variant="primary"
              className="flex-1 py-2 text-sm"
              icon={<FiShoppingCart className="h-4 w-4" />}
              isLoading={cartLoading}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          ) : (
            <Button
              onClick={handleViewCart}
              variant="outline"
              className="flex-1 py-2 text-sm border-primary text-primary hover:bg-primary hover:text-white"
              icon={<FiShoppingCart className="h-4 w-4" />}
            >
              View Cart
            </Button>
          )}
          
          <button
            onClick={handleToggleWishlist}
            disabled={wishlistLoading}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FiHeart 
              className={`h-5 w-5 ${
                isInWishlist 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} 
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    productImage: PropTypes.string,
    productImages: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    stock: PropTypes.number,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
    rating: PropTypes.number,
    reviewsCount: PropTypes.number,
    shortDescription: PropTypes.string,
    isNew: PropTypes.bool,
    variants: PropTypes.arrayOf(PropTypes.shape({
      color: PropTypes.string.isRequired,
      variantImage: PropTypes.string,
    })),
  }).isRequired,
};

export default ProductCard;