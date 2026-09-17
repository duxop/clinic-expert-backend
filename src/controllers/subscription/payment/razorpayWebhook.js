const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { prisma } = require("../../../config/database");

// How long a one-time Basic payment keeps the clinic active.
const ONE_TIME_PLAN_MONTHS = 120;

// Order notes keep JSON types (true); subscription notes arrive as "1"/"0".
const isTrueNote = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

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
      // Subscription payments (they carry an invoice) are handled by
      // subscription.charged, so payment.captured only handles one-time orders.
      if (
        body.event === "payment.captured" &&
        (body.payload.payment.entity.notes.length === 0 ||
          body.payload.payment.entity.invoice_id)
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
      monthly = isTrueNote(monthly);

      try {
        await prisma.$transaction(async (prisma) => {
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
          // A subscription charge pays for one billing cycle; a one-time
          // Basic payment pays for ONE_TIME_PLAN_MONTHS.
          let monthsPaidFor = monthly ? 1 : 12;
          if (body.event === "payment.captured" && planId === 1)
            monthsPaidFor = ONE_TIME_PLAN_MONTHS;
          baseDate.setMonth(baseDate.getMonth() + monthsPaidFor);
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
        });
      } catch (err) {
        console.error(err);
        if (err.message === "Payment already captured") {
          // A retried subscription.charged still falls through to sync
          // paymentRemaining below, so only payment.captured stops here.
          if (body.event === "payment.captured")
            return res.status(200).json({ message: err.message });
        } else if (err.message === "Plan not found") {
          return res.status(404).json({ error: err.message });
        } else {
          return res.status(500).json({ error: "Internal server error" });
        }
      }

      // subscription.charged continues to the block below, which responds.
      if (body.event === "payment.captured")
        return res.status(200).json({ message: "Webhook verified" });
    }

    if (
      body.event === "subscription.authenticated" ||
      body.event === "subscription.charged"
    ) {
      const {
        id: subscriptionId,
        total_count,
        paid_count,
        notes,
      } = body.payload.subscription.entity;

      const clinicId = parseInt(notes.clinicId);

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

      // No active plan: access is only granted once subscription.charged
      // records the first payment (above), which then links autopay here.
      if (!currentSubscription) {
        return res.status(200).json({ message: "Webhook verified" });
      }

      // If a retried charge landed after the old plan expired, the charge
      // created a new row; move the Razorpay subscription onto it.
      await prisma.Subscription.updateMany({
        where: { subscriptionId, id: { not: currentSubscription.id } },
        data: { subscriptionId: null },
      });

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
