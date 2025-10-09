const { prisma } = require("../../config/database");
const razorpayInstance = require("../../config/razorpay");
const getUserData = require("../../utils/getUserData");

const cancelSubscription = async (req, res) => {
  const { id } = req.userData.Clinic;
  let currentSubscription;
  try {
    currentSubscription = await prisma.Subscription.findFirst({
      where: {
        clinicId: parseInt(id),
        status: "ACTIVE",
        endDate: { gte: new Date() },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error" });
  }

  console.log("currentSubscription", currentSubscription);
  if (currentSubscription && currentSubscription.autoPay) {
    try {
      const subscriptionId = currentSubscription.subscriptionId;
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);

      if (
        subscription.status === "authenticated" &&
        subscription.start_at * 1000 > Date.now()
      ) {
        // Use pause to prevent it from ever starting
        await razorpay.subscriptions.pause(subscriptionId, { pause_at: "now" });
      } else {
        // Regular cancel for active ones
        await razorpay.subscriptions.cancel(subscriptionId, false);
      }

      console.log("subscription", subscription);
      if (subscription?.id) {
        await prisma.Subscription.update({
          where: {
            id: currentSubscription.id,
          },
          data: {
            autoPay: false,
            subscriptionId: null,
            paymentRemaining: 0,
          },
        });
      }
      const { userWithoutPassword, err } = await getUserData(req.userData);

      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      return res
        .status(200)
        .json({ message: "Subscription cancelled", user: userWithoutPassword });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  return res.status(400).json({ error: "Invalid request" });
};

module.exports = cancelSubscription;
