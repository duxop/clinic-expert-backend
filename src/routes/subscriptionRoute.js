const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const createPayment = require("../controllers/subscription/createPayment");
const confirmPayment = require("../controllers/subscription/confirmPayment");
const razorpayWebhook = require("../controllers/subscription/razorpayWebhook");



const router = express.Router();

// router.get("/", auth, getSubscription);
router.post("/payment/create", auth, access("ADMIN"), createPayment);
router.get("/payment/confirm", auth, access("ADMIN"), confirmPayment);
router.post("/payment/webhook", razorpayWebhook);





module.exports = router;
