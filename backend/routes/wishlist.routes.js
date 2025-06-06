const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All wishlist routes require authentication
router.use(authenticate);

// GET user's wishlist
router.get('/', wishlistController.getWishlist);

// GET wishlist item count
router.get('/count', wishlistController.getWishlistItemCount);

// GET check if item is in wishlist
router.get('/check/:productId', wishlistController.checkWishlistItem);

// POST add item to wishlist
router.post('/add', wishlistController.addToWishlist);

// POST move item to cart
router.post('/move-to-cart', wishlistController.moveToCart);

// POST move all items to cart
router.post('/move-all-to-cart', wishlistController.moveAllToCart);

// DELETE remove item from wishlist
router.delete('/remove/:productId', wishlistController.removeFromWishlist);

// DELETE clear entire wishlist
router.delete('/clear', wishlistController.clearWishlist);

module.exports = router;