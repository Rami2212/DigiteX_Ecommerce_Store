const contactRepo = require('../repositories/contact.repository');
const { sendContactConfirmationEmail, sendContactNotificationEmail, sendContactReplyEmail } = require('../utils/sendEmail');

exports.createContact = async (contactData, ipAddress) => {
    try {
        // Add IP address for tracking
        const contact = await contactRepo.createContact({
            ...contactData,
            ipAddress,
        });

        // Send confirmation email to user
        await sendContactConfirmationEmail(contact.email, contact.name, contact.subject);

        // Send notification email to admin (optional)
        await sendContactNotificationEmail(contact);

        return contact;
    } catch (error) {
        throw new Error(`Failed to create contact: ${error.message}`);
    }
};

exports.getContacts = async (filters, options) => {
    const queryFilters = {};

    if (filters.status) queryFilters.status = filters.status;
    if (filters.priority) queryFilters.priority = filters.priority;

    return await contactRepo.getContacts(queryFilters, options);
};

exports.getContactById = async (contactId) => {
    const contact = await contactRepo.getContactById(contactId);
    if (!contact) {
        throw new Error('Contact not found');
    }
    return contact;
};

exports.updateContactStatus = async (contactId, updateData) => {
    const contact = await contactRepo.getContactById(contactId);
    if (!contact) {
        throw new Error('Contact not found');
    }

    // Send reply email if reply data is provided
    if (updateData.replyMessage) {
        try {
            await sendContactReplyEmail(
                contact.email,
                contact.name,
                contact.subject,
                updateData.replyMessage
            );

            // Add reply to admin notes
            const replyNote = `\n--- Reply sent on ${new Date().toLocaleString()} ---\n${updateData.replyMessage}`;
            updateData.adminNotes = (updateData.adminNotes || contact.adminNotes || '') + replyNote;
            updateData.respondedAt = new Date();
        } catch (emailError) {
            console.error('Failed to send reply email:', emailError);
            throw new Error('Contact updated but failed to send reply email');
        }
    }

    return await contactRepo.updateContact(contactId, updateData);
};

exports.deleteContact = async (contactId) => {
    const contact = await contactRepo.getContactById(contactId);
    if (!contact) {
        throw new Error('Contact not found');
    }

    return await contactRepo.deleteContact(contactId);
};

exports.getContactsByEmail = async (email) => {
    return await contactRepo.getContactsByEmail(email);
};

exports.getContactStats = async () => {
    return await contactRepo.getContactStats();
};