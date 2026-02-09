const { prisma } = require("../config/database");

const getUserData = async (userData) => {
  try {
    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  } catch (err) {
    return { error: "Internal server error" };
  }
};

module.exports = getUserData;
