const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');

router.post('/create-razorpay-order', authenticate, paymentController.createRazorpayOrder);
router.post('/verify', authenticate, paymentController.verifyPayment);
router.get('/status/:orderId', authenticate, paymentController.getPaymentStatus);
router.post('/refund/:orderId', authenticate, authorize('admin'), paymentController.processRefund);

module.exports = router;
