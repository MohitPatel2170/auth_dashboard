const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Tasks');

// Create task
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;
    try {
        const task = new Task({ title, description, user: req.user.id });
        await task.save();
        res.json(task);
    } catch { res.status(500).send('Server error'); }
});

// Get all tasks for user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch { res.status(500).send('Server error'); }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    const { title, description } = req.body;
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { title, description }, { new: true });
        res.json(task);
    } catch { res.status(500).send('Server error'); }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ msg: 'Task deleted' });
    } catch { res.status(500).send('Server error'); }
});

module.exports = router;
