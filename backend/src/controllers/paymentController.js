const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { getRazorpay } = require('../config/razorpay');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createRazorpayOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (String(order.user) !== String(req.user._id)) {
    return next(new AppError('Not authorized', 403));
  }

  if (order.isPaid) {
    return next(new AppError('Order is already paid', 400));
  }

  const razorpay = getRazorpay();

  const options = {
    amount: Math.round(order.totalPrice * 100),
    currency: 'INR',
    receipt: `receipt_${order._id}`,
    notes: {
      orderId: String(order._id),
      userId: String(req.user._id),
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  const payment = await Payment.create({
    order: order._id,
    user: req.user._id,
    razorpayOrderId: razorpayOrder.id,
    amount: order.totalPrice,
    currency: 'INR',
    status: 'created',
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(200).json({
    success: true,
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    },
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isSignatureValid = expectedSignature === razorpaySignature;

  if (!isSignatureValid) {
    const payment = await Payment.findOne({ razorpayOrderId });
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }

    return next(new AppError('Payment verification failed. Invalid signature.', 400));
  }

  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) {
    return next(new AppError('Payment record not found', 404));
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'paid';
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpayPaymentId,
      status: 'paid',
      update_time: new Date().toISOString(),
      email_address: req.user ? req.user.email : '',
    };
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();
  }

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      payment,
      order,
    },
  });
});

exports.getPaymentStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const payment = await Payment.findOne({ order: orderId }).sort({ createdAt: -1 });

  if (!payment) {
    return next(new AppError('Payment not found for this order', 404));
  }

  res.status(200).json({
    success: true,
    data: { payment },
  });
});

exports.processRefund = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (!order.isPaid) {
    return next(new AppError('Order has not been paid yet', 400));
  }

  const payment = await Payment.findOne({ order: orderId, status: 'paid' });
  if (!payment) {
    return next(new AppError('No paid payment found for this order', 404));
  }

  const razorpay = getRazorpay();

  try {
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: Math.round(payment.amount * 100),
    });

    payment.status = 'refunded';
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: { refund, payment },
    });
  } catch (error) {
    return next(new AppError(`Refund failed: ${error.message}`, 500));
  }
});
