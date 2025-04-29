const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Register user
router.post('/register', userController.registerUser);

// Email verification
router.get('/verify-email', userController.verifyEmail);

// Login (with email or username)
router.post('/login', userController.loginUser);

module.exports = router;
