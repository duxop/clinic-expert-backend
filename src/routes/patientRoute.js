const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const getAllPatients = require('../controllers/patient/getAllPatients')
const addPatient = require("../controllers/patient/addPatient");


const router = express.Router();

router.get("/", auth, access("RECEPTIONIST"), getAllPatients);
router.post("/", auth, access("RECEPTIONIST"), addPatient);

module.exports = router;
