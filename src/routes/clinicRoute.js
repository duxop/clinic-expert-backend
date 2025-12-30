const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const getAllStaff = require("../controllers/clinic/getAllStaff");
const addStaff = require("../controllers/clinic/addStaff");
const getDoctor = require("../controllers/clinic/getDoctor");
const updateDoctor = require("../controllers/clinic/updateDoctor");
const deleteStaff = require("../controllers/clinic/deleteStaff");
const updateProfileAdmin = require("../controllers/auth/updateName");
const updateStaffPassword = require("../controllers/clinic/updateStaff");
const generateQRCode = require("../controllers/clinic/generateQRCode");

const router = express.Router();

router.get("/all", auth, access("ADMIN"), getAllStaff);
router.post("/update", auth, updateProfileAdmin);
router.post("/", auth, access("ADMIN"), addStaff);
router.get("/doctor", auth, getDoctor);
router.post("/doctor/update", auth, updateDoctor);
router.get("/:id/qr-code", auth, generateQRCode); // Generate QR code for clinic registration
router.delete("/:id", auth, access("ADMIN"), deleteStaff); //this should return doctor id from doctor table also.
router.post("/:id", auth, access("ADMIN"), updateStaffPassword);


module.exports = router;
