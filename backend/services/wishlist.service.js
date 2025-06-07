const wishlistRepo = require('../repositories/wishlist.repository');
const productRepo = require('../repositories/product.repository');
const cartService = require('./cart.service');

exports.getWishlist = async (userId) => {
    let wishlist = await wishlistRepo.getWishlistByUserId(userId);
    if (!wishlist) {
        wishlist = await wishlistRepo.createWishlist(userId);
    }
    return wishlist;
};

exports.addToWishlist = async (userId, data) => {
    const { productId, selectedVariant } = data;

    // Verify product exists
    const product = await productRepo.getProductById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    // Validate variant if provided
    if (selectedVariant?.color && product.variants.length > 0) {
        const variantExists = product.variants.some(v => v.color === selectedVariant.color);
        if (!variantExists) {
            throw new Error('Selected variant not available');
        }
    }

    // Get or create wishlist
    let wishlist = await wishlistRepo.getWishlistByUserId(userId);
    if (!wishlist) {
        wishlist = await wishlistRepo.createWishlist(userId);
    }

    // Check if item already exists in wishlist
    const existingItemIndex = wishlist.items.findIndex(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!selectedVariant?.color) return productMatch;
        return productMatch && item.selectedVariant?.color === selectedVariant.color;
    });

    if (existingItemIndex > -1) {
        throw new Error('Item already exists in wishlist');
    }

    // Add new item to wishlist
    const newItem = {
        product: productId,
        selectedVariant: selectedVariant || {},
        addedAt: new Date(),
    };
    wishlist.items.push(newItem);

    return await wishlist.save();
};

exports.removeFromWishlist = async (userId, productId, variantColor) => {
    const wishlist = await wishlistRepo.getWishlistByUserId(userId);
    if (!wishlist) {
        throw new Error('Wishlist not found');
    }

    const itemIndex = wishlist.items.findIndex(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });

    if (itemIndex === -1) {
        throw new Error('Item not found in wishlist');
    }

    wishlist.items.splice(itemIndex, 1);
    return await wishlist.save();
};

exports.clearWishlist = async (userId) => {
    const wishlist = await wishlistRepo.getWishlistByUserId(userId);
    if (!wishlist) {
        throw new Error('Wishlist not found');
    }

    wishlist.items = [];
    return await wishlist.save();
};

exports.getWishlistItemCount = async (userId) => {
    const wishlist = await wishlistRepo.getWishlistByUserId(userId);
    return wishlist ? wishlist.totalItems : 0;
};

exports.isInWishlist = async (userId, productId, variantColor = null) => {
    const wishlist = await wishlistRepo.getWishlistByUserId(userId);
    if (!wishlist) return false;

    return wishlist.items.some(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });
};

exports.moveToCart = async (userId, productId, variantColor, quantity = 1) => {
    // First, get the wishlist item
    const wishlist = await wishlistRepo.getWishlistByUserId(userId);
    if (!wishlist) {
        throw new Error('Wishlist not found');
    }

    const itemIndex = wishlist.items.findIndex(item => {
        const productMatch = item.product._id.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });

    if (itemIndex === -1) {
        throw new Error('Item not found in wishlist');
    }

    const wishlistItem = wishlist.items[itemIndex];

    // Add to cart
    const cartData = {
        productId: productId,
        quantity: quantity,
        selectedVariant: wishlistItem.selectedVariant,
    };

    try {
        await cartService.addToCart(userId, cartData);

        // Remove from wishlist after successfully adding to cart
        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();

        return wishlist;
    } catch (error) {
        throw new Error(`Failed to move item to cart: ${error.message}`);
    }
};

exports.moveAllToCart = async (userId) => {
    const wishlist = await wishlistRepo.getWishlistByUserId(userId);
    if (!wishlist || wishlist.items.length === 0) {
        throw new Error('Wishlist is empty');
    }

    const errors = [];
    const successful = [];

    // Try to add each item to cart
    for (const item of wishlist.items) {
        try {
            const cartData = {
                productId: item.product._id.toString(),
                quantity: 1,
                selectedVariant: item.selectedVariant,
            };

            await cartService.addToCart(userId, cartData);
            successful.push(item.product._id.toString());
        } catch (error) {
            errors.push({
                productId: item.product._id.toString(),
                error: error.message
            });
        }
    }

    // Remove successfully moved items from wishlist
    if (successful.length > 0) {
        wishlist.items = wishlist.items.filter(item =>
            !successful.includes(item.product._id.toString())
        );
        await wishlist.save();
    }

    return {
        wishlist,
        successful: successful.length,
        errors: errors.length,
        errorDetails: errors
    };
};