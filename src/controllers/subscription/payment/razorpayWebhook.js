const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { prisma } = require("../../../config/database");

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

    if (
      body.event === "payment.captured" ||
      body.event === "subscription.charged"
    ) {
      if (
        body.event === "payment.captured" &&
        body.payload.payment.entity.notes.length === 0
      ) {
        return res.status(200).json({ message: "Webhook verified" });
      }

      const { notes } =
        body.event === "payment.captured"
          ? body.payload.payment.entity
          : body.payload.subscription.entity;

      const { amount, currency, order_id, id } = body.payload.payment.entity;

      let { clinicId, planId, monthly } = notes;

      clinicId = parseInt(clinicId);
      planId = parseInt(planId);
      monthly = monthly === "1";

      return await prisma
        .$transaction(async (prisma) => {
          const currentSubscription = await prisma.Subscription.findFirst({
            where: {
              clinicId,
              status: "ACTIVE",
              endDate: { gte: new Date() },
            },
          });

          const planPayedFor = await prisma.SubscriptionPlan.findFirst({
            where: {
              id: planId,
              isActive: true,
            },
          });

          const paymentCaptured = await prisma.Payment.findUnique({
            where: {
              payment_id: id,
            },
          });

          if (paymentCaptured) {
            throw new Error("Payment already captured");
          }

          const baseDate = currentSubscription
            ? new Date(currentSubscription.endDate)
            : new Date();
          baseDate.setMonth(baseDate.getMonth() + (planId === 1 ? 120 : (monthly ? 1 : 12)));
          const endDate = baseDate;

          let subscription;

          if (!currentSubscription) {
            if (!planPayedFor) {
              throw new Error("Plan not found");
            }

            subscription = await prisma.Subscription.create({
              data: {
                clinicId,
                planId,
                status: "ACTIVE",
                endDate,
                isTrial: false,
                isMonthly: monthly,
              },
            });
          } else {
            subscription = await prisma.Subscription.update({
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
          }

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
        })
        .then(() => {
          if (body.event === "payment.captured")
            return res.status(200).json({ message: "Webhook verified" });
        })
        .catch((err) => {
          console.error(err);
          if (err.message === "Payment already captured") {
            return res.status(200).json({ message: err.message });
          } else if (err.message === "Plan not found") {
            return res.status(404).json({ error: err.message });
          } else {
            return res.status(500).json({ error: "Internal server error" });
          }
        });
    }

    if (
      body.event === "subscription.authenticated" ||
      body.event === "subscription.charged"
    ) {
      const {
        id: subscriptionId,
        start_at,
        total_count,
        paid_count,
        notes,
      } = body.payload.subscription.entity;

      let { clinicId, planId, monthly } = notes;

      clinicId = parseInt(clinicId);
      planId = parseInt(planId);
      monthly =
        monthly === true ||
        monthly === "true" ||
        monthly === 1 ||
        monthly === "1";


      const currentSubscription = await prisma.Subscription.findFirst({
        where: {
          clinicId: clinicId,
          status: "ACTIVE",
          endDate: { gte: new Date() },
        },
        include: {
          SubscriptionPlan: true,
          Payment: true,
        },
      });

      if (!currentSubscription) {
        const startDate = new Date(start_at * 1000);
        const endDate = new Date(
          startDate.getTime() + (monthly ? 30 : 365) * 24 * 60 * 60 * 1000
        );
        const subscription = await prisma.Subscription.create({
          data: {
            clinicId,
            planId,
            status: "ACTIVE",
            startDate,
            endDate,
            autoPay: true,
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
          autoPay: true,
          isTrial: false,
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
    return res.status(202).json({ error: "Internal server error" });
  }
};

module.exports = razorpayWebhook;
