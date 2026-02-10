const { prisma } = require("../../config/database");

const getAppointmentById = async (req, res) => {
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
        Clinic: true,
        Invoice: {
          include: {
            InvoiceItems: true, // Include all invoice items for each invoice
          },
        },
        AppointmentDocument: true, // Correct relation name for Prescription?
        EPrescription: true,
      },
    });
    
    // Parse prescription items from JSON string to array for frontend
    if (appointment && appointment.EPrescription) {
      try {
        appointment.EPrescription.prescriptionItems = JSON.parse(
          appointment.EPrescription.prescriptions
        );
        // Remove the raw JSON string from response
        delete appointment.EPrescription.prescriptions;
      } catch (error) {
        // If parsing fails, set empty array
        appointment.EPrescription.prescriptionItems = [];
      }
    }
    
    console.log(appointment);
    return res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAppointmentById;
