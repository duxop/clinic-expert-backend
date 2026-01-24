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
const getClinicDetails = require("../controllers/clinic/getClinicDetails");
const updateClinicDetails = require("../controllers/clinic/updateClinicDetails");
const checkSubscription = require("../middlewares/subscription");

const router = express.Router();

router.get("/all", auth, access("ADMIN"), checkSubscription, getAllStaff);
router.post("/update", auth, checkSubscription, updateProfileAdmin);
router.post("/", auth, access("ADMIN"), checkSubscription, addStaff);
router.get("/doctor", auth, checkSubscription, getDoctor);
router.post("/doctor/update", auth, checkSubscription, updateDoctor);
router.get("/:id/qr-code", auth, checkSubscription, generateQRCode); // Generate QR code for clinic registration
router.get("/", auth, checkSubscription, getClinicDetails); // All authenticated users can view their clinic details
router.put("/", auth, access("ADMIN"), checkSubscription, updateClinicDetails); // Only ADMIN can update clinic details
router.delete("/:id", auth, access("ADMIN"), checkSubscription, deleteStaff); //this should return doctor id from doctor table also.
router.post(
  "/:id",
  auth,
  access("ADMIN"),
  checkSubscription,
  updateStaffPassword,
);

module.exports = router;
