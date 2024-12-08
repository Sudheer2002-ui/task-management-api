const Task = require('../models/Task');
const Joi = require('joi');

// Validation Schema
const taskValidationSchema = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().optional(),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'COMPLETED').optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
    dueDate: Joi.date().optional(),
});

// Create Task
exports.createTask = async (req, res) => {
    const { title, description } = req.body;
  
    // Check if title and description are provided
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
  
    try {
      // Create and save the task
      const newTask = new Task({ title, description });
      await newTask.save();
  
      res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
// Get All Tasks
exports.getTasks = async (req, res, next) => {
    try {
        const { status, priority, sort, limit = 10, skip = 0 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find(query)
            .sort(sort ? { [sort]: 1 } : {})
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

// Get Task by ID
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
};

// Update Task
exports.updateTask = async (req, res, next) => {
    try {
        const { error } = taskValidationSchema.validate(req.body);
        if (error) {
            console.error('Validation error:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const task = await Task.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
        if (!task) {
            console.error('Task not found:', req.params.id);
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error('Server error:', err.message);
        next(err); // Ensure the error handler catches this
    }
};


// Delete Task
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
