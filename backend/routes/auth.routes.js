const express = require('express');
const router = express.Router();
const passport = require('passport')
const userController = require('../controllers/auth.controller');

// Register user
router.post('/register', userController.registerUser);

// Email verification
router.post('/verify-otp', userController.verifyOtp);

// Login (with email or username)
router.post('/login', userController.loginUser);

// Forgot password
router.post('/forgot-password', userController.forgotPassword);

// Reset password
router.post('/reset-password/:token', userController.resetPassword);

// Send otp
router.post('/send-otp', userController.resendOtp);

// Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'auth/login' }),
    userController.handleSocialLogin
);

module.exports = router;