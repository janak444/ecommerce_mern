const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
    
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
