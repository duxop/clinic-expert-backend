const { HeadObjectCommand, DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { prisma } = require("../../config/database");

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

const updateLogo = async (req, res) => {
  const { fileKey } = req.body;
  const clinicId = req.userData?.Clinic?.id;

  if (!clinicId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!fileKey) {
    return res.status(400).json({ message: "fileKey is required" });
  }

  try {
    // 1) Get current clinic to retrieve old logo URL
    const currentClinic = await prisma.Clinic.findUnique({
      where: { id: clinicId },
      select: { logo: true },
    });

    // 2) Delete old logo from S3 if it exists
    if (currentClinic?.logo) {
      try {
        // Extract the S3 key from the URL
        // URL format: https://bucket.s3.region.amazonaws.com/key
        const urlPattern = new RegExp(
          `https://${process.env.AWS_S3_BUCKET}\\.s3\\.${process.env.AWS_S3_REGION}\\.amazonaws\\.com/(.+)`
        );
        const match = currentClinic.logo.match(urlPattern);
        
        if (match && match[1]) {
          const oldKey = decodeURIComponent(match[1]);
          
          // Verify old object exists before deleting
          try {
            await s3.send(
              new HeadObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: oldKey,
              })
            );
            
            // Delete the old object
            await s3.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: oldKey,
              })
            );
          } catch (deleteErr) {
            // Log but don't fail if old object doesn't exist or can't be deleted
            console.warn("Could not delete old logo from S3:", deleteErr.message);
          }
        }
      } catch (err) {
        // Log but don't fail if we can't parse or delete the old URL
        console.warn("Error processing old logo URL:", err.message);
      }
    }

    // 3) Verify new object exists
    await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
      })
    );

    // 4) Update DB with new logo
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;

    await prisma.Clinic.update({
      where: { id: clinicId },
      data: { logo: imageUrl },
    });

    return res.json({
      message: "Logo updated successfully.",
      imageUrl,
    });
  } catch (err) {
    console.error("Error updating logo:", err);
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return res.status(400).json({
        message: "Upload not found in S3. Please upload again.",
      });
    }
    return res.status(500).json({
      message: "Failed to update logo.",
    });
  }
};

module.exports = updateLogo;
