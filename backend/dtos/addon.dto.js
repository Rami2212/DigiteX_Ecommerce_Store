const Joi = require('joi');

exports.addAddonDto = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
    icon: Joi.string().required(),
});

exports.updateAddonDto = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.string().optional(),
    icon: Joi.string().optional(),
});
