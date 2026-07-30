const { prisma } = require("../../../config/database");

const VALID_FIELDS = ["SYMPTOMS", "DIAGNOSIS", "PRESCRIPTIONS", "ADVICE"];

const addPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { value, field } = req.body;

    if (typeof value !== "string") {
      return res.status(400).json({ error: "value must be a string." });
    }

    value = value.trim();
    value = value.replace(/[<>]/g, "");

    if (value.length === 0 || value.length > 2000) {
      return res.status(400).json({
        error: "value must be between 1 and 2000 characters long.",
      });
    }

    if (!VALID_FIELDS.includes(field)) {
      return res.status(400).json({
        error: `field must be one of: ${VALID_FIELDS.join(", ")}`,
      });
    }

    const existing = await prisma.EPrescriptionPrefills.findFirst({
      where: { clinicId, field, value },
    });

    if (existing) {
      return res.status(409).json({ error: "This prefill already exists." });
    }

    const created = await prisma.EPrescriptionPrefills.create({
      data: { clinicId, field, value },
    });

    return res.status(201).json({ PrefillData: created });
  } catch (error) {
    console.error("Error creating prescription prefill:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "This prefill already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = addPrefills;
