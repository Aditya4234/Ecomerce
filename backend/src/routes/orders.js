const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');
const { validate } = require('../middleware/validate');
const { createOrderValidation } = require('../validators/order');

router.use(authenticate);

router.post('/', createOrderValidation, validate, orderController.createOrder);
router.get('/myorders', orderController.getMyOrders);
router.get('/', authorize('admin'), orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/cancel', orderController.cancelOrder);
router.put('/:id/status', authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
