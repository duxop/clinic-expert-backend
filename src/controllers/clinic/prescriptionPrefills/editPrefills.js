const { prisma } = require("../../../config/database");

const VALID_FIELDS = ["SYMPTOMS", "DIAGNOSIS", "PRESCRIPTIONS", "ADVICE"];

const editPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { id } = req.params;
    let { value, field } = req.body;

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

    const updateData = {};

    if (value !== undefined) {
      if (typeof value !== "string") {
        return res.status(400).json({ error: "value must be a string." });
      }
      value = value.trim().replace(/[<>]/g, "");
      if (value.length === 0 || value.length > 2000) {
        return res.status(400).json({
          error: "value must be between 1 and 2000 characters long.",
        });
      }
      updateData.value = value;
    }

    if (field !== undefined) {
      if (!VALID_FIELDS.includes(field)) {
        return res.status(400).json({
          error: `field must be one of: ${VALID_FIELDS.join(", ")}`,
        });
      }
      updateData.field = field;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    const nextValue = updateData.value ?? existing.value;
    const nextField = updateData.field ?? existing.field;

    const duplicate = await prisma.EPrescriptionPrefills.findFirst({
      where: {
        clinicId,
        field: nextField,
        value: nextValue,
        NOT: { id },
      },
    });

    if (duplicate) {
      return res.status(409).json({ error: "This prefill already exists." });
    }

    const updated = await prisma.EPrescriptionPrefills.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({ PrefillData: updated });
  } catch (error) {
    console.error("Error updating prescription prefill:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "This prefill already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = editPrefills;
