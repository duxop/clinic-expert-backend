const { prisma } = require("../config/database");
const generateOTP = require("./generateOTP");
const sendEmail = require("./sendOtpMail");

const sendOTP = async (user) => {
  try {
    const { email, firstName, lastName, clinicName, password, hashPassword } =
      user;

    const checkEmail = await prisma.VerificationOTP.findUnique({
      where: { email },
    });
    const OTP = generateOTP()
    if (checkEmail) {
      const currentTime = new Date();
      if (checkEmail.expiresAt > currentTime) {
        return { message: "OTP already sent, please check your email.", OTPid: checkEmail.id };
      }

      // await sendEmail(email, OTP);
      const otpDetails = await prisma.VerificationOTP.update({
        where: { email },
        data: {
          email,
          firstName,
          lastName,
          clinicName: clinicName || null,
          password: password || hashPassword,
          otp: OTP,
          expiresAt: new Date(Date.now() + 5 * 60000),
        },
      });
      console.log("OTP Details", otpDetails);
      return { OTPid: otpDetails.id };
    }

    // await sendEmail(email, OTP);
    const otpDetails = await prisma.VerificationOTP.create({
      data: {
        email,
        firstName,
        lastName,
        clinicName: clinicName || null,
        password: password || hashPassword,
        otp: OTP,
        expiresAt: new Date(Date.now() + 5 * 60000),
      },
    });

    console.log("OTP Details", otpDetails);
    return { OTPid: otpDetails.id };
  } catch (err) {
    console.error("Error in createOTP:", err);

    return {
      errorOTP: {
        code: 500,
        message: "Failed to generate OTP. Please try again later.",
      },
    };
  }
};

module.exports = sendOTP;
