/**
 * Normalize a phone number for Gupshup WhatsApp.
 * Strips non-digits; prefixes 91 for 10-digit Indian numbers.
 * @param {string|null|undefined} phone
 * @returns {string|null}
 */
const normalizeWhatsAppPhone = (phone) => {
  if (!phone || typeof phone !== "string") return null;

  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length >= 10) return digits;

  return null;
};

module.exports = normalizeWhatsAppPhone;
