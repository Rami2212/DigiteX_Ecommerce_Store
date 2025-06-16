const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// POST create order from custom items
router.post('/', authenticate, orderController.createOrder);

// POST create order from cart
router.post('/from-cart', authenticate, orderController.createOrderFromCart);

// GET user's orders
router.get('/my-orders', authenticate, orderController.getUserOrders);

// GET specific order by ID (user can only access their own orders)
router.get('/:id', authenticate, orderController.getOrderById);

// PUT cancel user's order
router.put('/:id/cancel', authenticate, orderController.cancelOrder);

// GET all orders (admin only)
router.get('/', authenticate, isAdmin, orderController.getAllOrders);

// GET order statistics (admin only)
router.get('/admin/stats', authenticate, isAdmin, orderController.getOrderStats);

// PUT update order status (admin only)
router.put('/:id/status', authenticate, isAdmin, orderController.updateOrderStatus);

// PUT update payment status (admin only)
router.put('/:id/payment', authenticate, isAdmin, orderController.updatePaymentStatus);

// PUT update delivery status (admin only)
router.put('/:id/delivery', authenticate, isAdmin, orderController.updateDeliveryStatus);

// PUT cancel any order (admin only)
router.put('/:id/admin-cancel', authenticate, isAdmin, orderController.adminCancelOrder);

// DELETE order (admin only)
router.delete('/:id', authenticate, isAdmin, orderController.deleteOrder);

module.exports = router;