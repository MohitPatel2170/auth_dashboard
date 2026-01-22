const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // expects "Bearer <token>"
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
        req.user = decoded; // ✅ use decoded directly, because your payload is { id: user._id }
        next();
    } catch (err) {
        console.error('JWT error:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
