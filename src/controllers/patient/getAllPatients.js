const { prisma } = require("../../config/database");

const getAllPatients = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const allPatients = await prisma.Patient.findMany({
      where: {
        clinicId,
      },
    });

    return res.status(201).json({ Patient: allPatients });
  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllPatients;
