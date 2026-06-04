const { body } = require('express-validator');

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discount price must be a positive number'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Brand cannot exceed 100 characters'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('sizes')
    .optional()
    .isArray().withMessage('Sizes must be an array'),
  body('colors')
    .optional()
    .isArray().withMessage('Colors must be an array'),
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountPrice')
    .optional({ values: 'null' })
    .isFloat({ min: 0 }).withMessage('Discount price must be a positive number'),
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

const addReviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('comment')
    .trim()
    .notEmpty().withMessage('Review comment is required')
    .isLength({ max: 2000 }).withMessage('Comment cannot exceed 2000 characters'),
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  addReviewValidation,
};
