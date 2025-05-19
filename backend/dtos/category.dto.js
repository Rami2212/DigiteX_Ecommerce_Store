const Joi = require('joi');

exports.addCategoryDto = Joi.object({
    name: Joi.string().required(),
    subCategories: Joi.array().items(Joi.string()).default([]),
    categoryImage: Joi.string(),
});

exports.updateCategoryDto = Joi.object({
    name: Joi.string().optional(),
    subCategories: Joi.array().items(Joi.string()).optional(),
    categoryImage: Joi.string().optional(),
});
