const { prisma } = require("../../config/database");

const addConsent = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const {
      doctorId,
      patientId,
      dateTime,
      Treatment,
      comments,
      Medication,
      Remarks,
    } = req.body;

    // Validation
    if (!doctorId || !patientId || !dateTime || !Treatment) {
      return res.status(400).json({
        error: "doctorId, patientId, dateTime and Treatment are required",
      });
    }

    if (isNaN(Number(doctorId)) || isNaN(Number(patientId))) {
      return res.status(400).json({
        error: "doctorId and patientId must be valid numbers",
      });
    }

    const doctorIdNum = Number(doctorId);
    const patientIdNum = Number(patientId);

    if (!Number.isInteger(doctorIdNum) || !Number.isInteger(patientIdNum)) {
      return res.status(400).json({
        error: "doctorId and patientId must be integers",
      });
    }

    // Verify patient belongs to clinic
    const patient = await prisma.patient.findFirst({
      where: {
        id: Number(patientId),
        clinicId,
      },
    });

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found",
      });
    }

    // Verify doctor belongs to clinic
    const doctor = await prisma.doctor.findFirst({
      where: {
        id: Number(doctorId),
        clinicId,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        error: "Doctor not found",
      });
    }

    const consent = await prisma.consent.create({
      data: {
        clinicId,
        doctorId: Number(doctorId),
        patientId: Number(patientId),
        dateTime: new Date(dateTime),
        Treatment,
        comments: comments || null,
        Medication: Medication || null,
        Remarks: Remarks || null,
      },
      include: {
        Patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        Doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Consent created successfully",
      consent,
    });
  } catch (error) {
    console.error("Error creating consent:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = addConsent;
