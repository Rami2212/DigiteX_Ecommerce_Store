// controllers/auth.controller.js
const authService = require('../services/auth.service');
const { registerUserDto, loginUserDto } = require('../dtos/user.dto');

exports.registerUser = async (req, res) => {
    try {
        const { error } = registerUserDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const result = await authService.registerUser(req.body);
        return res.status(200).json({ message: 'Registered successfully!', ...result });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { error } = loginUserDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { identifier, password } = req.body;
        const result = await authService.loginUser(identifier, password);

        return res.status(200).json({ message: 'Logged in successfully!', ...result });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message, isVerified: err.isVerified});
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const result = await authService.loginAdmin(identifier, password);

        return res.status(200).json({ message: 'Logged in successfully!', ...result });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const result = await authService.verifyOtp(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req.body.email);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

exports.forgotPasswordLoggedIn = async (req, res) => {
    try {
        const result = await authService.forgotPasswordLoggedIn(req.body.email);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const result = await authService.resetPassword(token, password);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const result = await authService.resendOtp(email);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
};

// for email change
exports.sendOtp = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const result = await authService.sendOtp(userId, email);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
};

exports.handleSocialLogin = async (req, res) => {
    try {
        const user = req.user; // comes from passport
        const token = await authService.generateToken(user);
        res.redirect(`${process.env.CLIENT_URL}/auth/auth-success?token=${token}`);
    } catch (err) {
        console.error('Social login error:', err);
        res.redirect(`${process.env.CLIENT_URL}/auth/auth-failed`);
    }
};