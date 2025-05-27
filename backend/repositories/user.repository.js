// repositories/user.repository.js
const User = require('../models/user.model');

exports.findById = async (id) => await User.findById(id);

exports.findByEmail = async (email) => await User.findOne({ email });

exports.findByUsername = async (username) => await User.findOne({ username });

exports.findByIdentifier = async (identifier) => {
    return await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });
};

exports.createUser = async (userData) => await User.create(userData);

exports.findAllUsers = async () => await User.find();

exports.updateUserById = async (userId, updateData) =>
    await User.findByIdAndUpdate(userId, updateData, { new: true });

exports.updateOwnProfile = async (userId, updateData) =>
    await User.findByIdAndUpdate(userId, updateData, { new: true });

exports.deleteUserById = async (userId) => await User.findByIdAndDelete(userId);