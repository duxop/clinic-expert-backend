const { prisma } = require("../../config/database");
const bcrypt = require("bcrypt");

const updateStaffPassword = async (req, res) => {
  try {
    const { clinicId } = req?.userData;
    const { id } = req.params;
    const { password } = req.body;

    if (password && password.length < 6)
      return res
        .status(409)
        .json({ error: "Password should be atleast 6 letters long" });
    const getUser = await prisma.User.findUnique({
      where: { id: parseInt(id) },
    });

    if (!getUser || getUser.clinicId != clinicId)
      return res.status(409).json({ error: "User does not exists" });

    const newPassword = await bcrypt.hash(password, 10);

    const udpatedStaff = await prisma.User.update({
      where: { id: parseInt(id) },
      data: { password: newPassword },
    });

    const { password : passwordNew, ...staffwithoutPasword } = udpatedStaff;
    return res.status(201).json({
      message: "User password created successfully",
      data: staffwithoutPasword,
    });
  } catch (error) {
    console.error("Error during adding staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateStaffPassword;
