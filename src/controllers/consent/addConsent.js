const { prisma } = require("../../config/database");

const addConsent = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const {
      userId,
      patientId,
      dateTime,
      Treatment,
      comments,
      Medication,
      Remarks,
      patientConfirmed,
      patientSignature,
    } = req.body;

    // Validation
    if (
      !userId ||
      !patientId ||
      !dateTime ||
      !Treatment ||
      !patientConfirmed ||
      !patientSignature
    ) {
      return res.status(400).json({
        error:
          "userId, patientId, dateTime, consent, Treatment and patientSignature are required",
      });
    }

    if (isNaN(Number(userId)) || isNaN(Number(patientId))) {
      return res.status(400).json({
        error: "userId and patientId must be valid numbers",
      });
    }

    const userIdNum = Number(userId);
    const patientIdNum = Number(patientId);

    if (!Number.isInteger(userIdNum) || !Number.isInteger(patientIdNum)) {
      return res.status(400).json({
        error: "userId and patientId must be integers",
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

    // Verify User belongs to clinic
    const user = await prisma.User.findFirst({
      where: {
        id: Number(userId),
        clinicId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "user not found",
      });
    }

    const consent = await prisma.consent.create({
      data: {
        clinicId,
        userId: Number(userId),
        patientId: Number(patientId),
        dateTime: new Date(dateTime),
        Treatment,
        comments: comments || null,
        Medication: Medication || null,
        Remarks: Remarks || null,
        patientConfirmed,
        patientSignature,
      },
      include: {
        Patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
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
