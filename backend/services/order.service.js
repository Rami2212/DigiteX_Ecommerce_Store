const orderRepo = require('../repositories/order.repository');
const cartService = require('./cart.service');
const productRepo = require('../repositories/product.repository');
const userRepo = require('../repositories/user.repository');
const paymentService = require('./payment.service');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');

exports.createOrder = async (userId, orderData) => {
    const { items, shippingAddress, paymentMethod, totalAmount, shippingMethod } = orderData;

    // Validate items and calculate total
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
        const product = await productRepo.getProductById(item.productId);
        if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
        }

        // Validate variant if provided
        if (item.selectedVariant?.color && product.variants.length > 0) {
            const variantExists = product.variants.some(v => v.color === item.selectedVariant.color);
            if (!variantExists) {
                throw new Error(`Selected variant not available for product ${product.name}`);
            }
        }

        // Use current product price (salePrice if available, otherwise regular price)
        const currentPrice = product.salePrice || product.price;
        const itemTotal = currentPrice * item.quantity;
        calculatedTotal += itemTotal;

        validatedItems.push({
            productId: item.productId,
            name: product.name,
            selectedVariant: item.selectedVariant || {},
            quantity: item.quantity,
            price: currentPrice,
        });
    }

    // Verify total amount matches calculated total
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        throw new Error('Total amount does not match calculated total');
    }

    // Create order
    const order = await orderRepo.createOrder({
        user: userId,
        items: validatedItems,
        shippingAddress,
        paymentMethod,
        shippingMethod: shippingMethod || 'standard',
        totalAmount: calculatedTotal,
        paymentStatus: 'Pending',
        status: paymentMethod === 'stripe' ? 'Pending' : 'Processing',
    });

    // Handle payment for stripe orders
    if (paymentMethod === 'stripe') {
        try {
            const paymentResult = await paymentService.createPaymentIntent(order._id, userId);
            return {
                order,
                ...paymentResult
            };
        } catch (error) {
            // If payment intent creation fails, mark order as failed
            await orderRepo.updateOrderById(order._id, {
                status: 'Failed',
                paymentStatus: 'Failed'
            });
            throw error;
        }
    }

    return { order };
};

exports.createOrderFromCart = async (userId, shippingAddress, paymentMethod) => {

    // Get user's cart
    const cart = await cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
    }

    // Convert cart items to order items
    const orderItems = cart.items.map(cartItem => ({
        productId: cartItem.product._id,
        name: cartItem.product.name,
        selectedVariant: cartItem.selectedVariant,
        quantity: cartItem.quantity,
        price: cartItem.price,
    }));

    // Create order
    const order = await orderRepo.createOrder({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        totalAmount: cart.totalAmount,
        paymentStatus: 'Pending',
        status: paymentMethod === 'stripe' ? 'Pending' : 'Processing',
    });

    // Handle payment for stripe orders
    if (paymentMethod === 'stripe') {
        try {
            const paymentResult = await paymentService.createPaymentIntent(order._id, userId);
            return {
                order,
                ...paymentResult
            };
        } catch (error) {
            // If payment intent creation fails, mark order as failed
            await orderRepo.updateOrderById(order._id, {
                status: 'Failed',
                paymentStatus: 'Failed'
            });
            throw error;
        }
    }

    // send order confirmation email - only for non-stripe payments
    if (paymentMethod === 'COD') {
        const user = await userRepo.findById(userId);
        await sendOrderConfirmationEmail(user.email, order);

        // Stock management for COD orders
        try {
            for (const item of orderItems) {
                const product = await productRepo.getProductById(item.productId);

                if (!product) {
                    console.error(`Product not found: ${item.productId}`);
                    continue;
                }

                // Check if sufficient stock is available
                if (product.stock < item.quantity) {
                    // Mark order as failed due to insufficient stock
                    await orderRepo.updateOrderById(order._id, {
                        status: 'Failed',
                        paymentStatus: 'Failed'
                    });
                    throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
                }

                // Deduct stock
                product.stock -= item.quantity;
                await product.save();

                console.log(`Stock updated for ${product.name}: ${item.quantity} units deducted. Remaining stock: ${product.stock}`);
            }

            console.log(`Stock management completed for COD order: ${order._id}`);
        } catch (error) {
            // If stock management fails, mark order as failed
            await orderRepo.updateOrderById(order._id, {
                status: 'Failed',
                paymentStatus: 'Failed'
            });
            throw new Error(`Stock management failed: ${error.message}`);
        }
    }

    // Clear cart for non-stripe payments immediately
    await cartService.clearCart(userId);

    return { order };
};

exports.cancelOrder = async (orderId, userId = null) => {
    const order = await orderRepo.getOrderById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    // If userId is provided, verify order belongs to user
    if (userId && order.user._id.toString() !== userId) {
        throw new Error('Unauthorized to cancel this order');
    }

    // Check if order can be cancelled
    if (['Shipped', 'Delivered'].includes(order.status)) {
        throw new Error('Cannot cancel order that has been shipped or delivered');
    }

    // Cancel payment if it's a stripe order
    if (order.paymentMethod === 'stripe' && order.paymentIntentId) {
        try {
            await paymentService.cancelPayment(orderId, order.user._id);
        } catch (error) {
            console.log('Error cancelling payment:', error.message);
        }
    }

    return await orderRepo.updateOrderById(orderId, { status: 'Cancelled' });
};

// Keep all your existing methods...
exports.getAllOrders = async (page = 1, limit = 10, status = null) => {
    return await orderRepo.getAllOrders(page, limit, status);
};

exports.getOrderById = async (orderId) => {
    const order = await orderRepo.getOrderById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

exports.getUserOrders = async (userId, page = 1, limit = 10) => {
    return await orderRepo.getOrdersByUserId(userId, page, limit);
};

exports.updateOrderStatus = async (orderId, status) => {
    const updateData = { status };

    // Auto-update delivery status when status is 'Delivered'
    if (status === 'Delivered') {
        updateData.isDelivered = true;
        updateData.deliveredAt = new Date();
    }

    const order = await orderRepo.updateOrderById(orderId, updateData);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

exports.updatePaymentStatus = async (orderId, paymentStatus) => {
    const order = await orderRepo.updateOrderById(orderId, { paymentStatus });
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

exports.updateDeliveryStatus = async (orderId, isDelivered) => {
    const updateData = { isDelivered };
    if (isDelivered) {
        updateData.deliveredAt = new Date();
        updateData.status = 'Delivered';
    }

    const order = await orderRepo.updateOrderById(orderId, updateData);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

exports.deleteOrder = async (orderId) => {
    const order = await orderRepo.deleteOrderById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

exports.getOrderStats = async () => {
    return await orderRepo.getOrderStats();
};