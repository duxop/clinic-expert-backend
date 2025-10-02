const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: "Basic",
        features: ["Appointments", "Patient Records"],
        oneTimePrice: 1179,
        subscriptionPrice: 999,
        razorPaySubscriptionPlanMonthlyId: "plan_RN2l9PbarOshXT",
        razorPaySubscriptionPlanYearlyId: "plan_RN3Nsao2qJCyRG",
      },
      {
        name: "Premium",
        features: ["Everything in Basic", "Doctor Schedules", "Prescriptions"],
        oneTimePrice: 2359,
        subscriptionPrice: 1999,
      },
      {
        name: "Business",
        features: ["Everything in Premium", "Analytics", "Multi-Clinic"],
        oneTimePrice: 3539,
        subscriptionPrice: 2999,
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
