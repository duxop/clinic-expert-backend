const { prisma } = require("../config/database");

/**
 * Atomically consume 1 WhatsApp message from the clinic quota.
 * @param {number} clinicId
 * @returns {Promise<{ ok: boolean, messagesLeft?: number, reason?: string }>}
 */
const consumeWhatsAppQuota = async (clinicId) => {
  try {
    const updated = await prisma.Clinic.updateMany({
      where: {
        id: clinicId,
        messagesLeft: { gt: 0 },
      },
      data: {
        messagesLeft: { decrement: 1 },
      },
    });

    if (updated.count === 0) {
      return { ok: false, reason: "NO_QUOTA" };
    }

    const clinic = await prisma.Clinic.findUnique({
      where: { id: clinicId },
      select: { messagesLeft: true },
    });

    return { ok: true, messagesLeft: clinic?.messagesLeft ?? 0 };
  } catch (error) {
    console.error("Error consuming WhatsApp quota:", error);
    return { ok: false, reason: "ERROR" };
  }
};

/**
 * Refund 1 message to the clinic quota (e.g. after a failed Gupshup send).
 * @param {number} clinicId
 */
const refundWhatsAppQuota = async (clinicId) => {
  try {
    await prisma.Clinic.update({
      where: { id: clinicId },
      data: { messagesLeft: { increment: 1 } },
    });
  } catch (error) {
    console.error("Error refunding WhatsApp quota:", error);
  }
};

module.exports = {
  consumeWhatsAppQuota,
  refundWhatsAppQuota,
};
