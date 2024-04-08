// notificationController.js

const Notification = require('../models/NotificationModel');

// Send a notification
exports.sendNotification = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Create a new notification
    const notification = await Notification.create({ sender, receiver, message });
    
    return res.status(201).json({ success: true, data: notification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params._id;
    // Find the notification by ID and mark it as read
    const notification = await Notification.findByIdAndUpdate(notificationId, { read: true });
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Fetch notifications for a user
exports.fetchNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in the request object

    // Fetch notifications for the user
    const notifications = await Notification.find({ receiver: userId }).sort({ timestamp: -1 });

    return res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params._id;

    // Find and delete the notification from the database
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    
    // Check if the notification was found and deleted
    if (!deletedNotification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    return res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

