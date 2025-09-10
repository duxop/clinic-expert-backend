const { prisma } = require("../../config/database");
const { verifySignUp } = require("../../utils/dataValidator");
const createOTP = require("../../utils/createOTP");

const signup = async (req, res) => {
  try {
    console.log(req);
    const { firstName, lastName, clinicName, email, hashPassword, err } =
      await verifySignUp(req.body);

    // Check if username and password are provided
    if (err) return res.status(err.code).json({ err: err.message });
    const existingUser = await prisma.User.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const { OTPid, errorOTP = null } = await createOTP({
      email,
      firstName,
      lastName,
      clinicName,
      hashPassword,
    });
    
    console.log(errorOTP);
    if (errorOTP !== null)
      return res.status(errorOTP.code).json({ error: errorOTP.message });

    return res
      .status(200)
      .json({
        message: "Verification OTP sent. Please check your inbox.",
        OTPid,
      });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = signup;
