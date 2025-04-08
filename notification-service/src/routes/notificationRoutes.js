const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

const {
  createNotification,
  getUserNotifications,
} = require("../controllers/notificationController");

router.post("/", createNotification);
router.get("/:userId", getUserNotifications);
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ message: "User and message are required" });
    }
    const notification = await Notification.create({ user: userId, message });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
});

// Get notifications for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  res.json(notifications);
});


module.exports = router;
