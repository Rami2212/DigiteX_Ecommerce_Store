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

exports.createUserDTO = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
    profileImage: Joi.string().optional(),
    role: Joi.string().valid('user', 'admin').optional(),
});

exports.adminUpdateUserDTO = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    phone: Joi.string().optional(),
    role: Joi.string().valid('user', 'admin').optional(),
    profileImage: Joi.string().optional(),
});

exports.userUpdateUserDTO = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    username: Joi.string().optional(),
    phone: Joi.string().optional(),
    profileImage: Joi.string().optional(),
});