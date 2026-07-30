const express = require("express");
const gupshupWebhook = require("../controllers/whatsapp/gupshupWebhook");

const router = express.Router();

router.post("/webhook", gupshupWebhook);

module.exports = router;
