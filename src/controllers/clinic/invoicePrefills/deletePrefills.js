const { prisma } = require("../../../config/database");

const deletePrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { id } = req.params;

    id = parseInt(id)

    const check = await prisma.InvoicePrefills.findUnique({
      where: {
        clinicId,
        id,
      },
    });

    if (!check) return res.status(401).json({ mess: "no such item found." });

    await prisma.InvoicePrefills.delete({
      where: {
        id,
      },
    });
    return res.status(201).json({ invoiceDeleted: true });
  } catch (error) {
    console.error("Error during getting invoice prefills:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deletePrefills;
