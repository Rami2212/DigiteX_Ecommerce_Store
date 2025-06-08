const contactService = require('../services/contact.service');
const { createContactDto, updateContactStatusDto, getContactsDto } = require('../dtos/contact.dto');

exports.createContact = async (req, res) => {
    try {
        const { error } = createContactDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const ipAddress = req.ip || req.connection.remoteAddress;
        const contact = await contactService.createContact(req.body, ipAddress);

        return res.status(201).json({
            message: 'Contact form submitted successfully. We will get back to you soon!',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                status: contact.status,
                createdAt: contact.createdAt,
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const { error } = getContactsDto.validate(req.query);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { status, priority, page, limit, sortBy, sortOrder } = req.query;
        const filters = { status, priority };
        const options = { page, limit, sortBy, sortOrder };

        const result = await contactService.getContacts(filters, options);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getContactById = async (req, res) => {
    try {
        const { contactId } = req.params;
        const contact = await contactService.getContactById(contactId);
        return res.status(200).json(contact);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.updateContactStatus = async (req, res) => {
    try {
        const { error } = updateContactStatusDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { contactId } = req.params;
        const contact = await contactService.updateContactStatus(contactId, req.body);

        return res.status(200).json({
            message: 'Contact status updated successfully',
            contact
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        await contactService.deleteContact(contactId);

        return res.status(200).json({
            message: 'Contact deleted successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getContactsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const contacts = await contactService.getContactsByEmail(email);
        return res.status(200).json(contacts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getContactStats = async (req, res) => {
    try {
        const stats = await contactService.getContactStats();
        return res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};