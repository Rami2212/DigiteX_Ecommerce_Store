// Middleware: Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }
};

// Middleware: Check if user is a standard user (optional)
const isUser = (req, res, next) => {
    if (req.user?.role === 'user') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: User access only' });
    }
};

module.exports = { isAdmin, isUser };
