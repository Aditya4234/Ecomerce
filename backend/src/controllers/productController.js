const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');


exports.getProducts = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    category,
    minPrice,
    maxPrice,
    rating,
    brand,
    search,
    featured,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = { isActive: true };

  if (category) {
    const cat = await Category.findOne({
      $or: [
        { slug: category.toLowerCase() },
        { name: { $regex: new RegExp(`^${category}$`, 'i') } },
      ],
    });
    if (!cat) {
      return res.status(200).json({
        success: true,
        data: { products: [] },
        pagination: { page: pageNum, limit: limitNum, total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false },
      });
    }
    filter.category = cat._id;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  if (rating) {
    filter.averageRating = { $gte: parseFloat(rating) };
  }

  if (brand) {
    filter.brand = { $regex: brand, $options: 'i' };
  }

  if (featured === 'true') {
    filter.featured = true;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  let sortOption = {};
  switch (sort) {
    case 'price_asc':
      sortOption = { price: 1 };
      break;
    case 'price_desc':
      sortOption = { price: -1 };
      break;
    case 'rating':
      sortOption = { averageRating: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'name':
      sortOption = { name: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  let query = Product.find(filter).populate('category', 'name slug');

  if (search) {
    query = query.sort({ score: { $meta: 'textScore' }, ...sortOption });
  } else {
    query = query.sort(sortOption);
  }

  const [products, total] = await Promise.all([
    query.skip(skip).limit(limitNum).lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  const responseData = {
    data: { products },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };

  res.status(200).json({ success: true, ...responseData });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name avatar' },
      options: { sort: { createdAt: -1 } },
    });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { product },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, discountPrice, category, brand, stock, featured, tags, sizes, colors, trackInventory } = req.body;

  const images = [];
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      images.push({
        url: file.path,
        publicId: file.filename,
      });
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    stock: stock || 0,
    trackInventory: trackInventory !== undefined ? trackInventory : true,
    featured: featured || false,
    tags: tags || [],
    sizes: sizes || [],
    colors: colors || [],
    images,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const updateData = { ...req.body };

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
    updateData.images = [...product.images, ...newImages];
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

exports.getFeaturedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ featured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  res.status(200).json({
    success: true,
    data: { products },
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.title = title || existingReview.title;
    existingReview.comment = comment;
    await existingReview.save();

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review: existingReview },
    });
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    title,
    comment,
    isApproved: true,
  });

  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: { review },
  });
});

exports.getProductReviews = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = { product: req.params.id, isApproved: true };

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Review.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    data: { reviews },
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
