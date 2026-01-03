const { prisma } = require("../../config/database");
const { verifyPatientData } = require("../../utils/dataValidator");

const registerPatientPublic = async (req, res) => {
  try {
    const { clinicId } = req.params;

    // Verify clinic exists
    const clinic = await prisma.Clinic.findUnique({
      where: { id: parseInt(clinicId) },
      select: { id: true, name: true },
    });

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // Validate patient data
    const {
      firstName,
      lastName,
      email,
      phone,
      emergencyContact,
      gender,
      dob,
      err,
    } = verifyPatientData(req.body);

    if (err) return res.status(err.code).json({ err: err.message });

    // Validate date of birth (required in schema)
    if (!dob || isNaN(new Date(dob).getTime())) {
      return res.status(400).json({ error: "Valid date of birth is required" });
    }

    // Check for duplicate patient in the same clinic
    const existingPatient = await prisma.Patient.findFirst({
      where: {
        clinicId: parseInt(clinicId),
        OR: [
          ...(email ? [{ email }] : []),
          { phone: phone },
        ],
      },
    });

    if (existingPatient) {
      return res.status(409).json({
        error: "Patient with this email or phone number already exists in this clinic",
      });
    }

    // Create patient
    const patient = await prisma.Patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        emergencyContact,
        gender,
        dob: new Date(dob),
        clinicId: parseInt(clinicId),
      },
    });

    res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        clinicName: clinic.name,
      },
    });
  } catch (error) {
    console.error("Error during public patient registration:", error);
    
    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Patient with this email or phone number already exists",
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = registerPatientPublic;

