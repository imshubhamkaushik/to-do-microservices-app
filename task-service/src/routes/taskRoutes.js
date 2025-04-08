const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");
const axios = require("axios");

require("dotenv").config();

//Create Task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description)
    return res.status(400).json({ message: "Title is required" });

  const task = await Task.create({ title, description, user: req.user.id });

  // Send Notification

  await axios
    .post(`${process.env.NOTIFICATION_SERVICE_URL}`, {
      user: req.user.id,
      message: `You have a new task: ${task.title}`,
    })
    .catch((error) => console.error("Error creating task:", error.message));

  res.status(201).json(task);
});

// Get all tasks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

//Update task status
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "Task not found" });

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { completed },
    { new: true }
  );

  await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}`, {
    user: req.user.id,
    message: `Task Updated`,
  });

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

//Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}`, {
    user: req.user.id,
    message: `Task Deleted`,
  });

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});

module.exports = router;
