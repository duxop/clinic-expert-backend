const { prisma } = require("../../config/database");

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const clinicId = req.userData.clinicId;

    const appointment = await prisma.Appointment.findUnique({
      where: {
        id: parseInt(id),
        clinicId,
      },
      include: {
        Patient: true,
        Doctor: true,
        Invoice: {
          include: {
            InvoiceItems: true, // Include all invoice items for each invoice
          },
        },
        AppointmentDocument: true, // Correct relation name for AppointmentDocument?
        EPrescription: true,
      },
    });
    if (!appointment)
      return res.status(404).json({ error: "No such appointment" });
    console.log(appointment);
    if (appointment.status === "PENDING") {
      await prisma.Appointment.delete({
        where: {
          id: parseInt(id),
          clinicId,
        },
      });
      return res.status(200).json({ deleted: true });
    }
    const cancelAppointment = await prisma.Appointment.update({
      where: {
        id: parseInt(id),
        clinicId,
      },
      data: {
        status: "CANCELLED",
      },
      include: {
        Patient: true,
        Doctor: true,
      },
    });
    return res
      .status(200)
      .json({ deleted: false, appointment: cancelAppointment });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deleteAppointment;
