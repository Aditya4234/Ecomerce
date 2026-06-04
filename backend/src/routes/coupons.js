const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');

router.get('/validate', couponController.validateCoupon);

router.get('/', authenticate, authorize('admin'), couponController.getCoupons);
router.post('/', authenticate, authorize('admin'), couponController.createCoupon);
router.put('/:id', authenticate, authorize('admin'), couponController.updateCoupon);
router.delete('/:id', authenticate, authorize('admin'), couponController.deleteCoupon);

module.exports = router;
