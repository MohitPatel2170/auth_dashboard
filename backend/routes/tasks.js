const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Tasks');

// Create task
router.post('/', auth, async (req, res) => {
    const { title, description, status } = req.body;
    
    // Validation
    if (!title || title.trim().length === 0) {
        return res.status(400).json({ msg: 'Title is required' });
    }
    
    try {
        const task = new Task({ 
            title: title.trim(), 
            description: description ? description.trim() : '',
            status: status || 'pending',
            user: req.user.id 
        });
        
        await task.save();
        
        res.status(201).json({
            success: true,
            msg: 'Task created successfully',
            task
        });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get all tasks for user (with search and filter)
router.get('/', auth, async (req, res) => {
    try {
        const { search, status, sort } = req.query;
        
        // Build query
        let query = { user: req.user.id };
        
        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by status
        if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
            query.status = status;
        }
        
        // Determine sort order
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'title') {
            sortOption = { title: 1 };
        }
        
        const tasks = await Task.find(query).sort(sortOption);
        
        res.json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        
        res.json({
            success: true,
            task
        });
    } catch (err) {
        console.error('Error fetching task:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    const { title, description, status } = req.body;
    
 
    const updateFields = {};
    
    if (title !== undefined) {
        if (title.trim().length === 0) {
            return res.status(400).json({ msg: 'Title cannot be empty' });
        }
        updateFields.title = title.trim();
    }
    
    if (description !== undefined) {
        updateFields.description = description.trim();
    }
    
    if (status !== undefined) {
        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value' });
        }
        updateFields.status = status;
    }
    
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ msg: 'No fields to update' });
    }
    
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            updateFields, 
            { new: true, runValidators: true }
        );
        
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        
        res.json({
            success: true,
            msg: 'Task updated successfully',
            task
        });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        
        res.json({
            success: true,
            msg: 'Task deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;