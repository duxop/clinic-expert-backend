const { prisma } = require("../../config/database");
const { getS3UploadUrl } = require("../../utils/uploadS3");

const uploadDocumentUrl = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const appointmentId = parseInt(req.params.id);

    const { fileName, fileType } = req.body || {};

    if (!clinicId) return res.status(401).json({ error: "Unauthorized" });
    if (!appointmentId)
      return res.status(400).json({ error: "Invalid appointment id" });

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ error: "fileName and fileType are required" });
    }

    // check appointment belongs to clinic
    const appt = await prisma.Appointment.findFirst({
      where: { id: appointmentId, clinicId },
      select: { id: true },
    });

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    // file ext
    const dotIndex = fileName.lastIndexOf(".");
    const ext = dotIndex !== -1 ? fileName.slice(dotIndex) : "";

    const folder = "appointment-documents";
    const key = `${folder}/${clinicId}/${appointmentId}/${Date.now()}-${Math.floor(
      Math.random() * 10000,
    )}${ext}`;

    const { uploadUrl, fileUrl } = await getS3UploadUrl({
      fileName,
      fileType,
      key,
    });

    return res.status(200).json({
      uploadUrl,
      key,
      fileUrl,
    });
  } catch (error) {
    console.error("Error generating document upload URL:", error);
    return res.status(500).json({ error: "Failed to generate upload URL" });
  }
};

module.exports = uploadDocumentUrl;
