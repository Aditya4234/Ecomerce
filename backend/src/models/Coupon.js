const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Code cannot exceed 20 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: {
      values: ['percentage', 'fixed'],
      message: 'Discount type must be percentage or fixed',
    },
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive'],
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase must be positive'],
  },
  maxDiscount: {
    type: Number,
    default: 0,
    min: [0, 'Maximum discount must be positive'],
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required'],
  },
  validTill: {
    type: Date,
    required: [true, 'Valid till date is required'],
  },
  usageLimit: {
    type: Number,
    default: 0,
    min: [0, 'Usage limit must be positive'],
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

couponSchema.index({ validFrom: 1, validTill: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
