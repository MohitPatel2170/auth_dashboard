const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json({
            success: true,
            user
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Update user profile
router.put('/', auth, async (req, res) => {
    const { name, email } = req.body;
    
    // Validation
    if (!name && !email) {
        return res.status(400).json({ msg: 'Please provide at least one field to update' });
    }
    
    const updateFields = {};
    
    if (name) {
        if (name.trim().length < 2) {
            return res.status(400).json({ msg: 'Name must be at least 2 characters' });
        }
        updateFields.name = name.trim();
    }
    
    if (email) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).json({ msg: 'Please enter a valid email' });
        }
        updateFields.email = email.toLowerCase().trim();
    }
    
    try {
        // Check if email already exists (if updating email)
        if (email) {
            const existingUser = await User.findOne({ 
                email: email.toLowerCase(),
                _id: { $ne: req.user.id }
            });
            
            if (existingUser) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
        }
        
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            updateFields, 
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json({
            success: true,
            msg: 'Profile updated successfully',
            user
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Email already in use' });
        }
        
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;