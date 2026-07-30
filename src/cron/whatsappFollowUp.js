const cron = require("node-cron");
const { prisma } = require("../config/database");
const { sendFeedbackWhatsApp } = require("../utils/appointmentWhatsApp");

const FOLLOW_UP_DELAY_MS = 20 * 60 * 1000;
const STALE_AFTER_MS = 48 * 60 * 60 * 1000;

async function handleWhatsAppFollowUpTask() {
  const now = new Date();
  const dueBefore = new Date(now.getTime() - FOLLOW_UP_DELAY_MS);
  const staleBefore = new Date(now.getTime() - STALE_AFTER_MS);

  try {
    // Permanently skip stale appointments so they do not retry forever
    await prisma.Appointment.updateMany({
      where: {
        status: "COMPLETED",
        followUpWhatsAppSentAt: null,
        actualEndTime: { lte: staleBefore },
      },
      data: { followUpWhatsAppSentAt: now },
    });

    const dueAppointments = await prisma.Appointment.findMany({
      where: {
        status: "COMPLETED",
        followUpWhatsAppSentAt: null,
        actualEndTime: {
          lte: dueBefore,
          gt: staleBefore,
        },
      },
      select: { id: true },
      take: 50,
      orderBy: { actualEndTime: "asc" },
    });

    for (const appointment of dueAppointments) {
      await sendFeedbackWhatsApp(appointment.id);
    }

    if (dueAppointments.length > 0) {
      console.log(
        `[${now.toISOString()}] WhatsApp follow-up cron processed ${dueAppointments.length} appointment(s)`
      );
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] WhatsApp follow-up cron failed:`,
      error
    );
  }
}

function initWhatsAppFollowUpCron() {
  console.log(
    `[${new Date().toISOString()}] Scheduling WhatsApp follow-up cron (every minute)`
  );

  const job = cron.schedule(
    "* * * * *",
    () => {
      handleWhatsAppFollowUpTask();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );

  return job;
}

module.exports = {
  initWhatsAppFollowUpCron,
  handleWhatsAppFollowUpTask,
};
