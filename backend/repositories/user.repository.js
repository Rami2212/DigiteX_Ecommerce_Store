// repositories/user.repository.js
const User = require('../models/user.model');

exports.findByEmail = async (email) => await User.findOne({ email });

exports.findByUsername = async (username) => await User.findOne({ username });

exports.findByIdentifier = async (identifier) => {
    return await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });
};

exports.createUser = async (userData) => await User.create(userData);
