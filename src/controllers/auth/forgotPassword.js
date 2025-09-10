// enter the mail id then send an otp

const { prisma } = require("../../config/database");
const createOTP = require("../../utils/createOTP");
const { verifyEmail } = require("../../utils/dataValidator");

const forgotPassword = async (req, res) => {
  const { email, err } = verifyEmail(req.body);

  if (err) return res.status(err.code).json({ err: err.message });

  const user = await prisma.User.findUnique({
    where: { email },
  });

  if (!user)
    return res
      .status(401)
      .json({ error: "Email Id not found. Please sign up first" });

  const { OTPid, errorOTP } = await createOTP(user);

  if (errorOTP)
    return res.status(errorOTP.code).json({ error: errorOTP.message });

  return res
    .status(200)
    .json({
      message: "Verification OTP sent. Please check your inbox.",
      OTPid,
    });
};

module.exports = forgotPassword;
