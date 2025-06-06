const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// User routes (require authentication)
router.use(authenticate);

// POST create order from custom items
router.post('/', orderController.createOrder);

// POST create order from cart
router.post('/from-cart', orderController.createOrderFromCart);

// GET user's orders
router.get('/my-orders', orderController.getUserOrders);

// GET specific order by ID (user can only access their own orders)
router.get('/:id', orderController.getOrderById);

// PUT cancel user's order
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes (require admin role)
router.use(isAdmin);

// GET all orders (admin only)
router.get('/', orderController.getAllOrders);

// GET order statistics (admin only)
router.get('/admin/stats', orderController.getOrderStats);

// PUT update order status (admin only)
router.put('/:id/status', orderController.updateOrderStatus);

// PUT update payment status (admin only)
router.put('/:id/payment', orderController.updatePaymentStatus);

// PUT update delivery status (admin only)
router.put('/:id/delivery', orderController.updateDeliveryStatus);

// PUT cancel any order (admin only)
router.put('/:id/admin-cancel', orderController.adminCancelOrder);

// DELETE order (admin only)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;