const Razorpay = require('razorpay')

var razorpayInstance = new Razorpay({
  key_id: process.env.RAZOZRPAY_KEY_ID,
  key_secret: process.env.RAZOZRPAY_SECRET_KEY,
});

module.exports = razorpayInstance;