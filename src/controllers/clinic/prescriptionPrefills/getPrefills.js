const { prisma } = require("../../../config/database");

const VALID_FIELDS = ["SYMPTOMS", "DIAGNOSIS", "PRESCRIPTIONS", "ADVICE"];

const getPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const { field } = req.query;

    const where = { clinicId };

    if (field !== undefined) {
      if (!VALID_FIELDS.includes(field)) {
        return res.status(400).json({
          error: `field must be one of: ${VALID_FIELDS.join(", ")}`,
        });
      }
      where.field = field;
    }

    const prefills = await prisma.EPrescriptionPrefills.findMany({
      where,
      orderBy: [{ field: "asc" }, { value: "asc" }],
    });

    return res.status(200).json({ PrescriptionPrefills: prefills });
  } catch (error) {
    console.error("Error getting prescription prefills:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getPrefills;
