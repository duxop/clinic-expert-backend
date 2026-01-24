const express = require("express");

const auth = require("../middlewares/auth");
const access = require("../middlewares/access");

const addAppointment = require("../controllers/appointment/addAppointment");
const getAllAppointments = require("../controllers/appointment/getAllAppointments");
const getAppointmentById = require("../controllers/appointment/getAppointmentById");
const invoice = require("../controllers/appointment/invoice");
const invoicePayment = require("../controllers/appointment/payment");
const deleteAppointment = require("../controllers/appointment/deleteAppointment");
const updateAppointmentStatus = require("../controllers/appointment/updateAppointmentStatus");
const savePrescription = require("../controllers/appointment/savePrescription");
const checkSubscription = require("../middlewares/subscription");

const router = express.Router();

router.post("/add", auth, access("DOCTOR"), checkSubscription, addAppointment);
router.get(
  "/",
  auth,
  access("RECEPTIONIST"),
  checkSubscription,
  getAllAppointments,
);
router.patch(
  "/:id/status",
  auth,
  access("DOCTOR"),
  checkSubscription,
  updateAppointmentStatus,
);
router.post(
  "/:id/prescription",
  auth,
  access("DOCTOR"),
  checkSubscription,
  savePrescription,
);
router.get(
  "/:id",
  auth,
  access("RECEPTIONIST"),
  checkSubscription,
  getAppointmentById,
);
router.delete(
  "/:id",
  auth,
  access("RECEPTIONIST"),
  checkSubscription,
  deleteAppointment,
);

router.post(
  "/invoice",
  auth,
  access("RECEPTIONIST"),
  checkSubscription,
  invoice,
);
router.post(
  "/payment",
  auth,
  access("RECEPTIONIST"),
  checkSubscription,
  invoicePayment,
);

module.exports = router;
