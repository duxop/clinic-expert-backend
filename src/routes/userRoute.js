const express = require("express");

const auth = require("../middlewares/auth");
const resetPassword = require("../controllers/user/resetPassword");
const logout = require("../controllers/user/logout");
const getDetails = require("../controllers/user/getDetails");

const router = express.Router();

router.patch("/reset-password", auth, resetPassword);
router.patch("/logout", auth, logout);
router.get("/", auth, getDetails);

module.exports = router;
