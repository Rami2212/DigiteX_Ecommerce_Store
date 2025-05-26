const userService = require('../services/user.service');
const {
    createUserDTO,
    adminUpdateUserDTO,
    userUpdateUserDTO,
} = require('../dtos/user.dto');

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error getting all users:', err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

// get user by id
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        console.error('Error getting user by ID:', err);
        res.status(400).json({ error: err.message });
    }
};

// create user
exports.createUser = async (req, res) => {
    try {
        const { error } = createUserDTO.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const result = await userService.createUser(req.body, req.file);
        res.status(201).json({ message: 'User created successfully!', ...result });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(400).json({ error: err.message });
    }
};

// admin updates user
exports.updateUserByAdmin = async (req, res) => {
    try {
        const { error } = adminUpdateUserDTO.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updatedUser = await userService.updateUserByAdmin(req.params.id, req.body, req.file);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
    } catch (err) {
        console.error('Error updating user by admin:', err);
        res.status(400).json({ error: err.message });
    }
};

// user updates user
exports.updateUserByUser = async (req, res) => {
    try {
        const { error } = userUpdateUserDTO.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const userId = req.user.id; // Make sure `authenticate` middleware sets req.user
        const updatedUser = await userService.updateUserByUser(userId, req.body, req.file);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (err) {
        console.error('Error updating own profile:', err);
        res.status(400).json({ error: err.message });
    }
};

// delete user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(400).json({ error: err.message });
    }
};

// delete own user account
exports.deleteOwnUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await userService.deleteUser(userId);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully!' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(400).json({ error: err.message });
    }
};

// change email
exports.changeEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, otp } = req.body;

        const updatedUser = await userService.changeEmail(userId, email, otp);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ message: 'Email updated successfully!', user: updatedUser });
    } catch (err) {
        console.error('Error changing email:', err);
        res.status(400).json({ error: err.message });
    }
};