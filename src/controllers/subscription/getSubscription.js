const { prisma } = require("../../config/database");

const getSubscription = async (req, res) => {
  try {
    const { clinicId } = req.userData.Clinic.id;

    const Subscription = await prisma.Subscription.findFirst({
      where: {
        clinicId: clinicId,
        status: "ACTIVE",
      }
    });
    return res.status(200).json({ Subscription });
  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getSubscription;
