const Razorpay = require('razorpay');

let razorpayInstance = null;

const configureRazorpay = () => {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
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
