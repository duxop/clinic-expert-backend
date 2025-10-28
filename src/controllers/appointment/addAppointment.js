const { prisma } = require("../../config/database");

const addAppointment = async (req, res) => {
  try {
    const {
      scheduledTime = new Date(),
      duration = 15,
      patientId,
      doctorId,
    } = req.body;

    const { clinicId, id: createdById } = req.userData;

    const patient = await prisma.Patient.findFirst({
      where: {
        id: patientId,
      },
    });

    if (!patient) return res.status(404).json({ err: "Patient not found" });

    const doctor = await prisma.Doctor.findFirst({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) return res.status(404).json({ err: "Doctor not found" });

    const appointment = await prisma.Appointment.create({
      data: {
        scheduledTime,
        duration,
        status: "PENDING",
        patientId,
        doctorId,
        clinicId,
        createdById,
        Invoice: {
          create: { lastUpdatedById: createdById },
        },
      },
      include: {
        Patient: true,
        Doctor: true,
      },
    });

    console.log(appointment);
    return res.status(200).json({ appointment });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = addAppointment;
