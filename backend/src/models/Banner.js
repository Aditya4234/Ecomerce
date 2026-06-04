const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [500, 'Subtitle cannot exceed 500 characters'],
  },
  image: {
    url: { type: String, required: [true, 'Banner image is required'] },
    publicId: { type: String, required: true },
  },
  link: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    required: [true, 'Banner position is required'],
    enum: {
      values: ['home-top', 'home-middle', 'home-bottom'],
      message: 'Position must be home-top, home-middle, or home-bottom',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

bannerSchema.index({ position: 1, order: 1, isActive: 1 });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
