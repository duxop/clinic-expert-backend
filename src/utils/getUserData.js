const { prisma } = require("../config/database");

const getUserData = async (userData) => {
  try {
    const { password, ...userWithoutPassword } = userData;
    if (userWithoutPassword.role !== "RECEPTIONIST") {
      const doctor = await prisma.Doctor.findUnique({
        where: { userId: userWithoutPassword.id },
      });
      userWithoutPassword.doctor = doctor;
    }
    return userWithoutPassword;
  } catch (err) {
    return { error: "Internal server error" };
  }
};

module.exports = getUserData;
