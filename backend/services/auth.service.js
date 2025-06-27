const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { sendVerificationEmail, sendResetPasswordEmail, sendResetPasswordEmailLoggedIn, resendVerificationEmail } = require("../utils/sendEmail");
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
            isVerified: user.isVerified,
            profileImage: user.profileImage || '',
            createdAt: user.createdAt,
        },
    };
};

exports.loginAdmin = async (identifier, password) => {
    // Find the user by email or username
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });

    // If user is not found, throw an error
    if (!user) throw new Error('Invalid credentials');

    // Check if the provided password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Check if the user is an admin
    if (user.role !== 'admin') throw new Error('Access denied. Admins only.');

    // Generate a JWT token for the admin
    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    // Return the token and user details
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
            isVerified: user.isVerified,
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

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user found with that email');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiry = Date.now() + 10 * 60 * 1000; // 10 mins

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expiry;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    await sendResetPasswordEmail(email, resetUrl);

    return { message: 'Reset link sent to email', resetToken };
};

exports.forgotPasswordLoggedIn = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No user found with that email');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiry = Date.now() + 10 * 60 * 1000; // 10 mins

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expiry;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/user/reset-password/${resetToken}`;
    await sendResetPasswordEmailLoggedIn(email, resetUrl);

    return { message: 'Reset link sent to email', resetToken };
};

exports.resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw new Error('Invalid or expired token');

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { message: 'Password has been reset successfully' };
};

exports.resendOtp = async (email) => {
    const user = await User.findOne({ email });

    if (!user) throw new Error('User not found');

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = generateOtp();
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now
    await user.save();

    await resendVerificationEmail(email, user.otp);

    return { message: 'OTP resent successfully' };
};

// for email change
exports.sendOtp = async (userId, email) => {
    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = generateOtp();
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now
    await user.save();

    await sendVerificationEmail(email, user.otp);

    return { message: 'OTP resent successfully' };
};

exports.generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username, profileImage: user.profileImage }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};