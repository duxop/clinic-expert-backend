const { prisma } = require("../../../config/database");

const editPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { id } = req.params;
    let { name, amount } = req.body;

    id = parseInt(id);

    if (typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string." });
    }

    name = name.trim();
    name = name.replace(/[<>]/g, "");

    if (name.length === 0 || name.length > 50) {
      return res
        .status(400)
        .json({ error: "Name must be between 1 and 50 characters long." });
    }

    amount = parseFloat(amount);
    if (isNaN(amount)) {
      return res.status(400).json({ error: "Amount must be a valid number." });
    }

    if (amount < 0) {
      return res.status(400).json({ error: "Amount cannot be negative." });
    }

    const check = await prisma.InvoicePrefills.findUnique({
      where: {
        clinicId,
        id,
      },
    });

    if (!check) return res.status(404).json({ error: "No such item found." });

    const updatedInvoicePrefill = await prisma.InvoicePrefills.update({
      where: {
        id,
      },
      data: {
        name,
        amount,
      },
    });

    return res.status(200).json({ PrefillData: updatedInvoicePrefill });
  } catch (error) {
    console.error("Error during updating invoice prefills:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = editPrefills;
