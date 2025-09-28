const { prisma } = require("../../config/database");
const razorpayInstance = require("../../config/razorpay");

const createPayment = async (req, res) => {
  const userData = req.userData;
  const { planId, monthly, autopay } = req.body;
  const plan = await prisma.SubscriptionPlan.findUnique({
    where: { id: planId },
  });
  console.log(plan);
  if (!plan) {
    return res.status(404).json({ error: "Plan not found" });
  }
  const amount = monthly ? plan.priceMonthly : plan.priceYearly;
  console.log(amount);

  try {
    if (!autopay) {
      const order = await razorpayInstance.orders.create({
        amount: amount,
        currency: "INR",
        receipt: `invoice_${Date.now()}`,
        notes: userData.Clinic,
      });
      console.log(order);
      return res
        .status(200)
        .json({ order, key_id: process.env.RAZOZRPAY_KEY_ID });
    }
    const subscriptionPlan = monthly
      ? plan.razorPaySubscriptionPlanMonthlyId
      : plan.razorPaySubscriptionPlanYearlyId;
    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: subscriptionPlan,
      customer_notify: 1,
      total_count: 12,
    });
    console.log(subscription);
    return res.status(200).json({ subscription });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = createPayment;
