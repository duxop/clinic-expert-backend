const GUPSHUP_MSG_URL = "https://api.gupshup.io/wa/api/v1/msg";

/**
 * Send a WhatsApp message via Gupshup.
 * @param {string|number} destination - Recipient phone with country code (e.g. 917414007642)
 * @param {string|object} message - Plain text, or a Gupshup message object ({ type, text, ... })
 * @returns {Promise<{ status: string, messageId: string }>}
 */
const sendWhatsAppMessage = async (destination, message) => {
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

  if (message === undefined || message === null || message === "") {
    throw new Error("message is required");
  }

  const messagePayload =
    typeof message === "string"
      ? { type: "text", text: message }
      : message;

  const body = new URLSearchParams({
    channel: "whatsapp",
    source: String(source),
    destination: String(destination),
    "src.name": srcName,
    message: JSON.stringify(messagePayload),
  });

  const response = await fetch(GUPSHUP_MSG_URL, {
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
      data?.message || data?.error || `Gupshup send failed (${response.status})`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  console.log("WhatsApp message submitted:", data);
  return data;
};

module.exports = sendWhatsAppMessage;
