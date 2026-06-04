const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getWishlist = catchAsync(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate({
      path: 'products',
      select: 'name slug price discountPrice images averageRating numReviews stock isActive',
    });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.status(200).json({
    success: true,
    data: { wishlist },
  });
});

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    const isAlreadyInWishlist = wishlist.products.some(
      (p) => String(p) === productId
    );

    if (isAlreadyInWishlist) {
      return next(new AppError('Product already in wishlist', 400));
    }

    wishlist.products.push(productId);
    await wishlist.save();
  }

  wishlist = await Wishlist.findById(wishlist._id)
    .populate({
      path: 'products',
      select: 'name slug price discountPrice images averageRating numReviews stock isActive',
    });

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    data: { wishlist },
  });
});

exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return next(new AppError('Wishlist not found', 404));
  }

  const productIndex = wishlist.products.findIndex((p) => String(p) === productId);
  if (productIndex === -1) {
    return next(new AppError('Product not found in wishlist', 404));
  }

  wishlist.products.splice(productIndex, 1);
  await wishlist.save();

  await wishlist.populate({
    path: 'products',
    select: 'name slug price discountPrice images averageRating numReviews stock isActive',
  });

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    data: { wishlist },
  });
});

exports.checkWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  const isInWishlist = wishlist
    ? wishlist.products.some((p) => String(p) === productId)
    : false;

  res.status(200).json({
    success: true,
    data: { isInWishlist },
  });
});
