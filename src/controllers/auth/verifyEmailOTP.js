const { prisma } = require("../../config/database");

const verifyEmailOTP = async (req, res) => {
  try {
    let { otpId } = req.params;

    if (!otpId || isNaN(otpId)) {
      return res.status(400).json({ error: "Invalid or missing OTP ID." });
    }
    otpId = parseInt(otpId, 10);

    const { otp } = req.body;
    if (!otp || typeof otp !== "string") {
      return res.status(400).json({ error: "OTP is required." });
    }

    const getDetails = await prisma.VerificationOTP.findFirst({
      where: { id: otpId },
    });

    if (!getDetails) {
      return res
        .status(404)
        .json({ error: "OTP not found.", code: "OTP_NOT_FOUND" });
    }

    const {
      firstName,
      lastName,
      clinicName,
      email,
      password,
      otp: savedOtp,
      expiresAt,
    } = getDetails;

    if (expiresAt < new Date()) {
      return res
        .status(410)
        .json({ error: "OTP has expired.", code: "OTP_EXPIRED" });
    }

    if (savedOtp !== otp) {
      return res
        .status(401)
        .json({ error: "Invalid OTP.", code: "INVALID_OTP" });
    }

    let user;

    // ✅ Wrap in a single transaction
    await prisma.$transaction(async (tx) => {
      // Create Clinic
      const clinic = await tx.Clinic.create({
        data: {
          email,
          name: clinicName,
          subscriptionStatus: "TRIAL",
          subscriptionEndsOn: new Date(
            new Date().setDate(new Date().getDate() + 30)
          ),
        },
      });

      // Create User + Doctor
      user = await tx.User.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          role: "ADMIN",
          clinicId: clinic.id,
          updatedAt: new Date(),
          Doctor: {
            create: {
              name: `${firstName} ${lastName || ""}`.trim(),
              clinicId: clinic.id,
            },
          },
        },
      });

      // Delete OTP
      await tx.VerificationOTP.delete({ where: { id: otpId } });
    });

    return res
      .status(201)
      .json({ message: "Email verified successfully", user });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = verifyEmailOTP;
