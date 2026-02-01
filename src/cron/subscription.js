const cron = require("node-cron");
const { prisma } = require("../config/database");


async function handleSubscriptionTask() {
  console.log(`[${new Date().toISOString()}] Running subscription cron job...`);

  try {
    const allActiveSubscriptions = await prisma.subscription.findMany({
      where: { status: "ACTIVE"},
    });
    const currDate = new Date();

    for (const subscription of allActiveSubscriptions) {
      if (subscription.endDate <= currDate) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "EXPIRED" },
        });
      }
    }

    console.log(
      `[${new Date().toISOString()}] Subscription cron job completed successfully`,
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Subscription cron job failed:`,
      error,
    );
  }
}

function initSubscriptionCron() {
  // Run immediately on server startup
  console.log(
    `[${new Date().toISOString()}] Server started - running subscription job on startup...`,
  );
  handleSubscriptionTask();

  // Schedule to run every day at midnight (00:00)
  // Cron expression: '0 0 * * *' = minute 0, hour 0, every day, every month, every day of week
  const job = cron.schedule(
    "0 0 * * *",
    () => {
      handleSubscriptionTask();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // Adjust timezone as needed
    },
  );

  console.log(
    `[${new Date().toISOString()}] Subscription cron job scheduled to run daily at midnight`,
  );

  return job;
}

module.exports = {
  initSubscriptionCron,
  handleSubscriptionTask,
};
