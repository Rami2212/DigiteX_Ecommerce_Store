const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: String,
        selectedVariant: {
            color: { type: String },
            variantImage: { type: String },
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema],
        shippingAddress: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: String,
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'Card', 'stripe', 'BankTransfer'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending',
        },
        paymentIntentId: String,
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: Date,
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Failed'],
            default: 'Processing',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', orderSchema);