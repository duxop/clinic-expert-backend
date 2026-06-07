const { prisma } = require("../../config/database");

const getConsents = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const allConsents = await prisma.Consent.findMany({
      where: {
        clinicId,
      },
      include: {
        Patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({ Consents: allConsents });
  } catch (error) {
    console.error("Error during getting consent:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getConsents;
