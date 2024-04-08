// notificationRoutes.js
const { protect } = require("../middlewares/authMiddleware");
const express = require('express');
const router = express.Router();
const { sendNotification, markNotificationAsRead, fetchNotifications, deleteNotification } = require('../controllers/NotificationController');

// Route to send a notification
router.post('/notifications/send', sendNotification);

// Route to mark a notification as read
router.put('/notifications/:_id/read', markNotificationAsRead);

// Route to fetch notifications for a user
router.get('/notifications',protect, fetchNotifications);

// Route to delete a notification
router.delete('/notifications/:_id/delete', deleteNotification);

module.exports = router;
