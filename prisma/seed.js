const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      id: 1,
      name: "Basic",
      features: [
        "Appointment Management",
        "Patient Management",
        "Digital Prescription (EMR)",
        "Billing",
        "Data Security",
      ],
      oneTimePrice: 9990,
      subscriptionPrice: 999,
      razorPaySubscriptionPlanMonthlyId: "plan_RR1NjkwOJrJgTL",
      razorPaySubscriptionPlanYearlyId: "plan_RR1O2xBsBOQl9j",
    },
    {
      id: 2,
      name: "Premium",
      features: ["Reports Export", "SMS Updates", "Email communication"],
      oneTimePrice: 2359,
      subscriptionPrice: 1999,
    },
    {
      id: 3,
      name: "Business",
      features: [
        "Inventory Management",
        "Analytics Dashboard",
        "Integrated Online Payments",
        "Multi-Clinic",
        "Business Management",
      ],
      oneTimePrice: 3539,
      subscriptionPrice: 2999,
    },
  ];

  for (const plan of plans) {
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: plan.id },
    });

    if (existingPlan) {
      await prisma.subscriptionPlan.update({
        where: { id: plan.id },
        data: {
          name: plan.name,
          features: plan.features,
          oneTimePrice: plan.oneTimePrice,
          subscriptionPrice: plan.subscriptionPrice,
          razorPaySubscriptionPlanMonthlyId:
            plan.razorPaySubscriptionPlanMonthlyId,
          razorPaySubscriptionPlanYearlyId:
            plan.razorPaySubscriptionPlanYearlyId,
        },
      });
      console.log(`🔄 Updated plan (ID: ${plan.id}, Name: ${plan.name})`);
    } else {
      await prisma.subscriptionPlan.create({ data: plan });
      console.log(`🆕 Created plan (ID: ${plan.id}, Name: ${plan.name})`);
    }
  }

  // Mark any plans in the database that are not in the plans array as inactive
  const planIds = plans.map((plan) => plan.id);
  const allPlansInDb = await prisma.subscriptionPlan.findMany({
    select: { id: true },
  });
  
  const plansToDeactivate = allPlansInDb.filter(
    (dbPlan) => !planIds.includes(dbPlan.id)
  );

  for (const planToDeactivate of plansToDeactivate) {
    await prisma.subscriptionPlan.update({
      where: { id: planToDeactivate.id },
      data: { isActive: false },
    });
    console.log(`🚫 Deactivated plan (ID: ${planToDeactivate.id})`);
  }

  console.log("\n✅ Plans seeded/updated successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding plans:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
