const { prisma } = require("../../../config/database");

const getPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const allPrefills = await prisma.InvoicePrefills.findMany({
      where: {
        clinicId,
      },
    });

    return res.status(201).json({ InvoicePrefills: allPrefills });
  } catch (error) {
    console.error("Error during getting invoice prefills:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getPrefills;
