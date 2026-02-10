const { prisma } = require("../../config/database");

const addDocument = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const appointmentId = parseInt(req.params.id);

    const { key, name, mimeType, size } = req.body || {};

    if (!clinicId) return res.status(401).json({ error: "Unauthorized" });
    if (!appointmentId)
      return res.status(400).json({ error: "Invalid appointment id" });

    if (!key || !name) {
      return res.status(400).json({ error: "key, url and name are required" });
    }

    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;

    // check appointment belongs to clinic
    const appt = await prisma.Appointment.findFirst({
      where: { id: appointmentId, clinicId },
      select: { id: true },
    });

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const doc = await prisma.AppointmentDocument.create({
      data: {
        appointmentId,
        clinicId,
        name,
        url: imageUrl,
        key,
        mimeType: mimeType || null,
        size: size ? parseInt(size) : null,
      },
    });

    return res.status(201).json({ document: doc });
  } catch (error) {
    console.error("Error saving appointment document:", error);
    return res.status(500).json({ error: "Failed to save document" });
  }
};

module.exports = addDocument;
