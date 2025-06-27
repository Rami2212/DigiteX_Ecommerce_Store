const Joi = require('joi');

const variantSchema = Joi.object({
    color: Joi.string().required(),
    variantImage: Joi.string().required(),
});

exports.addProductDto = Joi.object({
    name: Joi.string().required(),
    shortDescription: Joi.string().max(200).required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    salePrice: Joi.number().optional(),
    productImage: Joi.string(),
    productImages: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).default([]).custom((value, helpers) => {
        if (typeof value === 'string') {
            return [value];
        }
        return value;
    }),
    variants: Joi.alternatives().try(
        Joi.array().items(variantSchema),
        Joi.string(), // Allow JSON string
        Joi.object().pattern(Joi.string(), Joi.any()) // Allow parsed object
    ).default([]),
    category: Joi.string().required(),
    addons: Joi.array().items(Joi.string()).optional(),
    stock: Joi.number().default(0),
});

exports.updateProductDto = Joi.object({
    name: Joi.string().optional(),
    shortDescription: Joi.string().max(200).optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    salePrice: Joi.number().optional(),
    productImage: Joi.string().optional(),
    productImages: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional().custom((value, helpers) => {
        if (typeof value === 'string') {
            return [value];
        }
        return value;
    }),
    variants: Joi.alternatives().try(
        Joi.array().items(variantSchema),
        Joi.string(),
        Joi.object().pattern(Joi.string(), Joi.any())
    ).optional(),
    category: Joi.string().optional(),
    addons: Joi.array().items(Joi.string()).optional(),
    stock: Joi.number().optional(),
});
