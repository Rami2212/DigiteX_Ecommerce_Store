const Joi = require('joi');

const selectedVariantSchema = Joi.object({
    color: Joi.string().optional(),
    variantImage: Joi.string().optional(),
});

exports.addToWishlistDto = Joi.object({
    productId: Joi.string().required(),
    selectedVariant: selectedVariantSchema.optional(),
});

exports.removeFromWishlistDto = Joi.object({
    productId: Joi.string().required(),
    variantColor: Joi.string().optional(), // To identify specific variant
});

exports.moveToCartDto = Joi.object({
    productId: Joi.string().required(),
    variantColor: Joi.string().optional(),
    quantity: Joi.number().integer().min(1).default(1),
});