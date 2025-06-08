const Joi = require('joi');

exports.createContactDto = Joi.object({
    name: Joi.string().trim().max(100).required(),
    email: Joi.string().email().trim().lowercase().required(),
    phone: Joi.string().trim().pattern(/^[0-9+\-\s()]{10,15}$/).optional(),
    subject: Joi.string().trim().max(200).required(),
    message: Joi.string().trim().max(1000).required(),
});

exports.updateContactStatusDto = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'resolved', 'closed').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    adminNotes: Joi.string().trim().max(500).optional(),
    replyMessage: Joi.string().trim().max(500).optional(),
});

exports.getContactsDto = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'resolved', 'closed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'priority', 'status').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});