const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authMiddleware = (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // In a real app, you'd fetch the user based on decoded.id
        // For this assignment, just attaching the decoded payload is fine.
        req.user = decoded; // Attach decoded payload (could contain user ID, role, etc.)
        next();
    } catch (err) {
        return next(new AppError('Invalid token.', 401));
    }
};

module.exports = authMiddleware;