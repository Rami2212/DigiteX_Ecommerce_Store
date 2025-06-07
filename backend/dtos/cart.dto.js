const Joi = require('joi');

const selectedVariantSchema = Joi.object({
    color: Joi.string().optional(),
    variantImage: Joi.string().optional(),
});

exports.addToCartDto = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).default(1),
    selectedVariant: selectedVariantSchema.optional(),
});

exports.updateCartItemDto = Joi.object({
    quantity: Joi.number().integer().min(1).required(),
});

exports.removeFromCartDto = Joi.object({
    productId: Joi.string().required(),
    variantColor: Joi.string().optional(), // To identify specific variant
});