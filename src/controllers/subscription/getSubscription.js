const { prisma } = require("../../config/database");

const getSubscription = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ Subscription: req.userData.Clinic.Subscription });
  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getSubscription;
