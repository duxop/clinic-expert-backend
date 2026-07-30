const { prisma } = require("../../config/database");

const deletePatient = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid patient id" });
    }

    const existing = await prisma.Patient.findFirst({
      where: { id, clinicId, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const patient = await prisma.Patient.update({
      where: { id },
      data: { isDeleted: true },
    });

    return res.status(200).json({
      message: "Patient deleted successfully",
      patient,
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deletePatient;
