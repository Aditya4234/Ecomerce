const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');
const { validate } = require('../middleware/validate');
const { uploadMultiple } = require('../middleware/upload');
const {
  createProductValidation,
  updateProductValidation,
  addReviewValidation,
} = require('../validators/product');

router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProduct);

router.post('/', authenticate, authorize('admin'), uploadMultiple, createProductValidation, validate, productController.createProduct);
router.put('/:id', authenticate, authorize('admin'), uploadMultiple, updateProductValidation, validate, productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

router.post('/:id/reviews', authenticate, addReviewValidation, validate, productController.addReview);
router.get('/:id/reviews', productController.getProductReviews);

module.exports = router;
