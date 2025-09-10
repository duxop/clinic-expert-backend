const crypto = require('crypto');

module.exports = function generateOTP() {
  // Generate a random number between 0 and 999999
  const otp = crypto.randomInt(0, 1000000); // Range: 0 to 999999
  return otp.toString().padStart(6, '0');;
};
