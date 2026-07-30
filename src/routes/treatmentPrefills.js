const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");
const checkSubscription = require("../middlewares/subscription");

const getPrefills = require("../controllers/clinic/treatmentPrefills/getPrefills");
const addPrefills = require("../controllers/clinic/treatmentPrefills/addPrefills");
const editPrefills = require("../controllers/clinic/treatmentPrefills/editPrefills");
const deletePrefills = require("../controllers/clinic/treatmentPrefills/deletePrefills");

const router = express.Router();

router.get("/", auth, access("RECEPTIONIST"), checkSubscription, getPrefills);
router.post("/", auth, access("RECEPTIONIST"), checkSubscription, addPrefills);
router.patch("/:id", auth, access("RECEPTIONIST"), checkSubscription, editPrefills);
router.delete("/:id", auth, access("RECEPTIONIST"), checkSubscription, deletePrefills);

module.exports = router;
