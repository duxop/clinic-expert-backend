const bcrypt = require("bcrypt");
const { prisma } = require("../../config/database");

const resetPassword = async (req, res) => {
  try {
    const { id, password } = req.userData;
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: "Old password and new password are required.",
      });
    }

    // Verify the old password
    const passwordMatch = await bcrypt.compare(oldPassword, password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Incorrect old password. Please try again.",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const update = await prisma.User.update({
      where: { id },
      data: { password: hashPassword },
    });

    if (!update) {
      return res.status(400).json({
        error: "Failed to update password. Please try again.",
      });
    }

    // Success response
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    // Log detailed error for debugging
    console.error("Error during password reset:", error);

    // Send appropriate error response
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

module.exports = resetPassword;
