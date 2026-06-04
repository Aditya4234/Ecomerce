const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const AppError = require('../utils/AppError');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.mimetype.split('/')[1];
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!allowedFormats.includes(ext)) {
      throw new AppError('Invalid file type. Only jpg, jpeg, png, webp, and gif are allowed.', 400);
    }
    return {
      folder: 'ecommerce',
      format: ext === 'jpeg' ? 'jpg' : ext,
      transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }],
    };
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only jpg, jpeg, png, webp, and gif are allowed.', 400), false);
    }
  },
});

const uploadMultiple = upload.array('images', 5);
const uploadSingle = upload.single('image');

module.exports = { upload, uploadMultiple, uploadSingle };
