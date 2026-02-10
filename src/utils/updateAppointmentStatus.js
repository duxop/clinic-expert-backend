const { prisma } = require("../config/database");

/**
 * Validates if a status transition is allowed
 */
const canTransition = (currentStatus, newStatus) => {
  const allowedTransitions = {
    PENDING: ["STARTED", "CONFIRMED", "CANCELLED"],
    CONFIRMED: ["STARTED", "CANCELLED"],
    ACTIVE: ["STARTED", "COMPLETED", "CANCELLED"],
    STARTED: ["COMPLETED"],
    COMPLETED: [], // Terminal state
    CANCELLED: [], // Terminal state
  };

  return (
    allowedTransitions[currentStatus]?.includes(newStatus) || false
  );
};

/**
 * Validates status value
 */
const isValidStatus = (status) => {
  const validStatuses = [
    "PENDING",
    "CONFIRMED",
    "ACTIVE",
    "STARTED",
    "COMPLETED",
    "CANCELLED",
  ];
  return validStatuses.includes(status);
};

/**
 * Updates appointment status with validation and automatic timestamp management
 * @param {number} appointmentId - The appointment ID
 * @param {string} newStatus - The new status to set
 * @param {number} clinicId - The clinic ID for authorization
 * @param {object} existingAppointment - Optional: existing appointment data to avoid extra query
 * @param {boolean} validateTransition - Whether to validate status transitions (default: true)
 * @returns {Promise<object>} Updated appointment with all associations
 */
const updateAppointmentStatus = async (
  appointmentId,
  newStatus,
  clinicId,
  existingAppointment = null,
  validateTransition = true
) => {
  // Validate status value
  if (!isValidStatus(newStatus)) {
    throw new Error("Invalid status value");
  }

  // Get existing appointment if not provided
  if (!existingAppointment) {
    existingAppointment = await prisma.Appointment.findUnique({
      where: {
        id: parseInt(appointmentId),
        clinicId,
      },
    });

    if (!existingAppointment) {
      throw new Error("Appointment not found");
    }
  }

  // Validate status transition if requested
  if (validateTransition && !canTransition(existingAppointment.status, newStatus)) {
    throw new Error(
      `Cannot transition from ${existingAppointment.status} to ${newStatus}`
    );
  }

  // Prepare update data
  const updateData = {
    status: newStatus,
  };

  // Automatically set timestamps
  if (newStatus === "STARTED" && !existingAppointment.actualStartTime) {
    updateData.actualStartTime = new Date();
  }

  if (newStatus === "COMPLETED" && !existingAppointment.actualEndTime) {
    updateData.actualEndTime = new Date();
  }

  // Update appointment
  const appointment = await prisma.Appointment.update({
    where: {
      id: parseInt(appointmentId),
      clinicId,
    },
    data: updateData,
    include: {
      Patient: true,
      Doctor: true,
      Invoice: {
        include: {
          InvoiceItems: true,
        },
      },
      Prescription: true,
      EPrescription: true,
    },
  });

  return appointment;
};

module.exports = {
  updateAppointmentStatus,
  canTransition,
  isValidStatus,
};



