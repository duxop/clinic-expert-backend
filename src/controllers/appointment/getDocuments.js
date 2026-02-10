const { prisma } = require("../../config/database");

const getDocuments = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const appointmentId = parseInt(req.params.id);

    if (!clinicId) return res.status(401).json({ error: "Unauthorized" });

    const appt = await prisma.Appointment.findFirst({
      where: { id: appointmentId, clinicId },
      select: { id: true },
    });

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const documents = await prisma.AppointmentDocument.findMany({
      where: { appointmentId, clinicId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
};

module.exports = getDocuments;
