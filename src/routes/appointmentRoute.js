const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const addAppointment = require("../controllers/appointment/addAppointment");
const getAllAppointments = require("../controllers/appointment/getAllAppointments");
const getAppointmentById = require("../controllers/appointment/getAppointmentById");
const invoice = require("../controllers/appointment/invoice");
const invoicePayment = require("../controllers/appointment/payment");

const router = express.Router();

router.post("/add", auth, access("DOCTOR"), addAppointment);
router.get("/", auth, access("RECEPTIONIST"), getAllAppointments);
router.get("/:id", auth, access("RECEPTIONIST"), getAppointmentById);

router.post("/invoice", auth, access("RECEPTIONIST"), invoice);
router.post("/payment", auth, access("RECEPTIONIST"), invoicePayment);

module.exports = router;
