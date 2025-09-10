const { prisma } = require("../../config/database");

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const clinicId = req.userData.clinicId;

    const appointments = await prisma.Appointment.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        Doctor: {
          select: {
            name: true,
          },
        },
        Invoice: true, // Correct relation name for Invoice[]
        Prescription: true, // Correct relation name for Prescription?
        EPrescription: true
      },
    });
    console.log(appointments);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAppointmentById;
