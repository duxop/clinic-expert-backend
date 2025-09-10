const { prisma } = require("../../config/database");
const { verifyPatientData } = require("../../utils/dataValidator");

const addPatient = async (req, res) => {
  try {
    const { clinicId } = req.userData;
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

    const patient = await prisma.Patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        emergencyContact,
        gender,
        dob,
        clinicId,
      },
    });
    console.log(patient);
    res.status(201).json({ patientCreated: patient });
  } catch (error) {
    console.error("Error during adding patient", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = addPatient;
