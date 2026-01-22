const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch { res.status(500).send('Server error'); }
});

router.put('/', auth, async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select('-password');
        res.json(user);
    } catch { res.status(500).send('Server error'); }
});

module.exports = router;
