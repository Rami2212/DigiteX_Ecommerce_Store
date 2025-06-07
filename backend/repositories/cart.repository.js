const Cart = require('../models/cart.model');

exports.getCartByUserId = async (userId) => {
    return await Cart.findOne({ user: userId }).populate('items.product');
};

exports.createCart = async (userId) => {
    return await Cart.create({ user: userId, items: [] });
};

exports.updateCart = async (userId, cartData) => {
    return await Cart.findOneAndUpdate(
        { user: userId },
        cartData,
        { new: true, upsert: true }
    ).populate('items.product');
};

exports.deleteCart = async (userId) => {
    return await Cart.findOneAndDelete({ user: userId });
};

exports.findCartItem = async (userId, productId, variantColor = null) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return null;

    return cart.items.find(item => {
        const productMatch = item.product.toString() === productId;
        if (!variantColor) return productMatch;
        return productMatch && item.selectedVariant?.color === variantColor;
    });
};