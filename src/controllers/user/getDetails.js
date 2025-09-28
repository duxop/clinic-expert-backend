const bcrypt = require("bcrypt");
const { prisma } = require("../../config/database");

const getDetails = async (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.userData;
    if (userWithoutPassword.role === "DOCTOR") {
      const doctor = await prisma.doctor.findUnique({
        where: { userId: userWithoutPassword.id },
      });
      userWithoutPassword.doctor = doctor;
    }
    
    return res.status(200).json({
      message: "User details retrieved successfully.",
      user: userWithoutPassword
    });
  } catch (error) {
    // Log detailed error for debugging
    console.error("Error during fetching user details", error);
    // Send appropriate error response
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

module.exports = getDetails;
