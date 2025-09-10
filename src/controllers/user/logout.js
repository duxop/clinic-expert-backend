const { prisma } = require("../../config/database");
const { verifyEmail } = require("../../utils/dataValidator");

const logout = async (req, res) => {
  const { id } = req.userData;

  await prisma.User.update({
    where: { id },
    data: { JWT: null },
  });

  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
  
  return res.status(200).json({ message: "logged out successfully" });
};

module.exports = logout;
