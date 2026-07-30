/**
 * Gupshup WhatsApp webhook.
 * Handles delivery reports (message-event) and inbound messages.
 * Configure this URL in Gupshup: POST /whatsapp/webhook
 */
const gupshupWebhook = async (req, res) => {
  try {
    const body = req.body;
    console.log("Gupshup webhook received:", JSON.stringify(body, null, 2));

    // V2 delivery / status events
    if (body?.type === "message-event") {
      const { id, gsId, type: status, destination, payload } = body.payload || {};

      console.log("WhatsApp message status:", {
        messageId: gsId || id,
        whatsappMessageId: gsId ? id : payload?.whatsappMessageId,
        status,
        destination,
        reason: payload?.reason,
        code: payload?.code,
        timestamp: body.timestamp,
      });

      // Acknowledge immediately so Gupshup does not retry
      return res.status(200).json({
        message: "Webhook received",
        status,
        messageId: gsId || id,
      });
    }

    // Inbound user messages
    if (body?.type === "message") {
      console.log("Inbound WhatsApp message:", {
        from: body.payload?.source,
        type: body.payload?.type,
        payload: body.payload?.payload,
      });
      return res.status(200).json({ message: "Webhook received" });
    }

    return res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error("Error in gupshupWebhook:", error);
    // Still 200 so Gupshup does not keep retrying on our processing errors
    return res.status(200).json({ message: "Webhook received" });
  }
};

module.exports = gupshupWebhook;
