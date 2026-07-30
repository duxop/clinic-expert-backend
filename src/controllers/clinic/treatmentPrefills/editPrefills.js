const { prisma } = require("../../../config/database");

const editPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { id } = req.params;
    let { name } = req.body;

    id = parseInt(id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id." });
    }

    const existing = await prisma.TreatmentPrefills.findFirst({
      where: { id, clinicId },
    });

    if (!existing) {
      return res.status(404).json({ error: "No such item found." });
    }

    if (name === undefined) {
      return res.status(400).json({ error: "No fields to update." });
    }

    if (typeof name !== "string") {
      return res.status(400).json({ error: "name must be a string." });
    }

    name = name.trim().replace(/[<>]/g, "");
    if (name.length === 0 || name.length > 200) {
      return res.status(400).json({
        error: "name must be between 1 and 200 characters long.",
      });
    }

    const duplicate = await prisma.TreatmentPrefills.findFirst({
      where: {
        clinicId,
        name,
        NOT: { id },
      },
    });

    if (duplicate) {
      return res.status(409).json({ error: "This prefill already exists." });
    }

    const updated = await prisma.TreatmentPrefills.update({
      where: { id },
      data: { name },
    });

    return res.status(200).json({ PrefillData: updated });
  } catch (error) {
    console.error("Error updating treatment prefill:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "This prefill already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = editPrefills;
