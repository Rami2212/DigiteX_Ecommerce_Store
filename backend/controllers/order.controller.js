const orderService = require('../services/order.service');
const {
    createOrderDto,
    updateOrderStatusDto,
    updatePaymentStatusDto,
    updateDeliveryStatusDto,
} = require('../dtos/order.dto');

exports.createOrder = async (req, res) => {
    try {
        const { error } = createOrderDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const order = await orderService.createOrder(req.user.id, req.body);
        return res.status(201).json({
            message: 'Order created successfully',
            order,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.createOrderFromCart = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ error: 'Shipping address and payment method are required' });
        }

        const order = await orderService.createOrderFromCart(req.user.id, shippingAddress, paymentMethod);
        return res.status(201).json({
            message: 'Order created from cart successfully',
            order,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const result = await orderService.getAllOrders(parseInt(page), parseInt(limit), status);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        return res.status(200).json(order);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await orderService.getUserOrders(req.user.id, parseInt(page), parseInt(limit));
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { error } = updateOrderStatusDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
        return res.status(200).json({
            message: 'Order status updated successfully',
            order,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { error } = updatePaymentStatusDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const order = await orderService.updatePaymentStatus(req.params.id, req.body.paymentStatus);
        return res.status(200).json({
            message: 'Payment status updated successfully',
            order,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { error } = updateDeliveryStatusDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const order = await orderService.updateDeliveryStatus(req.params.id, req.body.isDelivered);
        return res.status(200).json({
            message: 'Delivery status updated successfully',
            order,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.params.id, req.user.id);
        return res.status(200).json({
            message: 'Order cancelled successfully',
            order,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.adminCancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.params.id);
        return res.status(200).json({
            message: 'Order cancelled successfully',
            order,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        await orderService.deleteOrder(req.params.id);
        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getOrderStats = async (req, res) => {
    try {
        const stats = await orderService.getOrderStats();
        return res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};