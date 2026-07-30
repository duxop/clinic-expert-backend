const { prisma } = require("../../../config/database");

const deletePrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { id } = req.params;

    id = parseInt(id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id." });
    }

    const existing = await prisma.EPrescriptionPrefills.findFirst({
      where: { id, clinicId },
    });

    if (!existing) {
      return res.status(404).json({ error: "No such item found." });
    }

    await prisma.EPrescriptionPrefills.delete({
      where: { id },
    });

    return res.status(200).json({ prescriptionPrefillDeleted: true });
  } catch (error) {
    console.error("Error deleting prescription prefill:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deletePrefills;
