const express = require("express");

const auth = require("../middlewares/auth");
const resetPassword = require("../controllers/user/resetPassword");
const logout = require("../controllers/user/logout");
const getDetails = require("../controllers/user/getDetails");
const checkSubscription = require("../middlewares/subscription");
const uploadUserPP = require("../controllers/user/uploadDoctorPP");
const updateProfilePic = require("../controllers/user/updateDoctorPP");

const router = express.Router();

router.patch("/reset-password", auth, checkSubscription, resetPassword);
router.patch("/logout", auth, logout);
router.get("/", auth, getDetails);
router.post("/uploadProfilePic", auth, uploadUserPP);
router.post("/updateProfilePic", auth, updateProfilePic);

module.exports = router;
