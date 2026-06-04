const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (req.user.role !== 'admin') {
    filter.$or = [{ user: req.user._id }, { user: null }];
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Notification.countDocuments(filter),
  ]);

  const unreadCount = await Notification.countDocuments({
    ...filter,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    data: { notifications, unreadCount },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

exports.getNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  if (
    req.user.role !== 'admin' &&
    notification.user &&
    notification.user.toString() !== req.user._id.toString()
  ) {
    return next(new AppError('Not authorized to access this notification', 403));
  }

  res.status(200).json({
    success: true,
    data: { notification },
  });
});

exports.createNotification = catchAsync(async (req, res, next) => {
  const { user, type, title, message, link } = req.body;

  const notification = await Notification.create({
    user: user || null,
    type,
    title,
    message,
    link,
  });

  res.status(201).json({
    success: true,
    data: { notification },
  });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: { notification },
  });
});

exports.markAllAsRead = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.user.role !== 'admin') {
    filter.$or = [{ user: req.user._id }, { user: null }];
  }

  await Notification.updateMany(filter, { isRead: true });

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});
