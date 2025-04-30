// File: models/user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    username:  { type: String, required: true, unique: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String },
    phone:     { type: String },
    profileImage: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    provider: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
