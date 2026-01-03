const { prisma } = require("../../config/database");

const getClinicDetails = async (req, res) => {
  try {
    const clinicId = req.userData.clinicId;

    const clinic = await prisma.Clinic.findUnique({
      where: { id: clinicId },
      select: {
        email: true,
        name: true,
        address: true,
        phone: true,
        workHours: true,
        logo: true,
      },
    });

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    return res.status(200).json({ clinic });
  } catch (error) {
    console.error("Error during getting clinic details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getClinicDetails;

