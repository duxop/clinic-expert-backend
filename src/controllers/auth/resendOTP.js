const { prisma } = require("../../config/database");
const resendOtpUtil = require("../../utils/resendOTP");

const resendOTP = async (req, res) => {
  try {
    // Extract and sanitize OTP ID
    console.log(req.params);
    let { otpId } = req.params;
    otpId = parseInt(otpId, 10);
    console.log(otpId);
    // Validate OTP ID
    if (!otpId || isNaN(otpId)) {
      console.error("Invalid or missing OTP ID.");
      return res.status(400).json({ error: "Invalid or missing OTP ID." });
    }

    // Check for existing OTP
    const existingOTP = await prisma.VerificationOTP.findUnique({
      where: { id: otpId },
    });

    if (!existingOTP) {
      console.info("No OTP found for the given ID.");
      return res.status(404).json({
        message: "No OTP found for this ID. Please sign up first.",
      });
    }

    const { OTPid, data, errorOTP = null } = await resendOtpUtil({
      otpId,
      oldExpiresAt: existingOTP.expiresAt,
    });

    console.log(errorOTP);
    if (errorOTP !== null)
      return res.status(errorOTP.code).json({ error: errorOTP.message });

    console.info("New OTP generated and sent, id:", OTPid);

    return res.status(200).json({
      message: "Verification OTP re-sent. Please check your inbox.",
      OTPid,
      data
    });
  } catch (error) {
    console.error("Error during OTP resend process:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = resendOTP;
