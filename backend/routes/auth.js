const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Input validation helper
const validateSignupInput = (name, email, password) => {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.push('Please enter a valid email');
    }
    
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    
    return errors;
};

const validateLoginInput = (email, password) => {
    const errors = [];
    
    if (!email) {
        errors.push('Email is required');
    }
    
    if (!password) {
        errors.push('Password is required');
    }
    
    return errors;
};

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validating the input
    const errors = validateSignupInput(name, email, password);
    if (errors.length > 0) {
        return res.status(400).json({ msg: 'Validation failed', errors });
    }

    try {
        // Checking if the user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }

        // Create new user
        user = new User({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password 
        });
        
        await user.save();

        // Generating the JWT token
        const payload = { 
            id: user._id,
            email: user.email 
        };
        
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({ 
            success: true,
            msg: 'User registered successfully',
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (err) {
        console.error('Error in signup:', err);
        
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }
        
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Validate input
    const errors = validateLoginInput(email, password);
    if (errors.length > 0) {
        return res.status(400).json({ msg: 'Validation failed', errors });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        // Generate JWT token
        const payload = { 
            id: user._id,
            email: user.email 
        };
        
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ 
            success: true,
            msg: 'Login successful',
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;