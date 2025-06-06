const Order = require('../models/order.model');

exports.createOrder = async (orderData) => {
    return await Order.create(orderData);
};

exports.getAllOrders = async (page = 1, limit = 10, status = null) => {
    const skip = (page - 1) * limit;
    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
        .populate('user', 'name email')
        .populate('items.productId', 'name productImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments(filter);

    return {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalOrders: total,
    };
};

exports.getOrderById = async (orderId) => {
    return await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('items.productId', 'name productImage price salePrice');
};

exports.getOrdersByUserId = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
        .populate('items.productId', 'name productImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Order.countDocuments({ user: userId });

    return {
        orders,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalOrders: total,
    };
};

exports.updateOrderById = async (orderId, updateData) => {
    return await Order.findByIdAndUpdate(orderId, updateData, { new: true })
        .populate('user', 'name email')
        .populate('items.productId', 'name productImage');
};

exports.deleteOrderById = async (orderId) => {
    return await Order.findByIdAndDelete(orderId);
};

exports.getOrderStats = async () => {
    const stats = await Order.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalAmount: { $sum: '$totalAmount' },
            },
        },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    return {
        statusBreakdown: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
    };
};
