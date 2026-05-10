const { OAuth2Client } = require("google-auth-library");
const { prisma } = require("../../config/database");
const jwt = require("jsonwebtoken");
const { verifyEmail } = require("../../utils/dataValidator");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(401).json({
        message: "Google email not verified",
      });
    }

    console.log("payload", payload);

    const { email } = verifyEmail({ email: payload.email });
    const firstName = payload.given_name;
    const lastName = payload.family_name;
    const picture = payload.picture;
    const googleId = payload.sub;

    // find existing user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // create if not exists

    if (user && !user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          authProvider: "GOOGLE",
          // profilePicture: picture,
        },
      });
    }
    if (!user) {
      // ✅ Wrap in a single transaction
      const plan = await prisma.SubscriptionPlan.findUnique({
        where: {
          name: "Basic",
          isActive: true,
        },
      });
      await prisma.$transaction(async (tx) => {
        // Create Clinic
        const clinic = await tx.Clinic.create({
          data: {
            email,
            name: `${firstName}'s Clinic`,
            updatedAt: new Date(),
            Subscription: {
              create: {
                planId: plan.id,
                status: "ACTIVE",
                startDate: new Date(),
                endDate: new Date(
                  new Date().setDate(new Date().getDate() + 30),
                ),
                updatedAt: new Date(),
              },
            },
          },
        });

        // Create User + Doctor
        user = await tx.User.create({
          data: {
            firstName,
            lastName,
            email,
            password: null,
            role: "ADMIN",
            clinicId: clinic.id,
            updatedAt: new Date(),
            Doctor: {
              create: {
                firstName,
                lastName,
                clinicId: clinic.id,
              },
            },
          },
        });
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" },
    );

    // Update last login timestamp
    await prisma.User.update({
      where: { id: user.id },
      data: {
        JWT: token,
        lastLoginAt: new Date(),
      },
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        domain:
          process.env.NODE_ENV === "production" ? ".clinicxpert.in" : undefined,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Sign in successful.",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          clinicId: user.clinicId,
        },
      });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};

module.exports = googleLogin;
