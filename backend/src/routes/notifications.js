const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');

router.get('/', authenticate, notificationController.getNotifications);
router.get('/:id', authenticate, notificationController.getNotification);
router.post('/', authenticate, authorize('admin'), notificationController.createNotification);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, authorize('admin'), notificationController.deleteNotification);

module.exports = router;
