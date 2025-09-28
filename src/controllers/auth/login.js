const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../config/database");
const { verifySignIn } = require("../../utils/dataValidator");

const login = async (req, res) => {
  try {
    // Sanitize and validate input
    const { email, password, err } = verifySignIn(req.body);
    if (err) {
      return res.status(err.code).json({ error: err.message });
    }

    // Find user by email
    const user = await prisma.User.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check if the password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
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
        user: { id: user.id, email: user.email, role: user.role, clinicId: user.clinicId },
      });
  } catch (error) {
    console.error("Error during sign in:", error.message);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};

module.exports = login;
