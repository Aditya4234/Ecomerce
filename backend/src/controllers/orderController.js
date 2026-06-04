const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../utils/sendEmail');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress, paymentMethod, orderItems: bodyOrderItems } = req.body;

  let cart;
  try {
    cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price discountPrice images stock trackInventory isActive',
      })
      .populate('appliedCoupon');
  } catch {
    cart = null;
  }

  let orderItems, itemsPrice, shippingPrice, taxPrice, discountAmount, coupon;

  if (cart && cart.items.length > 0) {
    for (const item of cart.items) {
      const product = item.product;
      if (!product) return next(new AppError('Product not found in cart', 404));
      if (!product.isActive) return next(new AppError(`${product.name} is no longer available`, 400));
      if (product.trackInventory && product.stock < item.quantity)
        return next(new AppError(`Insufficient stock for ${product.name}`, 400));
    }

    orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      image: item.product.images?.length > 0 ? item.product.images[0].url : '',
      price: item.product.discountPrice || item.product.price,
      size: item.size || '',
      color: item.color || '',
    }));

    itemsPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    shippingPrice = itemsPrice >= 500 ? 0 : 40;
    taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
    discountAmount = cart.discountAmount || 0;
    coupon = cart.appliedCoupon || undefined;
  } else if (bodyOrderItems && bodyOrderItems.length > 0) {
    for (const item of bodyOrderItems) {
      const product = await Product.findById(item.product);
      if (!product) return next(new AppError(`Product not found: ${item.name}`, 404));
      if (!product.isActive) return next(new AppError(`${item.name} is no longer available`, 400));
      if (product.trackInventory && product.stock < item.quantity)
        return next(new AppError(`Insufficient stock for ${item.name}`, 400));
    }

    orderItems = bodyOrderItems;
    itemsPrice = bodyOrderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    shippingPrice = itemsPrice >= 500 ? 0 : 40;
    taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
    discountAmount = 0;
    coupon = undefined;
  } else {
    return next(new AppError('No items to order', 400));
  }

  const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice - discountAmount) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: Math.round(itemsPrice * 100) / 100,
    shippingPrice,
    taxPrice,
    totalPrice,
    discountAmount,
    coupon,
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product && product.trackInventory) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  if (cart && cart.appliedCoupon) {
    await Coupon.findByIdAndUpdate(cart.appliedCoupon, { $inc: { usedCount: 1 } });
  }

  if (cart) {
    cart.items = [];
    cart.appliedCoupon = null;
    cart.discountAmount = 0;
    await cart.save();
  }

  try {
    const emailHTML = `
      <h2>Order Confirmed!</h2>
      <p>Thank you for your order, ${req.user.name}!</p>
      <p>Order ID: ${order._id}</p>
      <p>Total: ₹${totalPrice}</p>
    `;
    await sendEmail({
      email: req.user.email,
      subject: 'Order Confirmed',
      html: emailHTML,
    });
  } catch (error) {
    console.error('Order confirmation email failed:', error.message);
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order },
  });
});

exports.getOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = { user: req.user._id };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: { orders },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'orderItems.product',
    select: 'name slug images',
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    data: { order },
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (String(order.user) !== String(req.user._id)) {
    return next(new AppError('Not authorized to cancel this order', 403));
  }

  if (order.deliveryStatus === 'delivered' || order.deliveryStatus === 'cancelled') {
    return next(new AppError('Order cannot be cancelled at this stage', 400));
  }

  if (order.deliveryStatus === 'shipped') {
    return next(new AppError('Order has already been shipped and cannot be cancelled', 400));
  }

  order.deliveryStatus = 'cancelled';
  await order.save();

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product && product.trackInventory) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order },
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    startDate,
    endDate,
    search,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  if (status) {
    filter.deliveryStatus = status;
  }

  if (paymentStatus === 'paid') {
    filter.isPaid = true;
  } else if (paymentStatus === 'unpaid') {
    filter.isPaid = false;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { _id: { $regex: search, $options: 'i' } },
      { 'orderItems.name': { $regex: search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: { orders },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { deliveryStatus, trackingNumber, isPaid, paidAt } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (deliveryStatus) {
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.deliveryStatus].includes(deliveryStatus)) {
      return next(
        new AppError(`Cannot transition from ${order.deliveryStatus} to ${deliveryStatus}`, 400)
      );
    }

    order.deliveryStatus = deliveryStatus;

    if (deliveryStatus === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (deliveryStatus === 'cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product && product.trackInventory) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }
  }

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (isPaid !== undefined) {
    order.isPaid = isPaid;
    order.paidAt = paidAt ? new Date(paidAt) : new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: { order },
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = { user: req.user._id };
  if (status) {
    filter.deliveryStatus = status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: { orders },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  });
});
