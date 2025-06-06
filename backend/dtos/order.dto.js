const Joi = require('joi');

const shippingAddressSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional().allow(''),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required(),
});

const orderItemSchema = Joi.object({
    productId: Joi.string().required(),
    name: Joi.string().optional(),
    selectedVariant: Joi.object({
        color: Joi.string().optional(),
        variantImage: Joi.string().optional(),
    }).optional(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required(),
});

exports.createOrderDto = Joi.object({
    items: Joi.array().items(orderItemSchema).min(1).required(),
    shippingAddress: shippingAddressSchema.required(),
    paymentMethod: Joi.string().valid('COD', 'Card', 'BankTransfer').required(),
    totalAmount: Joi.number().min(0).required(),
});

exports.updateOrderStatusDto = Joi.object({
    status: Joi.string().valid('Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled').required(),
});

exports.updatePaymentStatusDto = Joi.object({
    paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed').required(),
});

exports.updateDeliveryStatusDto = Joi.object({
    isDelivered: Joi.boolean().required(),
});