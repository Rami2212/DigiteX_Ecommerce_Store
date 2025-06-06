const Wishlist = require('../models/wishlist.model');

exports.getWishlistByUserId = async (userId) => {
    return await Wishlist.findOne({ user: userId }).populate('items.product');
};

exports.createWishlist = async (userId) => {
    return await Wishlist.create({ user: userId, items: [] });
};

exports.updateWishlist = async (userId, wishlistData) => {
    return await Wishlist.findOneAndUpdate(
        { user: userId },
        wishlistData,
        { new: true, upsert: true }
    ).populate('items.product');
};

exports.deleteWishlist = async (userId) => {
    return await Wishlist.findOneAndDelete({ user: userId });
};

exports.findWishlistItem = async (userId, productId, variantColor = null) => {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return null;

    return wishlist.items.find(item => {
        const productMatch = item.product.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });
};