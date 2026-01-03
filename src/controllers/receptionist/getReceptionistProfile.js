const { prisma } = require("../../config/database");

const getReceptionistProfile = async (req, res) => {
  try {
    const userId = req.userData.id;

    const receptionist = await prisma.Receptionist.findUnique({
      where: { userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        Address: true,
        Age: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!receptionist) {
      return res.status(404).json({ error: "Receptionist profile not found" });
    }

    return res.status(200).json({ receptionist });
  } catch (error) {
    console.error("Error during getting receptionist profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getReceptionistProfile;
