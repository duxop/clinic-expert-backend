const { prisma } = require("../../../config/database");

const getPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const prefills = await prisma.TreatmentPrefills.findMany({
      where: { clinicId },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ TreatmentPrefills: prefills });
  } catch (error) {
    console.error("Error getting treatment prefills:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getPrefills;
