const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const getAllPatients = require('../controllers/patient/getAllPatients')
const addPatient = require("../controllers/patient/addPatient");
const editPatient = require("../controllers/patient/editPatient");
const deletePatient = require("../controllers/patient/deletePatient");
const registerPatientPublic = require("../controllers/patient/registerPatientPublic");
const checkSubscription = require("../middlewares/subscription");


const router = express.Router();

router.get("/", auth, access("RECEPTIONIST"), checkSubscription, getAllPatients);
router.post("/", auth, access("RECEPTIONIST"), checkSubscription, addPatient);
router.patch("/:id", auth, access("RECEPTIONIST"), checkSubscription, editPatient);
router.delete("/:id", auth, access("RECEPTIONIST"), checkSubscription, deletePatient);
// Public route for QR code registration (no auth required)
router.post("/register/:clinicId", registerPatientPublic);

module.exports = router;
