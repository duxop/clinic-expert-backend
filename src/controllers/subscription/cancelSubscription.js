const { prisma } = require("../../config/database");
const razorpayInstance = require("../../config/razorpay");
const getUserData = require("../../utils/getUserData");

const cancelSubscription = async (req, res) => {
  const userData = req.userData;
  const currentSubscription = await prisma.Subscription.findMany({
    where: {
      clinicId: userData.Clinic.id,
      status: "ACTIVE",
      endDate: { gte: new Date() },
    },
  });
  if (currentSubscription && currentSubscription.autopay) {
    try {
      const subscriptionId = currentSubscription.subscriptionId;
      const subscription = razorpayInstance.subscriptions.cancel(
        subscriptionId,
        {
          cancel_at_cycle_end: true,
        }
      );
      if (subscription?.id) {
        await prisma.Subscription.update({
          where: {
            id: currentSubscription.id,
          },
          data: {
            autopay: false,
            subscriptionId: null,
            paymentRemaining: 0,
          },
        });
      }
      const userWithoutPassword = getUserData(req.userData);

      return res
        .status(200)
        .json({ message: "Subscription cancelled", user: userWithoutPassword });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = cancelSubscription;
