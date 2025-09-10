const bcrypt = require("bcrypt");
const { prisma } = require("../../config/database");

const newPasswordOTP = async (req, res) => {
  try {
    const { newPassword, otp } = req.body;
    let { otpId } = req.params;
    otpId = parseInt(otpId, 10);

    if (!otpId || !otp || !newPassword) {
      return res
        .status(400) // Bad Request → client didn't send required fields
        .json({ error: "OTP id, new password and OTP are required" });
    }

    const getDetails = await prisma.VerificationOTP.findFirst({
      where: { id: otpId },
    });

    if (!getDetails) {
      return res
        .status(404) // Not Found → OTP ID doesn't exist
        .json({ error: "Invalid or expired token" });
    }

    const { otp: savedOtp, expiresAt, email } = getDetails;

    if (expiresAt < new Date()) {
      return res
        .status(410) // Gone → OTP expired
        .json({ error: "OTP has expired" });
    }

    if (savedOtp !== otp) {
      return res
        .status(401) // Unauthorized → wrong OTP
        .json({ error: "Wrong OTP" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    let user;
    try {
      user = await prisma.User.update({
        where: { email },
        data: {
          password: hashPassword,
        },
      });
    } catch (err) {
      console.error("Error updating password:", err);
      return res
        .status(500) // Internal Server Error
        .json({ error: "Failed to update password" });
    }

    return res
      .status(200) // OK → password updated successfully
      .json({ message: "Password updated successfully", user });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = newPasswordOTP;
