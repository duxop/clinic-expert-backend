const { prisma } = require("../../../config/database");
const razorpayInstance = require("../../../config/razorpay");

const createPayment = async (req, res) => {
  const userData = req.userData;
  const { planId, monthly = true, autopay = false } = req.body;

  if (!planId) return res.status(400).json({ error: "Invalid request" });

  let plan;
  try {
    plan = await prisma.SubscriptionPlan.findFirst({
      where: { id: planId, isActive: true },
    });
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }

  if (!plan) {
    return res.status(404).json({ error: "Plan not found" });
  }

  if (plan.id !== 1) return res.status(401).json({ error: "Plan not active" });

  // Basic is sold as a one-time payment or a monthly subscription only.
  if (autopay && !monthly) {
    return res
      .status(400)
      .json({ error: "Autopay is only available as a monthly subscription" });
  }

  let currentSubscription;
  try {
    currentSubscription = await prisma.Subscription.findFirst({
      where: {
        clinicId: userData.Clinic.id,
        status: "ACTIVE",
        endDate: { gte: new Date() },
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }

  if (
    currentSubscription &&
    currentSubscription.autoPay &&
    currentSubscription.paymentRemaining > 0
  ) {
    return res.status(401).json({
      error: "You are already on a subscription. You can't pay more",
    });
  }

  try {
    if (!autopay) {
      // One-time price is the same whichever billing tab was selected.
      const order = await razorpayInstance.orders.create({
        amount: plan.oneTimePrice * 100,
        currency: "INR",
        receipt: `invoice_${Date.now()}`,
        notes: {
          clinicId: userData.Clinic.id,
          name: userData.Clinic.name,
          planId: plan.id,
          planName: plan.name,
          monthly: true,
          autopay: false,
        },
      });
      return res.status(200).json({
        type: "order",
        details: order,
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    }

    const subscriptionPlan = plan.razorPaySubscriptionPlanMonthlyId;

    const now = Math.floor(Date.now() / 1000);
    const daysBeforeExpiry = 2;

    let startAt = now;

    if (currentSubscription?.endDate) {
      const endAt = Math.floor(
        new Date(currentSubscription.endDate).getTime() / 1000,
      );

      // start daysBeforeExpiry days before expiry
      const desiredStartAt = endAt - daysBeforeExpiry * 24 * 60 * 60;

      // never allow start in the past
      startAt = Math.max(desiredStartAt, now);
    }

    console.log("startAt", startAt);

    const TEN_YEARS_SECONDS = 10 * 365 * 24 * 60 * 60;
    
    if (startAt > now + TEN_YEARS_SECONDS) {
      return res.status(400).json({
        error:
          "Autopay cannot be enabled because your current plan is valid for more than 10 years.",
      });
    }

    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: subscriptionPlan,
      customer_notify: 1,
      total_count: 24,
      start_at: startAt,
      notes: {
        clinicId: userData.Clinic.id,
        name: userData.Clinic.name,
        planId: plan.id,
        planName: plan.name,
        monthly: true,
        autopay: true,
      },
    });

    return res.status(200).json({
      type: "subscription",
      details: subscription,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = createPayment;
