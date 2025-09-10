const { prisma } = require("../../config/database");

const getDoctor = async (req, res) => {
  try {
    const { clinicId, id, role } = req.userData;

    let doctorsList = await prisma.Doctor.findMany({
      where: {
        clinicId, // Ensure `clinicId` is correctly defined or passed
      },
    });
    if (role === "DOCTOR")
      doctorsList = doctorsList.filter((doctor) => doctor.userId === id);
    console.log(doctorsList);
    return res.status(200).json({ doctors: doctorsList });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getDoctor;
