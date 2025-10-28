const { prisma } = require("../../config/database");

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const clinicId = req.userData.clinicId;

    const appointment = await prisma.Appointment.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Patient: true,
        Doctor: true,
        Invoice: {
          include: {
            InvoiceItems: true, // Include all invoice items for each invoice
          },
        },
        Prescription: true, // Correct relation name for Prescription?
        EPrescription: true,
      },
    });
    console.log(appointment);
    return res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAppointmentById;
