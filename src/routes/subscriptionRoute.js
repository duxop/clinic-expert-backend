const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const createPayment = require("../controllers/subscription/createPayment");
const confirmPayment = require("../controllers/subscription/confirmPayment");
const razorpayWebhook = require("../controllers/subscription/razorpayWebhook");
const getSubscription = require("../controllers/subscription/getSubscription");
const cancelSubscription = require("../controllers/subscription/cancelSubscription");

const router = express.Router();

router.get("/", auth, getSubscription);
router.post("/payment/create", auth, access("ADMIN"), createPayment);
router.get("/payment/confirm", auth, access("ADMIN"), confirmPayment);
router.post("/payment/webhook", razorpayWebhook);
router.post("/cancel", auth, access("ADMIN"), cancelSubscription);

module.exports = router;
