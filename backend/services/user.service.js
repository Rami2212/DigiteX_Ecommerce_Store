// services/user.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const {sendVerificationEmail} = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (data) => {
    const { email, username, password, ...rest } = data;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error('Email already registered');

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error('Username already taken');

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
        ...rest,
        email,
        username,
        password: hashedPassword,
        profileImage: '',
        verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    return { message: 'Verification email sent. Please check your inbox.' };
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

exports.verifyEmail = async (token) => {
    if (!token) throw { statusCode: 400, message: 'Token is required' };

    const user = await User.findOne({ verificationToken: token });

    if (!user) throw { statusCode: 400, message: 'Invalid or expired token' };

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return 'Email verified successfully!';
};

