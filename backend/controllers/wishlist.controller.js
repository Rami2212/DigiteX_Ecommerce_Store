const wishlistService = require('../services/wishlist.service');
const { addToWishlistDto, removeFromWishlistDto, moveToCartDto } = require('../dtos/wishlist.dto');

exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.getWishlist(req.user.id);
        return res.status(200).json(wishlist);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { error } = addToWishlistDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const wishlist = await wishlistService.addToWishlist(req.user.id, req.body);
        return res.status(200).json({
            message: 'Item added to wishlist successfully',
            wishlist
        });
    } catch (err) {
        console.error(err);
        if (err.message === 'Item already exists in wishlist') {
            return res.status(409).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantColor } = req.query;

        const wishlist = await wishlistService.removeFromWishlist(req.user.id, productId, variantColor);
        return res.status(200).json({
            message: 'Item removed from wishlist successfully',
            wishlist
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.clearWishlist = async (req, res) => {
    try {
        const wishlist = await wishlistService.clearWishlist(req.user.id);
        return res.status(200).json({
            message: 'Wishlist cleared successfully',
            wishlist
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getWishlistItemCount = async (req, res) => {
    try {
        const count = await wishlistService.getWishlistItemCount(req.user.id);
        return res.status(200).json({ itemCount: count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.checkWishlistItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variantColor } = req.query;

        const isInWishlist = await wishlistService.isInWishlist(req.user.id, productId, variantColor);
        return res.status(200).json({ isInWishlist });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.moveToCart = async (req, res) => {
    try {
        const { error } = moveToCartDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { productId, variantColor, quantity } = req.body;
        const wishlist = await wishlistService.moveToCart(req.user.id, productId, variantColor, quantity);

        return res.status(200).json({
            message: 'Item moved to cart successfully',
            wishlist
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.moveAllToCart = async (req, res) => {
    try {
        const result = await wishlistService.moveAllToCart(req.user.id);

        let message = `${result.successful} items moved to cart successfully`;
        if (result.errors > 0) {
            message += `, ${result.errors} items failed to move`;
        }

        return res.status(200).json({
            message,
            ...result
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};