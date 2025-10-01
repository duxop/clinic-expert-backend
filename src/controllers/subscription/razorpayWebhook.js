const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const razorpayWebhook = async (req, res) => {
  const webhookSignature = req.headers["x-razorpay-signature"];
  try {
    const isWebhookvalid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.WEBHOOK_SECRET
    );
    if (isWebhookvalid) console.log("webhook", req.body);
    
    return res.status(200).json({ message: "Webhook verified" });
  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = razorpayWebhook;
