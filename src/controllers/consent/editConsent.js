const { prisma } = require("../../config/database");

const editConsent = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const { id : consentId } = req.params;

    const {
      doctorId,
      dateTime,
      Treatment,
      comments,
      Medication,
      Remarks,
      patientConfirmed,
    } = req.body;

    // Validate consentId
    const consentIdNum = parseInt(consentId, 10);

    if (Number.isNaN(consentIdNum)) {
      return res.status(400).json({
        error: "Invalid consentId",
      });
    }

    // Check consent exists and belongs to clinic
    const existingConsent = await prisma.Consent.findFirst({
      where: {
        id: consentIdNum,
        clinicId,
      },
    });

    if (!existingConsent) {
      return res.status(404).json({
        error: "Consent not found",
      });
    }

    const updateData = {};
    updateData.patientId = existingConsent.patientId;

    // Validate and update doctor
    if (doctorId !== undefined) {
      const doctorIdNum = parseInt(doctorId, 10);

      if (Number.isNaN(doctorIdNum)) {
        return res.status(400).json({
          error: "doctorId must be a valid number",
        });
      }

      const doctor = await prisma.doctor.findFirst({
        where: {
          id: doctorIdNum,
          clinicId,
        },
      });

      if (!doctor) {
        return res.status(404).json({
          error: "Doctor not found",
        });
      }

      updateData.doctorId = doctorIdNum;
    }

    // Optional fields
    if (dateTime !== undefined) {
      updateData.dateTime = new Date(dateTime);
    }

    if (Treatment !== undefined) {
      updateData.Treatment = Treatment;
    }

    if (comments !== undefined) {
      updateData.comments = comments;
    }

    if (Medication !== undefined) {
      updateData.Medication = Medication;
    }

    if (Remarks !== undefined) {
      updateData.Remarks = Remarks;
    }

    if(patientConfirmed)
        updateData.patientConfirmed = true;
    const updatedConsent = await prisma.consent.update({
      where: {
        id: consentIdNum,
      },
      data: updateData,
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

    return res.status(200).json({
      message: "Consent updated successfully",
      consent: updatedConsent,
    });
  } catch (error) {
    console.error("Error updating consent:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = editConsent;
