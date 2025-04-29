// dto/user.dto.js
const Joi = require('joi');

exports.registerUserDto = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
});

exports.loginUserDto = Joi.object({
    identifier: Joi.string().required(), // can be email or username
    password: Joi.string().required(),
});
