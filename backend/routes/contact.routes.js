const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// Public route - anyone can submit contact form
router.post('/', contactController.createContact);

// Admin routes - require authentication and admin privileges
router.get('/', authenticate, isAdmin, contactController.getContacts);
router.get('/stats', authenticate, isAdmin, contactController.getContactStats);
router.get('/:contactId', authenticate, isAdmin, contactController.getContactById);
router.put('/:contactId', authenticate, isAdmin, contactController.updateContactStatus);
router.delete('/:contactId', authenticate, isAdmin, contactController.deleteContact);

// Get contacts by email (could be used for user to see their own submissions)
router.get('/email/:email', authenticate, contactController.getContactsByEmail);

module.exports = router;