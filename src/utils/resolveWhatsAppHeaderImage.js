const DEFAULT_FALLBACK_LOGO_URL =
  "https://clinicxpert-dev.s3.ap-south-1.amazonaws.com/branding/logo-text.png";

/**
 * Resolve the IMAGE header URL for WhatsApp templates.
 * Prefers clinic logo, then GUPSHUP_HEADER_IMAGE_URL, then brand fallback.
 * @param {{ logo?: string|null }|null} [clinic]
 * @returns {string|null}
 */
const resolveWhatsAppHeaderImage = (clinic = null) => {
  const clinicLogo = typeof clinic?.logo === "string" ? clinic.logo.trim() : "";
  if (clinicLogo) return clinicLogo;

  const envFallback =
    typeof process.env.GUPSHUP_HEADER_IMAGE_URL === "string"
      ? process.env.GUPSHUP_HEADER_IMAGE_URL.trim()
      : "";
  if (envFallback) return envFallback;

  return DEFAULT_FALLBACK_LOGO_URL;
};

module.exports = resolveWhatsAppHeaderImage;
