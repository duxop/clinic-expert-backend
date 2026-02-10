const { prisma } = require("../../config/database");

const {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
});

const deleteDocument = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const docId = parseInt(req.params.docId);

    if (!clinicId) return res.status(401).json({ error: "Unauthorized" });

    const doc = await prisma.AppointmentDocument.findFirst({
      where: { id: docId, clinicId },
    });

    if (!doc) return res.status(404).json({ error: "Document not found" });

    // -----------------------------
    // ✅ Delete from S3 (logo-style)
    // -----------------------------
    try {
      let keyToDelete = doc.key;

      // If key is missing, try extracting from url
      if (!keyToDelete && doc.url) {
        const urlPattern = new RegExp(
          `https://${process.env.AWS_S3_BUCKET}\\.s3\\.${process.env.AWS_S3_REGION}\\.amazonaws\\.com/(.+)`,
        );

        const match = doc.url.match(urlPattern);

        if (match && match[1]) {
          keyToDelete = decodeURIComponent(match[1]);
        }
      }

      if (keyToDelete) {
        try {
          // Verify object exists
          await s3.send(
            new HeadObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: keyToDelete,
            }),
          );

          // Delete object
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: keyToDelete,
            }),
          );
        } catch (deleteErr) {
          // Log but do NOT fail (same as logo logic)
          console.warn("Could not delete document from S3:", deleteErr.message);
        }
      } else {
        console.warn("No valid S3 key found for document:", doc);
      }
    } catch (err) {
      console.warn("Error processing document S3 delete:", err.message);
    }

    // -----------------------------
    // ✅ Delete from DB
    // -----------------------------
    await prisma.AppointmentDocument.delete({
      where: { id: docId },
    });

    return res.status(200).json({ deleted: true });
  } catch (error) {
    console.error("Error deleting appointment document:", error);
    return res.status(500).json({ error: "Failed to delete document" });
  }
};

module.exports = deleteDocument;
