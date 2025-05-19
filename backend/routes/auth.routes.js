const express = require('express');
const router = express.Router();
const passport = require('passport')
const authController = require('../controllers/auth.controller');

// Register user
router.post('/register', authController.registerUser);

// Email verification
router.post('/verify-otp', authController.verifyOtp);

// Login (with email or username)
router.post('/login', authController.loginUser);

// Admin Login
router.post('/admin/login', authController.loginAdmin);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password/:token', authController.resetPassword);

// Send otp
router.post('/send-otp', authController.resendOtp);

// Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'auth/login' }),
    authController.handleSocialLogin
);

module.exports = router;