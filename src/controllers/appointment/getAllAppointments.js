const { prisma } = require("../../config/database");

const getAllAppointments = async (req, res) => {
  try {
    const clinicId = req.userData.clinicId;

    const appointments = await prisma.Appointment.findMany({
      where: {
        clinicId: clinicId,
      },
      include: {
        Patient: true,
        Doctor: true,
      },
    });
    console.log(appointments);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  // if()
};

module.exports = getAllAppointments;
