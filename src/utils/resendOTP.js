const { prisma } = require("../config/database");
const generateOTP = require("./generateOTP");
const sendEmail = require("./sendOtpMail");

const resendOtpUtil = async (user) => {
  try {
    const { otpId, oldExpiresAt, email } = user;
    const canSendAfter = new Date(oldExpiresAt - 1000 * 180); // can resend after 2 minutes

    const currentTime = new Date();
    if (canSendAfter > currentTime) {
      const waitTime = Math.ceil((canSendAfter - currentTime) / 1000);
      return {
        errorOTP: {
          code: 429,
          message: `New OTP can be generated after ${waitTime} seconds.`,
        },
      };
    }
    const OTP = generateOTP();

    await sendEmail(email, OTP);
    
    const updatedOTP = await prisma.VerificationOTP.update({
      where: { id: otpId },
      data: {
        otp: OTP,
        expiresAt: new Date(Date.now() + 5 * 60000), // 5 minutes
      },
    });
    console.log(updatedOTP);
    return {
      message: "Verification OTP re-sent. Please check your inbox.",
      OTPid: updatedOTP.id,
      data: updatedOTP,
    };
  } catch (err) {
    console.error("Error in createOTP:", err);

    return {
      errorOTP: {
        code: 500,
        message: "Failed to resend OTP. Please try again later.",
      },
    };
  }
};

module.exports = resendOtpUtil;
