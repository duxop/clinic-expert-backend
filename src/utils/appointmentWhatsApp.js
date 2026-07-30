const { prisma } = require("../config/database");
const normalizeWhatsAppPhone = require("./normalizeWhatsAppPhone");
const {
  consumeWhatsAppQuota,
  refundWhatsAppQuota,
} = require("./consumeWhatsAppQuota");
const sendWhatsAppTemplate = require("./sendWhatsAppTemplate");
const resolveWhatsAppHeaderImage = require("./resolveWhatsAppHeaderImage");
const {
  buildBookingParams,
  buildFeedbackParams,
} = require("./whatsappTemplates");

/** Max feedback WhatsApp templates per patient (lifetime). Booking confirmations are uncapped. */
const MAX_FEEDBACK_WHATSAPP_PER_PATIENT = 3;

/**
 * Send booking WhatsApp once per appointment.
 * Skips if already sent, no phone, or no quota.
 */
const sendBookingWhatsApp = async (appointmentId) => {
  const appointment = await prisma.Appointment.findUnique({
    where: { id: appointmentId },
    include: {
      Patient: true,
      Doctor: true,
      Clinic: true,
    },
  });

  if (!appointment) return { sent: false, reason: "NOT_FOUND" };
  if (appointment.bookingWhatsAppSentAt) {
    return { sent: false, reason: "ALREADY_SENT" };
  }

  const destination = normalizeWhatsAppPhone(appointment.Patient?.phone);
  if (!destination) {
    return { sent: false, reason: "NO_PHONE" };
  }

  const templateId = process.env.GUPSHUP_TEMPLATE_BOOKING_ID;
  if (!templateId) {
    console.warn("GUPSHUP_TEMPLATE_BOOKING_ID not set; skipping booking WhatsApp");
    return { sent: false, reason: "NO_TEMPLATE_ID" };
  }

  const quota = await consumeWhatsAppQuota(appointment.clinicId);
  if (!quota.ok) {
    console.warn(
      `Skipping booking WhatsApp for appointment ${appointmentId}: no quota`
    );
    return { sent: false, reason: "NO_QUOTA" };
  }

  try {
    const params = buildBookingParams({
      patient: appointment.Patient,
      doctor: appointment.Doctor,
      clinic: appointment.Clinic,
      scheduledTime: appointment.scheduledTime,
    });

    const headerImageUrl = resolveWhatsAppHeaderImage(appointment.Clinic);
    if (!headerImageUrl) {
      console.warn(
        `Skipping booking WhatsApp for appointment ${appointmentId}: no header image`
      );
      await refundWhatsAppQuota(appointment.clinicId);
      return { sent: false, reason: "NO_HEADER_IMAGE" };
    }

    await sendWhatsAppTemplate({
      destination,
      templateId,
      params,
      media: {
        type: "image",
        image: { link: headerImageUrl },
      },
    });

    // Atomic once-per-appointment guard
    const marked = await prisma.Appointment.updateMany({
      where: { id: appointmentId, bookingWhatsAppSentAt: null },
      data: { bookingWhatsAppSentAt: new Date() },
    });

    if (marked.count === 0) {
      // Another process already marked it; refund this extra send's quota
      await refundWhatsAppQuota(appointment.clinicId);
      return { sent: false, reason: "ALREADY_SENT" };
    }

    return { sent: true };
  } catch (error) {
    await refundWhatsAppQuota(appointment.clinicId);
    console.error(
      `Failed booking WhatsApp for appointment ${appointmentId}:`,
      error
    );
    return { sent: false, reason: "SEND_FAILED", error };
  }
};

/**
 * Send feedback WhatsApp once per appointment, capped at
 * MAX_FEEDBACK_WHATSAPP_PER_PATIENT successful sends per patient.
 * Booking confirmations are unaffected (sent for every appointment).
 * Marks followUpWhatsAppSentAt when permanently skipping (no phone / no link / limit / stale)
 * so the cron does not retry forever.
 */
const sendFeedbackWhatsApp = async (appointmentId, { markSkipped = true } = {}) => {
  const appointment = await prisma.Appointment.findUnique({
    where: { id: appointmentId },
    include: {
      Patient: true,
      Doctor: true,
      Clinic: true,
    },
  });

  if (!appointment) return { sent: false, reason: "NOT_FOUND" };
  if (appointment.followUpWhatsAppSentAt) {
    return { sent: false, reason: "ALREADY_SENT" };
  }

  const markFollowUpDone = async () => {
    await prisma.Appointment.updateMany({
      where: { id: appointmentId, followUpWhatsAppSentAt: null },
      data: { followUpWhatsAppSentAt: new Date() },
    });
  };

  const releaseFollowUpClaim = async () => {
    await prisma.Appointment.update({
      where: { id: appointmentId },
      data: { followUpWhatsAppSentAt: null },
    });
  };

  const destination = normalizeWhatsAppPhone(appointment.Patient?.phone);
  if (!destination) {
    if (markSkipped) await markFollowUpDone();
    return { sent: false, reason: "NO_PHONE" };
  }

  if (!appointment.Clinic?.feedbackLink) {
    if (markSkipped) await markFollowUpDone();
    return { sent: false, reason: "NO_FEEDBACK_LINK" };
  }

  const templateId = process.env.GUPSHUP_TEMPLATE_FEEDBACK_ID;
  if (!templateId) {
    console.warn("GUPSHUP_TEMPLATE_FEEDBACK_ID not set; skipping feedback WhatsApp");
    return { sent: false, reason: "NO_TEMPLATE_ID" };
  }

  const headerImageUrl = resolveWhatsAppHeaderImage(appointment.Clinic);
  if (!headerImageUrl) {
    console.warn(
      `Skipping feedback WhatsApp for appointment ${appointmentId}: no header image`
    );
    return { sent: false, reason: "NO_HEADER_IMAGE" };
  }

  // Permanent skip if this patient already hit the feedback cap
  if (
    (appointment.Patient?.feedbackWhatsAppSentCount ?? 0) >=
    MAX_FEEDBACK_WHATSAPP_PER_PATIENT
  ) {
    if (markSkipped) await markFollowUpDone();
    return { sent: false, reason: "FEEDBACK_LIMIT_REACHED" };
  }

  // Claim the send slot first so only one worker proceeds
  const claimed = await prisma.Appointment.updateMany({
    where: { id: appointmentId, followUpWhatsAppSentAt: null },
    data: { followUpWhatsAppSentAt: new Date() },
  });

  if (claimed.count === 0) {
    return { sent: false, reason: "ALREADY_SENT" };
  }

  // Reserve a per-patient feedback slot atomically (prevents races across appointments)
  const reserved = await prisma.Patient.updateMany({
    where: {
      id: appointment.patientId,
      feedbackWhatsAppSentCount: { lt: MAX_FEEDBACK_WHATSAPP_PER_PATIENT },
    },
    data: { feedbackWhatsAppSentCount: { increment: 1 } },
  });

  if (reserved.count === 0) {
    // Claim already marks this appointment done; do not retry
    return { sent: false, reason: "FEEDBACK_LIMIT_REACHED" };
  }

  const releasePatientSlot = async () => {
    await prisma.Patient.update({
      where: { id: appointment.patientId },
      data: { feedbackWhatsAppSentCount: { decrement: 1 } },
    });
  };

  const quota = await consumeWhatsAppQuota(appointment.clinicId);
  if (!quota.ok) {
    await releasePatientSlot();
    await releaseFollowUpClaim();
    console.warn(
      `Skipping feedback WhatsApp for appointment ${appointmentId}: no quota`
    );
    return { sent: false, reason: "NO_QUOTA" };
  }

  try {
    const params = buildFeedbackParams({
      patient: appointment.Patient,
      doctor: appointment.Doctor,
      clinic: appointment.Clinic,
    });

    await sendWhatsAppTemplate({
      destination,
      templateId,
      params,
      media: {
        type: "image",
        image: { link: headerImageUrl },
      },
    });

    return { sent: true };
  } catch (error) {
    await refundWhatsAppQuota(appointment.clinicId);
    await releasePatientSlot();
    await releaseFollowUpClaim();
    console.error(
      `Failed feedback WhatsApp for appointment ${appointmentId}:`,
      error
    );
    return { sent: false, reason: "SEND_FAILED", error };
  }
};

module.exports = {
  sendBookingWhatsApp,
  sendFeedbackWhatsApp,
};
