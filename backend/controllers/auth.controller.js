// controllers/auth.controller.js
const userService = require('../services/auth.service');
const { registerUserDto, loginUserDto } = require('../dtos/user.dto');

exports.registerUser = async (req, res) => {
    try {
        const { error } = registerUserDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const result = await userService.registerUser(req.body);
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
        const result = await userService.loginUser(identifier, password);

        return res.status(200).json({ message: 'Logged in successfully!', ...result });
    } catch (err) {
        console.error(err);
        return res.status(400).json(err);
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const result = await userService.verifyOtp(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const result = await userService.forgotPassword(req.body.email);
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
        const result = await userService.resetPassword(token, password);
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

        const result = await userService.resendOtp(email);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
};

exports.handleSocialLogin = async (req, res) => {
    try {
        const user = req.user; // comes from passport
        const token = await userService.generateToken(user);
        res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
    } catch (err) {
        console.error('Social login error:', err);
        res.redirect(`${process.env.CLIENT_URL}/auth-failed`);
    }
};