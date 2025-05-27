const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: Check if token is valid and user is admin
const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // contains id and role
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }
        req.user = decoded; // Optional: attach to request for further use
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
};

module.exports = { isAdmin };
