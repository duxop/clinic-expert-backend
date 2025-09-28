const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: "Basic",
        features: ["Appointments", "Patient Records"],
        priceMonthly: 1179,
        razorPaySubscriptionPlanMonthlyId: "plan_RN2l9PbarOshXT",
        priceYearly: 11790,
        razorPaySubscriptionPlanYearlyId: "plan_RN3Nsao2qJCyRG",
      },
      {
        name: "Premium",
        features: ["Everything in Basic", "Doctor Schedules", "Prescriptions"],
        priceMonthly: 2359,
        priceYearly: 23590,
      },
      {
        name: "Business",
        features: ["Everything in Premium", "Analytics", "Multi-Clinic"],
        priceMonthly: 3539,
        priceYearly: 35390,
      },
    ],
    skipDuplicates: true, // avoids duplicate inserts
  });
}

main()
  .then(() => {
    console.log("Plans seeded ✅");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
