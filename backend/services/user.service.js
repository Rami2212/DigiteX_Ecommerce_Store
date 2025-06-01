const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { sendVerificationEmail } = require('../utils/sendEmail');
const userRepository = require('../repositories/user.repository');

const deleteOldImage = (imageUrl) => {
    if (!imageUrl) return;

    try {
        const baseUrl = process.env.BACKEND_URL;
        const relativePath = imageUrl.replace(baseUrl, '');

        const filePath = path.join(__dirname, '../', relativePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted image:', filePath);
        } else {
            console.log('File not found:', filePath);
        }
    } catch (err) {
        console.error('Error deleting image:', err);
    }
};

// Get all users
exports.getAllUsers = async () => {
    const users = await userRepository.findAllUsers();
    return users.map(user => {
        const { password, otp, otpExpires, resetPasswordToken, resetPasswordExpire, ...safeUser } = user.toObject();
        return safeUser;
    });
};

// Get user by ID
exports.getUserById = async (id) => {
    const user = await userRepository.updateOwnProfile(id, {});
    if (!user) throw new Error('User not found');
    const { password, otp, otpExpires, resetPasswordToken, resetPasswordExpire, ...safeUser } = user.toObject();
    return safeUser;
};

// Create user
exports.createUser = async (data, file) => {
    const { firstName, lastName, password, email, username, role, ...rest } = data;

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) throw new Error('Email already exists');

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) throw new Error('Username already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = null;
    if (file) {
        const relativePath = file.path.replace(/\\/g, '/');
        profileImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    const newUser = await userRepository.createUser({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        profileImage,
        role,
        isVerified: true, // Admin-created users are verified
        ...rest
    });

    return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
    };
};


// Update user (by admin)
exports.updateUserByAdmin = async (id, data, file) => {
    const user = await userRepository.updateOwnProfile(id, {});
    if (!user) throw new Error('User not found');
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    if (file) {
        if (user.profileImage) deleteOldImage(user.profileImage);
        const relativePath = file.path.replace(/\\/g, '/');
        data.profileImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    return await userRepository.updateUserById(id, data);
};

// Update user (by logged-in user)
exports.updateUserByUser = async (userId, data, file) => {
    const user = await userRepository.updateOwnProfile(userId, {});
    if (!user) throw new Error('User not found');

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    if (file) {
        if (user.profileImage) deleteOldImage(user.profileImage);
        const relativePath = file.path.replace(/\\/g, '/');
        data.profileImage = `${process.env.BACKEND_URL}/${relativePath}`;
    }

    return await userRepository.updateOwnProfile(userId, data);
};

// Delete user
exports.deleteUser = async (id) => {
    const user = await userRepository.deleteUserById(id, {});
    if (!user) throw new Error('User not found');

    if (user.profileImage) deleteOldImage(user.profileImage);

    await userRepository.deleteUserById(id);
    return user;
};

// Change email
exports.changeEmail = async (userId, newEmail, otp) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const existingEmail = await userRepository.findByEmail(newEmail);
    if (existingEmail && existingEmail._id.toString() !== userId) {
        throw new Error('Email already taken');
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
        throw new Error('Invalid or expired OTP');
    }

    user.email = newEmail;
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return { message: 'Email changed successfully!' };

};
