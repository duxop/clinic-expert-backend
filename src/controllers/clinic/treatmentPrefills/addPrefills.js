const { prisma } = require("../../../config/database");

const addPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { name } = req.body;

    if (typeof name !== "string") {
      return res.status(400).json({ error: "name must be a string." });
    }

    name = name.trim().replace(/[<>]/g, "");

    if (name.length === 0 || name.length > 200) {
      return res.status(400).json({
        error: "name must be between 1 and 200 characters long.",
      });
    }

    const existing = await prisma.TreatmentPrefills.findFirst({
      where: { clinicId, name },
    });

    if (existing) {
      return res.status(409).json({ error: "This prefill already exists." });
    }

    const created = await prisma.TreatmentPrefills.create({
      data: { clinicId, name },
    });

    return res.status(201).json({ PrefillData: created });
  } catch (error) {
    console.error("Error creating treatment prefill:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "This prefill already exists." });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = addPrefills;
