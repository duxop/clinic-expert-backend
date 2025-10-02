const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { equals } = require("validator");
const { prisma } = require("../../config/database");

const razorpayWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const { body } = req;
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));
    return res.status(200).json({ message: "Webhook verified" });  //delete later
    
    const isWebhookvalid = validateWebhookSignature(
      JSON.stringify(body),
      webhookSignature,
      process.env.WEBHOOK_SECRET
    );

    if (!isWebhookvalid)
      return res.status(401).json({ message: "Invalid signature" });

    const { notes, amount, currency, order_id, id } =
      body.payload.payment.entity;

    const currentSubscription = await prisma.Subscription.findMany({
      where: {
        clinicId: notes.clinicId,
        status: "ACTIVE",
        endDate: { gte: new Date() },
      },
      include: {
        SubscriptionPlan: true,
        Payment: true,
      },
    });

    const planPayedFor = await prisma.SubscriptionPlan.findUnique({
      where: {
        id: notes.planId,
        isActive: true,
      },
    });

    const endDate = new Date(
      currentSubscription() ? currentSubscription[0].endDate : ""
    );
    endDate.setDate(endDate.getDate() + 30 * (notes.monthly ? 1 : 12));

    console.log("endDate", endDate);

    if (body.event === "payment.captured") {
      if (!currentSubscription) {
        if (!planPayedFor)
          return res.status(404).json({ error: "Plan not found" });

        const subscription = await prisma.Subscription.create({
          data: {
            clinicId,
            planId: notes.planId,
            status: "ACTIVE",
            endDate,
            isTrial: false,
            isMonthly: notes.monthly,
          },
        });
        console.log("subscription", subscription);

        return res.status(200).json({ message: "Webhook verified" });
      }

      const subscription = await prisma.Subscription.update({
        where: {
          id: currentSubscription[0].id,
        },
        data: {
          planId: notes.planId,
          status: "ACTIVE",
          endDate,
          isTrial: false,
          isMonthly: notes.monthly,
        },
      });
      const payment = await prisma.Payment.create({
        data: {
          amount,
          currency,
          status: "SUCCESS",
          payment_id: id,
          order_id,
          subscriptionId: subscription.id,
        },
      });
      console.log("subscription", subscription);
      console.log("payment", payment);
    }

    return res.status(200).json({ message: "Webhook verified" });
  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = razorpayWebhook;
