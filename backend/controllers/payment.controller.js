const paymentService = require('../services/payment.service');
const stripe = require('../config/stripe');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user._id;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                error: 'Order ID is required'
            });
        }

        const result = await paymentService.createPaymentIntent(orderId, userId);

        res.json({
            success: true,
            message: 'Payment intent created successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus, paymentIntentId } = req.body;
        const userId = req.user._id;

        if (!orderId || !paymentStatus) {
            return res.status(400).json({
                success: false,
                error: 'Order ID and payment status are required'
            });
        }

        const order = await paymentService.updatePaymentStatus(
            orderId,
            paymentStatus,
            paymentIntentId,
            userId
        );

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            data: { order }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const userId = req.user._id;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                error: 'Payment intent ID is required'
            });
        }

        const result = await paymentService.confirmPayment(paymentIntentId, userId);

        res.json({
            success: true,
            message: 'Payment confirmed successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Cancel payment
exports.cancelPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user._id;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                error: 'Order ID is required'
            });
        }

        const result = await paymentService.cancelPayment(orderId, userId);

        res.json({
            success: true,
            message: 'Payment cancelled successfully',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;
        const userId = req.user._id;

        const paymentDetails = await paymentService.getPaymentDetails(paymentIntentId, userId);

        res.json({
            success: true,
            data: paymentDetails
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Stripe webhook handler
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        await paymentService.handleWebhookEvent(event);

        res.json({
            success: true,
            received: true
        });
    } catch (error) {
        console.error('Webhook handling error:', error);
        res.status(500).json({
            success: false,
            error: 'Webhook handler failed'
        });
    }
};