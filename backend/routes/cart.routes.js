const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All cart routes require authentication
router.use(authenticate);

// GET user's cart
router.get('/', cartController.getCart);

// GET cart item count
router.get('/count', cartController.getCartItemCount);

// POST add item to cart
router.post('/add', cartController.addToCart);

// PUT update cart item quantity
router.put('/update/:productId', cartController.updateCartItem);

// Check whether item in the cart
router.get('/check/:productId', cartController.checkItemInCart);

// DELETE remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// DELETE clear entire cart
router.delete('/clear', cartController.clearCart);

module.exports = router;
