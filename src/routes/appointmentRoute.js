const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const addAppointment = require("../controllers/appointment/addAppointment");
const getAllAppointments = require("../controllers/appointment/getAllAppointments");
const getAppointmentById = require("../controllers/appointment/getAppointmentById");

const router = express.Router();

router.post("/add", auth, access("DOCTOR"), addAppointment);
router.get("/", auth, access("RECEPTIONIST"), getAllAppointments);
router.get("/:id", auth, access("RECEPTIONIST"), getAppointmentById);

module.exports = router;
