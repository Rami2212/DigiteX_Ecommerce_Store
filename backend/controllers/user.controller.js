// controllers/user.controller.js
const userService = require('../services/user.service');
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

