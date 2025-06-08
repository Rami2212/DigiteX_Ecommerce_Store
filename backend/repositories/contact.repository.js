const Contact = require('../models/contact.model');

exports.createContact = async (contactData) => {
    return await Contact.create(contactData);
};

exports.getContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

exports.getContacts = async (filters, options) => {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contacts = await Contact.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

    const total = await Contact.countDocuments(filters);

    return {
        contacts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalContacts: total,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        },
    };
};

exports.updateContact = async (contactId, updateData) => {
    return await Contact.findByIdAndUpdate(
        contactId,
        {
            ...updateData,
            ...(updateData.status === 'resolved' && { respondedAt: new Date() })
        },
        { new: true }
    );
};

exports.deleteContact = async (contactId) => {
    return await Contact.findByIdAndDelete(contactId);
};

exports.getContactsByEmail = async (email) => {
    return await Contact.find({ email }).sort({ createdAt: -1 });
};

exports.getContactStats = async () => {
    const stats = await Contact.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const priorityStats = await Contact.aggregate([
        {
            $group: {
                _id: '$priority',
                count: { $sum: 1 }
            }
        }
    ]);

    return { statusStats: stats, priorityStats };
};