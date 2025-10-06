const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { prisma } = require("../../config/database");

const razorpayWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const { body } = req;
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    const isWebhookvalid = validateWebhookSignature(
      JSON.stringify(body),
      webhookSignature,
      process.env.WEBHOOK_SECRET
    );

    if (!isWebhookvalid)
      return res.status(401).json({ message: "Invalid signature" });

    if (body.event === "payment.captured") {
      const { notes, amount, currency, order_id, id } =
        body.payload.payment.entity;
      const { clinicId, planId, monthly } = notes;

      const currentSubscription = await prisma.Subscription.findFirst({
        where: {
          clinicId,
          status: "ACTIVE",
          endDate: { gte: new Date() },
        },
        include: {
          SubscriptionPlan: true,
          Payment: true,
        },
      });

      const planPayedFor = await prisma.SubscriptionPlan.findFirst({
        where: {
          id: planId,
          isActive: true,
        },
      });

      const baseDate = currentSubscription
        ? new Date(currentSubscription.endDate)
        : new Date();
      baseDate.setDate(baseDate.getDate() + 30 * (monthly ? 1 : 12));
      const endDate = baseDate;

      console.log("endDate", endDate);

      if (!currentSubscription) {
        if (!planPayedFor)
          return res.status(404).json({ error: "Plan not found" });

        const subscription = await prisma.Subscription.create({
          data: {
            clinicId,
            planId,
            status: "ACTIVE",
            endDate,
            isTrial: false,
            isMonthly: monthly,
          },
        });
        console.log("subscription", subscription);

        return res.status(200).json({ message: "Webhook verified" });
      }

      const subscription = await prisma.Subscription.update({
        where: {
          id: currentSubscription.id,
        },
        data: {
          planId,
          status: "ACTIVE",
          endDate,
          isTrial: false,
          isMonthly: monthly,
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
      return res.status(200).json({ message: "Webhook verified" });
    }

    if (body.event === "subscription.authenticated") {
      const {
        id: subscriptionId,
        total_count,
        paid_count,
      } = body.payload.subscription.entity;

      const currentSubscription = await prisma.Subscription.findFirst({
        where: {
          clinicId,
          status: "ACTIVE",
          endDate: { gte: new Date() },
        },
        include: {
          SubscriptionPlan: true,
          Payment: true,
        },
      });
      
      if (!currentSubscription) {
        const subscription = await prisma.Subscription.create({
          data: {
            clinicId,
            planId,
            status: "ACTIVE",
            endDate,
            autoRenew: true,
            subscriptionId,
            paymentRemaining: total_count - paid_count,
            isTrial: false,
            isMonthly: monthly,
          },
        });
        console.log("subscription", subscription);
        return res.status(200).json({ message: "Webhook verified" });
      }

      const subscription = await prisma.Subscription.update({
        where: {
          id: currentSubscription.id,
        },
        data: {
          autoRenew: true,
          subscriptionId: subscriptionId,
          paymentRemaining: total_count - paid_count,
        },
      });
      console.log("subscription", subscription);
      return res.status(200).json({ message: "Webhook verified" });
    }

    return res.status(200).json({ message: "Webhook verified" });
  } catch (error) {
    console.error("Error in razorpayWebhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = razorpayWebhook;
