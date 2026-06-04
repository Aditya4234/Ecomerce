const Razorpay = require('razorpay');

let razorpayInstance = null;

const configureRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId.includes('placeholder') || !keySecret || keySecret.includes('placeholder')) {
    console.warn('Razorpay credentials not configured. Payments will be unavailable.');
    razorpayInstance = null;
    return null;
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  console.log('Razorpay Configured');
  return razorpayInstance;
};

const getRazorpay = () => {
  if (!razorpayInstance) {
    configureRazorpay();
  }
  return razorpayInstance;
};

module.exports = { configureRazorpay, getRazorpay };
