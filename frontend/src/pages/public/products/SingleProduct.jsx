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
  FiRefreshCw,
  FiX,
  FiChevronRight,
  FiHome,
  FiAlertTriangle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { useAuth } from '../../../hooks/useAuth';
import { useProduct } from '../../../hooks/useProduct';
import { useCategory } from '../../../hooks/useCategory';
import { useAddon } from '../../../hooks/useAddon';
import Button from '../../../components/common/Button';
import * as Icons from 'react-icons/fi';

const SingleProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProductById, getProductsByCategory, selectedProduct, productsByCategory, isLoading } = useProduct();
  const { addToCart, isItemInCart, getItemQuantity, updateCartItem, removeFromCart, isLoading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isItemInWishlist, isLoading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { getCategoryById, selectedCategory } = useCategory();
  const { getAddons, addons, getAddonById, isLoading: addonsLoading } = useAddon();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]); // Track selected addons
  const [productAddons, setProductAddons] = useState([]); // Store product's available addons

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // Don't auto-select variant - let user choose

  useEffect(() => {
    if (selectedProduct?.category) {
      getCategoryById(selectedProduct.category);
      fetchRelatedProducts();
    }
  }, [selectedProduct]);

  // Fetch addons when component mounts or when product changes
  useEffect(() => {
    if (!addons || addons.length === 0) {
      getAddons();
    }
  }, []);

  // Filter product addons when addons are loaded or product changes
  useEffect(() => {
    if (selectedProduct?.addons && addons && addons.length > 0) {
      const filteredAddons = selectedProduct.addons
        .map(addonId => getAddonById(addonId))
        .filter(addon => addon !== null);
      setProductAddons(filteredAddons);
    } else {
      setProductAddons([]);
      setSelectedAddons([]);
    }
  }, [selectedProduct, addons, getAddonById]);

  // Create all images array - main image first, then product images, then variant images
  useEffect(() => {
    if (selectedProduct) {
      const images = [];

      // Add main product image first
      if (selectedProduct.productImage) {
        images.push(selectedProduct.productImage);
      }

      // Add additional product images (excluding main image to avoid duplicates)
      if (selectedProduct.productImages && selectedProduct.productImages.length > 0) {
        const additionalImages = selectedProduct.productImages.filter(
          img => img !== selectedProduct.productImage
        );
        images.push(...additionalImages);
      }

      // Add variant images
      if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        const variantImages = selectedProduct.variants
          .map(variant => variant.variantImage)
          .filter(Boolean)
          .filter(img => !images.includes(img)); // Avoid duplicates
        images.push(...variantImages);
      }

      setAllImages(images);
    }
  }, [selectedProduct]);

  // Update local wishlist state when product changes (no variant)
  useEffect(() => {
    if (selectedProduct && isAuthenticated) {
      setIsInWishlist(isItemInWishlist(selectedProduct._id));
    }
  }, [selectedProduct, isItemInWishlist, isAuthenticated]);

  // Update main image when product, variant, or selected image changes
  useEffect(() => {
    if (selectedProduct && allImages.length > 0) {
      if (selectedVariant?.variantImage) {
        // If variant is selected, show variant image
        setMainImage(selectedVariant.variantImage);
      } else if (allImages[selectedImageIndex]) {
        // Show selected image from slider
        setMainImage(allImages[selectedImageIndex]);
      } else {
        // Default to first image (main product image)
        setMainImage(allImages[0]);
      }
    }
  }, [selectedProduct, selectedVariant, selectedImageIndex, allImages]);

  const fetchProductDetails = async () => {
    try {
      await getProductById(productId);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };

  const fetchRelatedProducts = async () => {
    if (selectedProduct?.category) {
      try {
        const response = await getProductsByCategory(selectedProduct.category, 1, 6);
        // Filter out current product and limit to 4 products
        const filtered = productsByCategory?.filter(p => p._id !== selectedProduct._id).slice(0, 4) || [];
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      }
    }
  };

  const product = selectedProduct;
  const discountPercentage = product?.salePrice && product?.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Calculate final price including selected addons
  const basePrice = product?.salePrice || product?.price || 0;
  const addonsTotal = selectedAddons.reduce((total, addonId) => {
    const addon = getAddonById(addonId);
    return total + (addon ? Number(addon.price) : 0);
  }, 0);
  const finalPrice = basePrice + addonsTotal;

  // Add a state to track cart operations and force re-evaluation
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  // Recalculate cart status when cart updates or trigger changes
  const inCart = product && isAuthenticated ? isItemInCart(product._id, selectedVariant?.color) : false;
  const cartQuantity = product && isAuthenticated ? getItemQuantity(product._id, selectedVariant?.color) : 0;

  // Stock management - FIXED: Use product stock, not variant stock
  const currentStock = product?.stock || 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const displayImages = product?.productImages || (product?.productImage ? [product.productImage] : []);
  const categoryName = getCategoryById(product?.category)?.name || 'Uncategorized';

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

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => {
      if (prev.includes(addonId)) {
        return prev.filter(id => id !== addonId);
      } else {
        return [...prev, addonId];
      }
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (isOutOfStock) {
      return;
    }

    try {
      const cartData = {
        productId: product._id,
        quantity: quantity,
        selectedVariant: selectedVariant || {},
      };

      await addToCart(cartData);
      setQuantity(1);

      // Trigger a re-render to update cart status
      setCartUpdateTrigger(prev => prev + 1);
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

      // Trigger a re-render to update cart status
      setCartUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
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
    // FIXED: Reset quantity to 1 - stock is at product level, not variant level
    setQuantity(1);

    // Update selected image index to show variant image if it exists
    if (variant.variantImage) {
      const variantImageIndex = allImages.findIndex(img => img === variant.variantImage);
      if (variantImageIndex !== -1) {
        setSelectedImageIndex(variantImageIndex);
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);

    // Check if clicked image is a variant image
    const clickedImage = allImages[index];
    const variantForImage = product?.variants?.find(v => v.variantImage === clickedImage);

    if (variantForImage) {
      // If clicked image belongs to a variant, select that variant
      setSelectedVariant(variantForImage);
    } else {
      // If it's a product image, clear variant selection
      setSelectedVariant(null);
    }
  };

  const handleMainImageClick = () => {
    setIsGalleryOpen(true);
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
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
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
    <>
      <motion.div
        className="container mx-auto px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Breadcrumbs */}
        <motion.nav variants={itemVariants} className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={() => navigate('/')}
              className="hover:text-primary transition-colors"
            >
              <FiHome className="h-4 w-4" />
            </button>
            <FiChevronRight className="h-4 w-4" />
            <button
              onClick={() => navigate(`/products`)}
              className="hover:text-primary transition-colors"
            >
              Products
            </button>
            {product.category && (
              <>
                <FiChevronRight className="h-4 w-4" />
                <button
                  onClick={() => navigate(`/category/${categoryName.toLowerCase()}`)}
                  className="hover:text-primary transition-colors"
                >
                  {categoryName}
                </button>
              </>
            )}
            <FiChevronRight className="h-4 w-4" />
            <span className="text-gray-900 dark:text-white font-medium truncate">
              {product.name}
            </span>
          </div>
        </motion.nav>

        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            icon={<FiArrowLeft className="h-4 w-4" />}
            className="text-gray-600 hover:text-gray-900 text-sm px-2 py-1"
          >
            Back
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div variants={itemVariants} className="space-y-3">
            {/* Main Image */}
            <div className="relative lg:pr-12">
              <div
                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer mx-auto"
                onClick={handleMainImageClick}
              >
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Stock badge - FIXED: Always show when out of stock */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                      Out of Stock
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-colors ${allImages[selectedImageIndex] === image
                      ? 'border-primary'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            {/* Product Title & Category */}
            <div>
              {product.category && (
                <p className="text-xs text-primary font-medium mb-1 uppercase tracking-wide">
                  {categoryName}
                </p>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({product.reviewsCount || 0})
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status - FIXED: Always update based on current stock */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-red-600">
                  <FiAlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <FiAlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Only {currentStock} left in stock!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheck className="h-4 w-4" />
                  <span className="text-sm font-medium">In Stock ({currentStock} available)</span>
                </div>
              )}
            </div>

            {/* Price - Mobile: First Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-primary">
                  Rs. {finalPrice?.toFixed(2)}
                </span>
                {product.salePrice && product.price > product.salePrice && (
                  <>
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                      Rs. {product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -{discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">+ Free Shipping</span>
            </div>

            {/* Price Breakdown */}
            {selectedAddons.length > 0 && (
              <div className="text-sm space-y-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                  <span className="text-gray-900 dark:text-white">Rs. {basePrice.toFixed(2)}</span>
                </div>
                {selectedAddons.map(addonId => {
                  const addon = getAddonById(addonId);
                  return addon ? (
                    <div key={addonId} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">+ {addon.name}:</span>
                      <span className="text-gray-900 dark:text-white">Rs. {Number(addon.price).toFixed(2)}</span>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-primary">Rs. {finalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Description */}
            {product.shortDescription && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Color: {selectedVariant ? (
                    <span className="font-normal">{selectedVariant.color}</span>
                  ) : (
                    <span className="font-normal text-gray-500">Please select a color</span>
                  )}
                </h3>
                <div className="flex gap-2">
                  {product.variants.map((variant, index) => {
                    // FIXED: Allow color selection even when out of stock
                    return (
                      <button
                        key={index}
                        onClick={() => handleVariantChange(variant)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedVariant?.color === variant.color
                            ? 'border-primary scale-110 shadow-md'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:scale-105'
                        } ${isOutOfStock ? 'opacity-75' : ''}`}
                        style={{ backgroundColor: variant.color.toLowerCase() }}
                        title={`${variant.color}${isOutOfStock ? ' - Product Out of Stock' : ''}`}
                      >
                        {selectedVariant?.color === variant.color && (
                          <FiCheck className="h-4 w-4 text-white m-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Addons */}
            {productAddons && productAddons.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <FiPlus className="h-4 w-4 text-primary" />
                  Add-ons:
                </h3>
                {addonsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading add-ons...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {productAddons.map((addon) => (
                      <label
                        key={addon._id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedAddons.includes(addon._id)}
                            onChange={() => handleAddonToggle(addon._id)}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <div className="flex items-center space-x-2">
                            {/* Addon Icon */}
                            {addon.icon ? (
                              <img
                                src={addon.icon}
                                alt={addon.name}
                                className="h-4 w-4 object-contain"
                                onError={(e) => {
                                  // Fallback to default icon if image fails to load
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline-block';
                                }}
                              />
                            ) : null}
                            {(addon.icon && Icons[addon.icon]) ? (
                              React.createElement(Icons[addon.icon], { className: "h-6 w-6 text-primary" })
                            ) : (
                              <Icons.FiSettings className="h-4 w-4 text-gray-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {addon.name}
                              </p>
                              {addon.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {addon.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-primary flex items-center gap-1">
                          Rs. {Number(addon.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quantity & All Action Buttons - Mobile: Second Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Selector - FIXED: Hide when out of stock */}
              {!isOutOfStock && isAuthenticated && (
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-fit">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-2 font-medium min-w-[2.5rem] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= currentStock}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex gap-3 flex-1">
                {/* Add to Cart Button */}
                {!isAuthenticated ? (
                  <Button
                    onClick={() => navigate('/auth/login')}
                    variant="primary"
                    className="flex-1 py-2"
                    icon={<FiShoppingCart className="h-4 w-4" />}
                  >
                    Login to Add to Cart
                  </Button>
                ) : isOutOfStock ? (
                  <Button
                    disabled={true}
                    variant="outline"
                    className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    icon={<FiAlertTriangle className="h-4 w-4" />}
                  >
                    Out of Stock
                  </Button>
                ) : !inCart ? (
                  <Button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    variant="primary"
                    className="flex-1 py-2"
                    icon={<FiShoppingCart className="h-4 w-4" />}
                    isLoading={cartLoading}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/cart')}
                    variant="primary"
                    className="flex-1 py-2"
                    icon={<FiShoppingCart className="h-4 w-4" />}
                  >
                    View Cart ({cartQuantity})
                  </Button>
                )}

                {/* Wishlist Button (smaller) - Only show if authenticated */}
                {isAuthenticated && (
                  <Button
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                    variant="outline"
                    className="p-2"
                    isLoading={wishlistLoading}
                  >
                    <FiHeart
                      className={`h-4 w-4 ${isInWishlist
                        ? 'text-red-500 fill-current'
                        : 'text-gray-500'
                        }`}
                    />
                  </Button>
                )}

                {/* Share Button (smaller) */}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="p-2"
                >
                  <FiShare2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category */}
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Category: </span>
              <span className="text-gray-900 dark:text-white font-medium">{categoryName}</span>
            </div>

            {/* Product Features */}
            <div className="grid lg:grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-md">
                  <FiTruck className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                  <p className="text-gray-500 dark:text-gray-400">On orders over Rs. 2000</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                  <FiShield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Secure Payment</p>
                  <p className="text-gray-500 dark:text-gray-400">SSL encrypted</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-md">
                  <FiRefreshCw className="h-3 w-3 text-purple-600 dark:text-purple-400" />
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
          <motion.div variants={itemVariants} className="mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Product Description
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div variants={itemVariants} className="mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    key={relatedProduct._id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct._id}`)}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                      <img
                        src={relatedProduct.productImage}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-primary font-bold text-sm">
                      Rs. {(relatedProduct.salePrice || relatedProduct.price)?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsGalleryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <FiX className="h-8 w-8" />
              </button>

              {mainImage && (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              )}

              {/* Thumbnail Navigation */}
              {allImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4 overflow-x-auto">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${allImages[selectedImageIndex] === image
                        ? 'border-white'
                        : 'border-gray-500 hover:border-white'
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SingleProductPage;