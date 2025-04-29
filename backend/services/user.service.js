// services/user.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const {sendVerificationEmail} = require("../utils/sendEmail");
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (data) => {
    const { email, username, password, ...rest } = data;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error('Email already registered');

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error('Username already taken');

    const hashedPassword = await bcrypt.hash(password, 10);

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

    const newUser = await User.create({
        ...rest,
        email,
        username,
        password: hashedPassword,
        profileImage: '',
        otp,
        otpExpires,
    });

    await sendVerificationEmail(email, otp);

    return {
        message: 'User registered. OTP sent to email.',
        id: newUser._id,
    };
};

exports.loginUser = async (identifier, password) => {
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    if (!user.isVerified) throw { isVerified: user.isVerified, message: 'Email not verified' };

    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            profileImage: user.profileImage || '',
        },
    };
};

exports.verifyOtp = async ({ email, otp }) => {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
        throw new Error('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return { message: 'Email verified successfully!' };
};

