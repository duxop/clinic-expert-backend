const { prisma } = require("../../config/database");
const { verifyNameUpdate } = require("../../utils/dataValidator");

const updateProfileAdmin = async (req, res) => {
  try {
    const { id } = req.userData;
    const { firstName, lastName, err } = verifyNameUpdate(req.body);
    
    if (err) return res.status(err.code).json({ err: err.message });

    const updatedData = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName: firstName,
        lastName: lastName,
      },
    });
    return res
      .status(201)
      .json({ message: "Profile updated successfully", updatedData });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = updateProfileAdmin;
