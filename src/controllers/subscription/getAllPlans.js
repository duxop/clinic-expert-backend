const { prisma } = require("../../config/database");

const getAllPlans = async (req, res) => {
  try {
    const Subscription = await prisma.SubscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        features: true,
        oneTimePrice: true,
        subscriptionPrice: true,
      },
    });
    return res.status(200).json({ Plans : Subscription });
  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllPlans;
