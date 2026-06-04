const Banner = require('../models/Banner');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');


exports.getBanners = catchAsync(async (req, res, next) => {
  const { position } = req.query;

  const filter = { isActive: true };
  if (position) {
    filter.position = position;
  }

  const banners = await Banner.find(filter)
    .sort({ position: 1, order: 1 })
    .lean();

  res.status(200).json({
    success: true,
    data: { banners },
  });
});

exports.createBanner = catchAsync(async (req, res, next) => {
  const { title, subtitle, link, position, order, isActive } = req.body;

  if (!req.file) {
    return next(new AppError('Banner image is required', 400));
  }

  const banner = await Banner.create({
    title,
    subtitle,
    image: {
      url: req.file.path,
      publicId: req.file.filename,
    },
    link: link || '',
    position,
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: 'Banner created successfully',
    data: { banner },
  });
});

exports.updateBanner = catchAsync(async (req, res, next) => {
  let banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new AppError('Banner not found', 404));
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Banner updated successfully',
    data: { banner },
  });
});

exports.deleteBanner = catchAsync(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new AppError('Banner not found', 404));
  }

  await Banner.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Banner deleted successfully',
  });
});
