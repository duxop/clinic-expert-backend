const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  const verificationToken = await prisma.VerificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  // Proceed with user creation
  const { email } = verificationToken;
  const clinic = await prisma.Clinic.create({
    data: {
      email: email,
      name: clinicName,
      subscriptionStatus: "TRIAL",
      subscriptionEndsOn: new Date(
        new Date().setDate(new Date().getDate() + 30)
      ),
    },
  });

  const user = await prisma.User.create({
    data: {
      firstName,
      lastName,
      email,
      password,
      role: "ADMIN",
      clinicId: clinic.id,
    },
  });

  // Clean up token
  await prisma.VerificationToken.delete({
    where: { token },
  });

  return res.status(201).json({ message: "Email verified successfully", user });
};

module.exports = verifyEmail;
