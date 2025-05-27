const Joi = require('joi');

exports.addCategoryDto = Joi.object({
    name: Joi.string().required(),
    subCategories: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).default([]).custom((value, helpers) => {
        if (typeof value === 'string') {
            return [value];
        }
        return value;
    }),
    categoryImage: Joi.string(),
});


exports.updateCategoryDto = Joi.object({
    name: Joi.string().optional(),
    subCategories: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).optional().custom((value, helpers) => {
        if (typeof value === 'string') {
            return [value];
        }
        return value;
    }),
    categoryImage: Joi.string().optional(),
});
