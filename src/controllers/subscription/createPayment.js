const { prisma } = require("../../config/database");
const razorpayInstance = require("../../config/razorpay");

const createPayment = async (req, res) => {
  const userData = req.userData;
  const { planId, monthly, autopay } = req.body;

  if (!planId) return res.status(400).json({ error: "Invalid request" });

  const plan = await prisma.SubscriptionPlan.findUnique({
    where: { id: planId, isActive: true },
  });
  console.log(plan);
  if (!plan) {
    return res.status(404).json({ error: "Plan not found" });
  }

  const amount = plan.priceMonthly * (monthly ? 1 : 10);
  console.log(amount);

  try {
    if (!autopay) {
      const order = await razorpayInstance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `invoice_${Date.now()}`,
        notes: {
          clinicId: userData.Clinic.id,
          name: userData.Clinic.name,
          planId: plan.id,
          planName: plan.name,
          monthly,
        },
      });
      console.log(order.notes.plan);
      return res.status(200).json({
        type: "order",
        details: order,
        key_id: process.env.RAZOZRPAY_KEY_ID,
      });
    }

    const subscriptionPlan = monthly
      ? plan.razorPaySubscriptionPlanMonthlyId
      : plan.razorPaySubscriptionPlanYearlyId;
    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: subscriptionPlan,
      customer_notify: 1,
      total_count: 24,
      notes: {
        clinicId: userData.Clinic.id,
        name: userData.Clinic.name,
        planId: plan.id,
        planName: plan.name,
        monthly
      },
    });

    return res.status(200).json({
      type: "subscription",
      details: subscription,
      key_id: process.env.RAZOZRPAY_KEY_ID,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = createPayment;
