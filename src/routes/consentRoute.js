const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const getConsent = require("../controllers/consent/getAllConsent");
const addConsent = require("../controllers/consent/addConsent");
const editConsent = require("../controllers/consent/editConsent");
const checkSubscription = require("../middlewares/subscription");

const router = express.Router();

router.get("/", auth, access("RECEPTIONIST"), checkSubscription, getConsent);
router.post("/", auth, access("RECEPTIONIST"), checkSubscription, addConsent);
router.patch(
  "/:id",
  auth,
  access("RECEPTIONIST"),
  checkSubscription,
  editConsent,
);

module.exports = router;
