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

  console.log(currentSubscription);
  if (currentSubscription && currentSubscription.autoPay) {
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
      const {userWithoutPassword, err} = await getUserData(req.userData);

      if(err){
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
