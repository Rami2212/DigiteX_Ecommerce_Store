const cartService = require('../services/cart.service');
const { addToCartDto, updateCartItemDto, removeFromCartDto } = require('../dtos/cart.dto');

exports.getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        return res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { error } = addToCartDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const cart = await cartService.addToCart(req.user.id, req.body);
        return res.status(200).json({
            message: 'Item added to cart successfully',
            cart
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { error } = updateCartItemDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { productId } = req.params;
        const { quantity } = req.body;
        const { variantColor } = req.query;

        const cart = await cartService.updateCartItem(
            req.user.id,
            productId,
            variantColor,
            quantity
        );

        return res.status(200).json({
            message: 'Cart item updated successfully',
            cart
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantColor } = req.query;

        const cart = await cartService.removeFromCart(req.user.id, productId, variantColor);
        return res.status(200).json({
            message: 'Item removed from cart successfully',
            cart
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.user.id);
        return res.status(200).json({
            message: 'Cart cleared successfully',
            cart
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getCartItemCount = async (req, res) => {
    try {
        const count = await cartService.getCartItemCount(req.user.id);
        return res.status(200).json({ itemCount: count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.checkItemInCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantColor } = req.query;

        const isInCart = await cartService.isItemInCart(req.user.id, productId, variantColor);
        return res.status(200).json({ isInCart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};
