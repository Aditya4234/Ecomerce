const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({ isActive: true })
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      select: 'name slug image',
    })
    .sort({ name: 1 })
    .lean();

  const parentCategories = categories.filter((cat) => !cat.parent);
  const childCategories = categories.filter((cat) => cat.parent);

  const categoriesWithSubs = parentCategories.map((cat) => ({
    ...cat,
    subcategories: childCategories.filter((child) => String(child.parent) === String(cat._id)),
  }));

  res.status(200).json({
    success: true,
    data: {
      categories: categoriesWithSubs,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, description, parent } = req.body;

  const image = {};
  if (req.file) {
    image.url = req.file.path;
    image.publicId = req.file.filename;
  }

  const category = await Category.create({
    name,
    description,
    parent: parent || null,
    image,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  category = await Category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  const hasSubcategories = await Category.countDocuments({ parent: req.params.id });
  if (hasSubcategories > 0) {
    return next(new AppError('Cannot delete category with subcategories. Remove or reassign subcategories first.', 400));
  }

  const Product = require('../models/Product');
  const productsInCategory = await Product.countDocuments({ category: req.params.id, isActive: true });
  if (productsInCategory > 0) {
    return next(new AppError('Cannot delete category with active products. Deactivate products first.', 400));
  }

  category.isActive = false;
  await category.save();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});
