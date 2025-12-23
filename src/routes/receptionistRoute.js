const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");
const getReceptionistProfile = require("../controllers/receptionist/getReceptionistProfile");
const updateReceptionistProfile = require("../controllers/receptionist/updateReceptionistProfile");

const router = express.Router();

router.get("/", auth, access("RECEPTIONIST"), getReceptionistProfile);
router.put("/", auth, access("RECEPTIONIST"), updateReceptionistProfile);

module.exports = router;
