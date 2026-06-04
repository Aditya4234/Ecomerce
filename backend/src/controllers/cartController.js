const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive',
    })
    .populate('appliedCoupon');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0, totalItems: 0 });
  }

  res.status(200).json({
    success: true,
    data: { cart },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1, size, color } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (!product.isActive) {
    return next(new AppError('Product is no longer available', 400));
  }

  if (product.trackInventory && product.stock < quantity) {
    return next(new AppError('Insufficient stock', 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0, totalItems: 0 });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) =>
      String(item.product) === productId &&
      item.size === (size || '') &&
      item.color === (color || '')
  );

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (product.trackInventory && product.stock < newQuantity) {
      return next(new AppError('Insufficient stock', 400));
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    if (product.trackInventory && product.stock < quantity) {
      return next(new AppError('Insufficient stock', 400));
    }
    cart.items.push({
      product: productId,
      quantity,
      size: size || '',
      color: color || '',
    });
  }

  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive',
    })
    .populate('appliedCoupon');

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: { cart },
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex((item) => String(item._id) === itemId);
  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive',
    })
    .populate('appliedCoupon');

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: { cart },
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const item = cart.items.id(itemId);
  if (!item) {
    return next(new AppError('Item not found in cart', 404));
  }

  const product = await Product.findById(item.product);
  if (product && product.trackInventory && product.stock < quantity) {
    return next(new AppError('Insufficient stock', 400));
  }

  if (quantity <= 0) {
    cart.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive',
    })
    .populate('appliedCoupon');

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: { cart },
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    cart.appliedCoupon = null;
    cart.discountAmount = 0;
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: { cart: { items: [], totalPrice: 0, totalItems: 0 } },
  });
});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new AppError('Coupon code is required', 400));
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validTill: { $gte: new Date() },
  });

  if (!coupon) {
    return next(new AppError('Invalid or expired coupon', 400));
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return next(new AppError('Coupon usage limit reached', 400));
  }

  let cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive',
    });

  if (!cart || cart.items.length === 0) {
    return next(new AppError('Cart is empty', 400));
  }

  const cartTotal = cart.items.reduce((total, item) => {
    const price = item.product.discountPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  if (cartTotal < coupon.minPurchase) {
    return next(new AppError(`Minimum purchase of ₹${coupon.minPurchase} required for this coupon`, 400));
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  cart.appliedCoupon = coupon._id;
  cart.discountAmount = discountAmount;
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate({
      path: 'items.product',
      select: 'name slug price discountPrice images stock isActive',
    })
    .populate('appliedCoupon');

  res.status(200).json({
    success: true,
    message: 'Coupon applied successfully',
    data: { cart },
  });
});

exports.removeCoupon = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.appliedCoupon = null;
    cart.discountAmount = 0;
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Coupon removed',
    data: { cart },
  });
});
