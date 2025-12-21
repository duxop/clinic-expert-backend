const { prisma } = require("../../config/database");

const savePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { symptoms, diagnosis, advice, otherAdvice, prescriptionItems } = req.body;

    const clinicId = req.userData.clinicId;

    // Support both 'advice' and 'otherAdvice' field names (frontend sends 'advice')
    const adviceText = advice || otherAdvice;

    // Validate required fields
    if (!diagnosis) {
      return res.status(400).json({ error: "Diagnosis is required" });
    }
    if (!adviceText) {
      return res.status(400).json({ error: "Advice is required" });
    }
    if (!prescriptionItems || !Array.isArray(prescriptionItems) || prescriptionItems.length === 0) {
      return res.status(400).json({ error: "At least one prescription item is required" });
    }

    // Validate prescription items structure
    for (const item of prescriptionItems) {
      if (!item.medication || !item.dosage || !item.instruction) {
        return res.status(400).json({
          error: "Each prescription item must have medication, dosage, and instruction",
        });
      }
    }

    // Check if appointment exists and belongs to the clinic
    const appointment = await prisma.Appointment.findUnique({
      where: {
        id: parseInt(id),
        clinicId,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if appointment is in a valid state (should be STARTED or COMPLETED)
    if (appointment.status === "CANCELLED") {
      return res.status(400).json({
        error: "Cannot save prescription for a cancelled appointment",
      });
    }

    // Store prescriptionItems as JSON string
    const prescriptionsJson = JSON.stringify(prescriptionItems);

    // Create or update the prescription
    const prescription = await prisma.EPrescription.upsert({
      where: {
        appointmentId: parseInt(id),
      },
      update: {
        symptoms: symptoms || null,
        diagnosis,
        prescriptions: prescriptionsJson,
        advice: adviceText,
      },
      create: {
        symptoms: symptoms || null,
        diagnosis,
        prescriptions: prescriptionsJson,
        advice: adviceText,
        appointmentId: parseInt(id),
      },
      include: {
        Appointment: {
          include: {
            Patient: true,
            Doctor: true,
            Invoice: {
              include: {
                InvoiceItems: true,
              },
            },
          },
        },
      },
    });

    // Parse prescriptions back to array for response
    const prescriptionResponse = {
      ...prescription,
      prescriptionItems: JSON.parse(prescription.prescriptions),
      prescriptions: undefined, // Remove the JSON string from response
    };

    return res.status(200).json({ prescription: prescriptionResponse });
  } catch (error) {
    console.error("Error saving prescription:", error);
    return res.status(500).json({ error: "Failed to save prescription" });
  }
};

module.exports = savePrescription;



