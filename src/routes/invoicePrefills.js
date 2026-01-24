const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const getPrefills = require("../controllers/clinic/invoicePrefills/getPrefills");
const addPrefills = require("../controllers/clinic/invoicePrefills/addPrefills");
const editPrefills = require("../controllers/clinic/invoicePrefills/editPrefills");
const deletePrefills = require("../controllers/clinic/invoicePrefills/deletePrefills");
const checkSubscription = require("../middlewares/subscription");

const router = express.Router();

router.get("/", auth, access("RECEPTIONIST"), checkSubscription, getPrefills);
router.post("/", auth, access("RECEPTIONIST"), checkSubscription, addPrefills);
router.patch("/:id", auth, access("RECEPTIONIST"), checkSubscription, editPrefills);
router.delete("/:id", auth, access("RECEPTIONIST"), checkSubscription, deletePrefills);

module.exports = router;
