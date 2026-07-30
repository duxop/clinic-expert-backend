const GUPSHUP_TEMPLATE_URL = "https://api.gupshup.io/wa/api/v1/template/msg";

/**
 * Send a WhatsApp template message via Gupshup.
 * @param {object} options
 * @param {string|number} options.destination - Recipient phone with country code
 * @param {string} options.templateId - Gupshup / Meta template ID
 * @param {string[]} options.params - Ordered template body params
 * @param {object} [options.media] - Optional media header, e.g. { type: "image", image: { link } }
 * @returns {Promise<{ status: string, messageId: string }>}
 */
const sendWhatsAppTemplate = async ({
  destination,
  templateId,
  params = [],
  media = null,
}) => {
  const apiKey = process.env.GUPSHUP_API_KEY;
  const source = process.env.GUPSHUP_SOURCE;
  const srcName = process.env.GUPSHUP_SRC_NAME;

  if (!apiKey || !source || !srcName) {
    throw new Error(
      "Missing Gupshup config. Set GUPSHUP_API_KEY, GUPSHUP_SOURCE, and GUPSHUP_SRC_NAME."
    );
  }

  if (!destination) {
    throw new Error("destination is required");
  }

  if (!templateId) {
    throw new Error("templateId is required");
  }

  const body = new URLSearchParams({
    channel: "whatsapp",
    source: String(source),
    destination: String(destination),
    "src.name": srcName,
    template: JSON.stringify({ id: templateId, params }),
  });

  if (media) {
    body.append("message", JSON.stringify(media));
  }

  const response = await fetch(GUPSHUP_TEMPLATE_URL, {
    method: "POST",
    headers: {
      apikey: apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        `Gupshup template send failed (${response.status})`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  console.log("WhatsApp template submitted:", data);
  return data;
};

module.exports = sendWhatsAppTemplate;
