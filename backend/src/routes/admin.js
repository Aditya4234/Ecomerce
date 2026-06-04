const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/revenue', adminController.getRevenueData);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);
router.get('/inventory', adminController.getInventoryReport);
router.get('/sales', adminController.getSalesReport);

module.exports = router;
