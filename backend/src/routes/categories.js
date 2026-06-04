const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');
const { uploadSingle } = require('../middleware/upload');

router.get('/', categoryController.getCategories);

router.post('/', authenticate, authorize('admin'), uploadSingle, categoryController.createCategory);
router.put('/:id', authenticate, authorize('admin'), uploadSingle, categoryController.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
