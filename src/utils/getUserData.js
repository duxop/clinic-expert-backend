const { prisma } = require("../config/database");

const getUserData = async (userData) => {
  const { password, ...userWithoutPassword } = userData;
  if (userWithoutPassword.role !== "RECEPTIONIST") {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: userWithoutPassword.id },
    });
    userWithoutPassword.doctor = doctor;
  }
  return userWithoutPassword;
};

module.exports = getUserData;
