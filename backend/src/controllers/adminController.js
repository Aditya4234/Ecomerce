const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalCategories,
    revenueResult,
    recentOrders,
    pendingOrders,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Category.countDocuments({ isActive: true }),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Order.countDocuments({ deliveryStatus: { $in: ['pending', 'processing'] } }),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  const outOfStock = await Product.countDocuments({ stock: 0, isActive: true });
  const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 }, isActive: true });

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        outOfStock,
        lowStock,
      },
      recentOrders,
    },
  });
});

exports.getRevenueData = catchAsync(async (req, res, next) => {
  const { period = 'daily', startDate, endDate } = req.query;

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

  let groupFormat;
  let dateFields = {};

  if (period === 'daily') {
    groupFormat = {
      year: { $year: '$paidAt' },
      month: { $month: '$paidAt' },
      day: { $dayOfMonth: '$paidAt' },
    };
    dateFields = { date: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } } };
  } else if (period === 'weekly') {
    groupFormat = {
      year: { $isoWeekYear: '$paidAt' },
      week: { $isoWeek: '$paidAt' },
    };
    dateFields = { date: { $concat: [{ $toString: { $isoWeekYear: '$paidAt' } }, '-W', { $toString: { $isoWeek: '$paidAt' } }] } };
  } else if (period === 'monthly') {
    groupFormat = {
      year: { $year: '$paidAt' },
      month: { $month: '$paidAt' },
    };
    dateFields = { date: { $dateToString: { format: '%Y-%m', date: '$paidAt' } } };
  }

  const revenue = await Order.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: groupFormat,
        ...dateFields,
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: { revenue, period, startDate: start, endDate: end },
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, role, search, isActive } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: { users },
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

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const orderCount = await Order.countDocuments({ user: req.params.id });
  const totalSpent = await Order.aggregate([
    { $match: { user: user._id, isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      user,
      orderCount,
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
    },
  });
});

exports.toggleUserStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.role === 'admin') {
    return next(new AppError('Cannot toggle admin user status', 400));
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { user },
  });
});

exports.getInventoryReport = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const outOfStockCount = await Product.countDocuments({ stock: 0, isActive: true });
  const lowStockCount = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 }, isActive: true });
  const inStockCount = await Product.countDocuments({ stock: { $gt: 10 }, isActive: true });

  const lowStockProducts = await Product.find({
    stock: { $lte: 10 },
    isActive: true,
  })
    .populate('category', 'name')
    .sort({ stock: 1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const total = lowStockCount + outOfStockCount;
  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        outOfStock: outOfStockCount,
        lowStock: lowStockCount,
        inStock: inStockCount,
        total: outOfStockCount + lowStockCount + inStockCount,
      },
      products: lowStockProducts,
    },
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

exports.getSalesReport = catchAsync(async (req, res, next) => {
  const { startDate, endDate, page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

  const matchStage = {
    createdAt: { $gte: start, $lte: end },
  };

  const [orders, total, summary] = await Promise.all([
    Order.find(matchStage)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(matchStage),
    Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          totalDiscount: { $sum: '$discountAmount' },
          avgOrderValue: { $avg: '$totalPrice' },
          paidOrders: {
            $sum: { $cond: ['$isPaid', 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$deliveryStatus', 'cancelled'] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: {
      summary: summary.length > 0
        ? {
            totalSales: summary[0].totalSales,
            totalRevenue: Math.round(summary[0].totalRevenue * 100) / 100,
            totalDiscount: Math.round(summary[0].totalDiscount * 100) / 100,
            avgOrderValue: Math.round(summary[0].avgOrderValue * 100) / 100,
            paidOrders: summary[0].paidOrders,
            cancelledOrders: summary[0].cancelledOrders,
          }
        : {
            totalSales: 0,
            totalRevenue: 0,
            totalDiscount: 0,
            avgOrderValue: 0,
            paidOrders: 0,
            cancelledOrders: 0,
          },
      orders,
    },
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
