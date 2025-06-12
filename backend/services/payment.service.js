const stripe = require('../config/stripe');
const orderRepo = require('../repositories/order.repository');
const cartService = require('./cart.service');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');
const productRepo = require("../repositories/product.repository");

// Create payment intent for an order
exports.createPaymentIntent = async (orderId, userId) => {
    try {
        const order = await orderRepo.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Verify order belongs to user
        if (order.user._id.toString() !== userId.toString()) {
            throw new Error('Unauthorized to create payment for this order');
        }

        if (order.paymentMethod !== 'stripe') {
            throw new Error('Payment intent can only be created for stripe orders');
        }

        // Check if payment intent already exists
        if (order.paymentIntentId) {
            const existingIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
            if (existingIntent.status === 'requires_payment_method' || existingIntent.status === 'requires_confirmation') {
                return {
                    clientSecret: existingIntent.client_secret,
                    paymentIntentId: existingIntent.id,
                    status: existingIntent.status
                };
            }
        }

        // Add this utility function
        const convertLKRToUSD = (amountInLKR) => {
            const exchangeRate = 0.0034; // 1 LKR = 0.0034 USD (update this regularly)
            return amountInLKR * exchangeRate;
        };

        // Create new payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(convertLKRToUSD(order.totalAmount) * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: order._id.toString(),
                userId: userId.toString()
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Update order with payment intent ID
        await orderRepo.updateOrderById(orderId, {
            paymentIntentId: paymentIntent.id
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            status: paymentIntent.status
        };
    } catch (error) {
        throw new Error(`Payment intent creation failed: ${error.message}`);
    }
};

// Update payment status
exports.updatePaymentStatus = async (orderId, paymentStatus, paymentIntentId = null, userId = null) => {
    try {
        const order = await orderRepo.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Verify order belongs to user if userId provided
        if (userId && order.user._id.toString() !== userId.toString()) {
            throw new Error('Unauthorized to update payment for this order');
        }

        const updateData = { paymentStatus };

        if (paymentIntentId) {
            updateData.paymentIntentId = paymentIntentId;
        }

        // Update order status based on payment status
        switch (paymentStatus.toLowerCase()) {
            case 'paid':
            case 'succeeded':
                updateData.status = 'Confirmed';
                updateData.paymentStatus = 'Paid';
                updateData.paidAt = new Date();

                const fullOrder = await orderRepo.getOrderById(orderId);
                await sendOrderConfirmationEmail(fullOrder.user.email, fullOrder);

                break;
            case 'failed':
            case 'canceled':
                updateData.status = 'Cancelled';
                updateData.paymentStatus = 'Failed';
                break;
            case 'processing':
                updateData.paymentStatus = 'Processing';
                break;
            default:
                updateData.paymentStatus = paymentStatus;
        }

        const updatedOrder = await orderRepo.updateOrderById(orderId, updateData);

        // Clear cart if payment is successful
        if (paymentStatus.toLowerCase() === 'paid' || paymentStatus.toLowerCase() === 'succeeded') {
            try {
                await cartService.clearCart(order.user);
            } catch (error) {
                console.log('Cart already cleared or error clearing cart:', error.message);
            }
        }

        return updatedOrder;
    } catch (error) {
        throw new Error(`Payment status update failed: ${error.message}`);
    }
};

// Confirm payment
exports.confirmPayment = async (paymentIntentId, userId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
            throw new Error('Payment intent not found');
        }

        const orderId = paymentIntent.metadata.orderId;

        // Verify user authorization
        if (paymentIntent.metadata.userId !== userId.toString()) {
            throw new Error('Unauthorized to confirm this payment');
        }

        // Update order based on payment intent status
        const paymentStatus = await exports.updatePaymentStatus(orderId, paymentIntent.status, paymentIntentId);

        // Stock management
        if (paymentIntent.status === 'succeeded') {
            // Get order details to access ordered items
            const order = await orderRepo.getOrderById(orderId);

            if (!order) {
                throw new Error('Order not found for stock management');
            }

            // Update stock for each product in the order
            for (const item of order.items) {
                const product = await productRepo.getProductById(item.productId);

                if (!product) {
                    console.error(`Product not found: ${item.productId}`);
                    continue;
                }

                // Check if sufficient stock is available
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
                }

                // Deduct stock
                product.stock -= item.quantity;
                await product.save();

                console.log(`Stock updated for ${product.name}: ${item.quantity} units deducted. Remaining stock: ${product.stock}`);
            }

            // Optional: Log stock management completion
            console.log(`Stock management completed for order: ${orderId}`);
        }

        return {
            paymentIntent,
            orderId,
            status: paymentIntent.status
        };
    } catch (error) {
        throw new Error(`Payment confirmation failed: ${error.message}`);
    }
};

// Cancel payment
exports.cancelPayment = async (orderId, userId) => {
    try {
        const order = await orderRepo.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Verify order belongs to user
        if (order.user._id.toString() !== userId.toString()) {
            throw new Error('Unauthorized to cancel payment for this order');
        }

        if (order.paymentIntentId) {
            const paymentIntent = await stripe.paymentIntents.cancel(order.paymentIntentId);

            // Update order status
            await exports.updatePaymentStatus(orderId, 'cancelled', order.paymentIntentId);

            return {
                paymentIntentId: order.paymentIntentId,
                status: paymentIntent.status
            };
        }

        throw new Error('No payment intent found for this order');
    } catch (error) {
        throw new Error(`Payment cancellation failed: ${error.message}`);
    }
};

// Get payment details
exports.getPaymentDetails = async (paymentIntentId, userId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Verify user authorization
        if (paymentIntent.metadata.userId !== userId.toString()) {
            throw new Error('Unauthorized to view this payment');
        }

        return {
            id: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            created: paymentIntent.created,
            orderId: paymentIntent.metadata.orderId
        };
    } catch (error) {
        throw new Error(`Failed to get payment details: ${error.message}`);
    }
};

// Handle webhook events
exports.handleWebhookEvent = async (event) => {
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            case 'payment_intent.canceled':
                await handlePaymentCanceled(event.data.object);
                break;

            case 'payment_intent.requires_action':
                await handlePaymentRequiresAction(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        throw new Error(`Webhook handling failed: ${error.message}`);
    }
};

// Private helper functions
const handlePaymentSucceeded = async (paymentIntent) => {
    const orderId = paymentIntent.metadata.orderId;
    if (orderId) {
        await exports.updatePaymentStatus(orderId, 'succeeded', paymentIntent.id);
        console.log(`Payment succeeded for order: ${orderId}`);
    }
};

const handlePaymentFailed = async (paymentIntent) => {
    const orderId = paymentIntent.metadata.orderId;
    if (orderId) {
        await exports.updatePaymentStatus(orderId, 'failed', paymentIntent.id);
        console.log(`Payment failed for order: ${orderId}`);
    }
};

const handlePaymentCanceled = async (paymentIntent) => {
    const orderId = paymentIntent.metadata.orderId;
    if (orderId) {
        await exports.updatePaymentStatus(orderId, 'canceled', paymentIntent.id);
        console.log(`Payment canceled for order: ${orderId}`);
    }
};

const handlePaymentRequiresAction = async (paymentIntent) => {
    const orderId = paymentIntent.metadata.orderId;
    if (orderId) {
        await exports.updatePaymentStatus(orderId, 'requires_action', paymentIntent.id);
        console.log(`Payment requires action for order: ${orderId}`);
    }
};