const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = startOfThisMonth;

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    usersThisMonth,
    usersLastMonth,
    productsThisMonth,
    productsLastMonth,
    ordersThisMonth,
    ordersLastMonth,
    revenueThisMonth,
    revenueLastMonth,
    recentOrders,
    topProductsAgg,
    revenueByMonth,
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    User.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
    User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
    Product.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
    Product.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
    Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          sales: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]),
    Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { year: { $year: '$paidAt' }, month: { $month: '$paidAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' },
                ],
              },
            ],
          },
          revenue: 1,
          orders: 1,
        },
      },
    ]),
  ]);

  const totalRevenue = revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0;
  const prevRevenue = revenueLastMonth.length > 0 ? revenueLastMonth[0].total : 0;

  const calcChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProducts,
      totalUsers,
      revenueChange: calcChange(totalRevenue, prevRevenue),
      ordersChange: calcChange(ordersThisMonth, ordersLastMonth),
      productsChange: calcChange(productsThisMonth, productsLastMonth),
      usersChange: calcChange(usersThisMonth, usersLastMonth),
      recentOrders,
      topProducts: topProductsAgg,
      revenueByMonth,
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
