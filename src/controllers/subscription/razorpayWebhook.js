const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { equals } = require("validator");
const { prisma } = require("../../config/database");

const razorpayWebhook = async (req, res) => {
  const webhookSignature = req.headers["x-razorpay-signature"];
  const { body } = req;
  console.log(body);
  try {
    const isWebhookvalid = validateWebhookSignature(
      JSON.stringify(body),
      webhookSignature,
      process.env.WEBHOOK_SECRET
    );

    if (!isWebhookvalid)
      return res.status(401).json({ message: "Invalid signature" });

    const { notes } = body.payload.payment;
    console.log("notes", notes);
    const currentSubscription = await prisma.Subscription.findUnique({
      where: {
        clinicId: notes.clinicId,
        status: "ACTIVE",
        endDate: { gte: new Date() },
      },
      include: {
        SubscriptionPlan: true,
      },
    });
    console.log("currentSubscription", currentSubscription);
    const planPayedFor = await SubscriptionPlan.findUnique({
      where: {
        id: notes.planId,
        isActive: true,
      },
    });
    if (body.event === "payment.captured") {
      if (!currentSubscription) {
        if (!planPayedFor)
          return res.status(404).json({ error: "Plan not found" });
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30 * (notes.monthly ? 1 : 12));
        console.log("endDate", endDate);
        const subscription = await prisma.Subscription.create({
          data: {
            clinicId,
            planId: notes.planId,
            status: "ACTIVE",
            endDate,
            isTrial: false,
            isMonthly: notes.monthly,
            Payment: {
              create: {
                amount: body.payload.payment.amount,
                currency: body.payload.payment.currency,
                status: body.payload.payment.status,
                paymentId: body.payload.payment.id,
              },
            },
          },
        });
        console.log("subscription", subscription);
        return res.status(200).json({ message: "Webhook verified" });
      }
    }

    const endDate = currentSubscription.endDate + 30 * (notes.monthly ? 1 : 12);

    console.log("endDate", endDate);
    const subscription = await prisma.Subscription.update({
      where: {
        id: currentSubscription.id,
      },
      data: {
        planId: notes.planId,
        status: "ACTIVE",
        endDate,
        isTrial: false,
        isMonthly: notes.monthly,
        Payment: {
          create: {
            amount: body.payload.payment.amount,
            currency: body.payload.payment.currency,
            status: body.payload.payment.status,
            paymentId: body.payload.payment.id,
          },
        },
      },
    });
    console.log("subscription existing", subscription);

    return res.status(200).json({ message: "Webhook verified" });
  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = razorpayWebhook;
