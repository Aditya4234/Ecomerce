const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');
const { uploadSingle } = require('../middleware/upload');

router.get('/', bannerController.getBanners);

router.post('/', authenticate, authorize('admin'), uploadSingle, bannerController.createBanner);
router.put('/:id', authenticate, authorize('admin'), uploadSingle, bannerController.updateBanner);
router.delete('/:id', authenticate, authorize('admin'), bannerController.deleteBanner);

module.exports = router;
