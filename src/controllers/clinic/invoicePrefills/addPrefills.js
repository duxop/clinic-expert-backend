const { prisma } = require("../../../config/database");

const addPrefills = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    let { id } = req.params;
    let { name, amount } = req.body;

    id = parseInt(id);

    // 🔹 Basic sanitization and validation
    if (typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string." });
    }

    name = name.trim();

    // Remove potentially unsafe characters (optional, safer if user input is untrusted)
    name = name.replace(/[<>]/g, "");

    if (name.length === 0 || name.length > 50) {
      return res
        .status(400)
        .json({ error: "Name must be between 1 and 50 characters long." });
    }

    // Parse and validate amount
    amount = parseFloat(amount);
    if (isNaN(amount)) {
      return res.status(400).json({ error: "Amount must be a valid number." });
    }

    if (amount < 0) {
      return res.status(400).json({ error: "Amount cannot be negative." });
    }

    const check = await prisma.InvoicePrefills.findFirst({
      where: {
        clinicId,
        name,
      },
    });

    if (check) return res.status(404).json({ error: "name already used, give a new name" });

    const createdInvoicePrefill = await prisma.InvoicePrefills.create({
      data: {
        clinicId,
        name,
        amount,
      },
    });
    return res.status(201).json({ PrefillData: createdInvoicePrefill });
  } catch (error) {
    console.error("Error during getting invoice prefills:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = addPrefills;
