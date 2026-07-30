const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");
const checkSubscription = require("../middlewares/subscription");

const getPrefills = require("../controllers/clinic/prescriptionPrefills/getPrefills");
const addPrefills = require("../controllers/clinic/prescriptionPrefills/addPrefills");
const editPrefills = require("../controllers/clinic/prescriptionPrefills/editPrefills");
const deletePrefills = require("../controllers/clinic/prescriptionPrefills/deletePrefills");

const router = express.Router();

router.get("/", auth, access("DOCTOR"), checkSubscription, getPrefills);
router.post("/", auth, access("DOCTOR"), checkSubscription, addPrefills);
router.patch("/:id", auth, access("DOCTOR"), checkSubscription, editPrefills);
router.delete("/:id", auth, access("DOCTOR"), checkSubscription, deletePrefills);

module.exports = router;
