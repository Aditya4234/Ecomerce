const Coupon = require('../models/Coupon');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCoupons = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, isActive } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const [coupons, total] = await Promise.all([
    Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Coupon.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: { coupons },
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

exports.createCoupon = catchAsync(async (req, res, next) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minPurchase,
    maxDiscount,
    validFrom,
    validTill,
    usageLimit,
    isActive,
  } = req.body;

  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    return next(new AppError('Coupon code already exists', 400));
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    minPurchase: minPurchase || 0,
    maxDiscount: maxDiscount || 0,
    validFrom: new Date(validFrom),
    validTill: new Date(validTill),
    usageLimit: usageLimit || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: { coupon },
  });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new AppError('Coupon not found', 404));
  }

  const updateData = { ...req.body };
  if (updateData.code) {
    updateData.code = updateData.code.toUpperCase();
    const existingCoupon = await Coupon.findOne({ code: updateData.code, _id: { $ne: req.params.id } });
    if (existingCoupon) {
      return next(new AppError('Coupon code already exists', 400));
    }
  }

  if (updateData.validFrom) {
    updateData.validFrom = new Date(updateData.validFrom);
  }
  if (updateData.validTill) {
    updateData.validTill = new Date(updateData.validTill);
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Coupon updated successfully',
    data: { coupon },
  });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new AppError('Coupon not found', 404));
  }

  await Coupon.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully',
  });
});

exports.validateCoupon = catchAsync(async (req, res, next) => {
  const { code, cartTotal } = req.query;

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

  const total = parseFloat(cartTotal) || 0;

  if (total < coupon.minPurchase) {
    return next(new AppError(`Minimum purchase of ₹${coupon.minPurchase} required`, 400));
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (total * coupon.discountValue) / 100;
    if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  res.status(200).json({
    success: true,
    data: {
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
      },
      discountAmount,
    },
  });
});
