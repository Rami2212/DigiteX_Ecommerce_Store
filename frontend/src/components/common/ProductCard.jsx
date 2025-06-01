import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineHeart, 
  HiHeart, 
  HiOutlineShoppingCart,
  HiOutlineStar,
  HiStar,
  HiOutlineEye
} from 'react-icons/hi';
import PropTypes from 'prop-types';

const ProductCard = ({ 
  product, 
  viewMode = 'grid', 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false,
  showQuickView = true 
}) => {
  const productSlug = product.name?.toLowerCase().replace(/\s+/g, '-') || '';
  const discountPercentage = product.originalPrice && product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<HiStar key={i} className="h-4 w-4 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<HiStar key="half" className="h-4 w-4 text-yellow-400 opacity-50" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<HiOutlineStar key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 group">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="relative w-full md:w-48 h-48 flex-shrink-0">
            <Link to={`/product/${product._id}/${productSlug}`}>
              <img
                src={product.productImages?.[0] || '/api/placeholder/300/300'}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                -{discountPercentage}%
              </div>
            )}
            
            {/* Stock Status */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-3">
            <div>
              <Link 
                to={`/product/${product._id}/${productSlug}`}
                className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2"
              >
                {product.name}
              </Link>
              
              {product.brand && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  by {product.brand}
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
                  ({product.reviewsCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <HiOutlineShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isInWishlist ? (
                  <HiHeart className="h-5 w-5 text-red-500" />
                ) : (
                  <HiOutlineHeart className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {showQuickView && (
                <Link
                  to={`/product/${product._id}/${productSlug}`}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <HiOutlineEye className="h-5 w-5 text-gray-500" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group relative">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product._id}/${productSlug}`}>
          <img
            src={product.productImages?.[0] || '/api/placeholder/300/300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineShoppingCart className="h-5 w-5 text-gray-700" />
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              {isInWishlist ? (
                <HiHeart className="h-5 w-5 text-red-500" />
              ) : (
                <HiOutlineHeart className="h-5 w-5 text-gray-700" />
              )}
            </button>
            
            {showQuickView && (
              <Link
                to={`/product/${product._id}/${productSlug}`}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <HiOutlineEye className="h-5 w-5 text-gray-700" />
              </Link>
            )}
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{discountPercentage}%
            </div>
          )}
          {product.isNew && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              New
            </div>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
        >
          {isInWishlist ? (
            <HiHeart className="h-5 w-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="p-4 space-y-3">
        <div>
          <Link 
            to={`/product/${product._id}/${productSlug}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
          
          {product.brand && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {product.brand}
            </p>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.reviewsCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            ${product.price?.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    productImages: PropTypes.arrayOf(PropTypes.string),
    originalPrice: PropTypes.number,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number,
    brand: PropTypes.string,
    rating: PropTypes.number,
    reviewsCount: PropTypes.number,
    description: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']),
  onAddToCart: PropTypes.func,
  onToggleWishlist: PropTypes.func,
  isInWishlist: PropTypes.bool,
  showQuickView: PropTypes.bool,
};

export default ProductCard;