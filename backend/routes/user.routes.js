const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

// Get all users (Admin only)
router.get('/', authenticate, isAdmin, userController.getAllUsers);

// Get a single user by ID (Admin only)
router.get('/:id', authenticate, isAdmin, userController.getUserById);

// Create a new user (Admin only)
router.post(
    '/',
    authenticate,
    isAdmin,
    upload.single('profileImage'),
    userController.createUser
);

// Update a user by Admin
router.put(
    '/updatebyadmin/:id',
    authenticate,
    isAdmin,
    upload.single('profileImage'),
    userController.updateUserByAdmin
);

// Update logged-in user's own profile
router.put(
    '/updatebyuser',
    authenticate,
    upload.single('profileImage'),
    userController.updateUserByUser
);

// Delete a user (Admin only)
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

// Delete own user account
router.delete('/deleteownuser/:id', authenticate, userController.deleteOwnUser);

// Change email for logged-in user
router.put(
    '/change-email',
    authenticate,
    userController.changeEmail
);

module.exports = router;
