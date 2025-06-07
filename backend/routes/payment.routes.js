const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Payment intent routes (protected)
router.post('/create-intent', authenticate, paymentController.createPaymentIntent);
router.post('/confirm', authenticate, paymentController.confirmPayment);
router.post('/cancel', authenticate, paymentController.cancelPayment);
router.post('/update-status', authenticate, paymentController.updatePaymentStatus);

// Payment details (protected)
router.get('/details/:paymentIntentId', authenticate, paymentController.getPaymentDetails);

// Webhook route (no auth needed)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;