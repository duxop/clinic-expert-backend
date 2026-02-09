const { getS3UploadUrl } = require("../../utils/uploadS3");

const uploadLogo = async (req, res) => {
  try {
    console.log("Hello from uplaod");
    const clinicId = req.userData?.Clinic?.id;
    const { fileName, fileType } = req.body || {};

    if (!clinicId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ error: "fileName and fileType are required" });
    }

    // Use doctorId as the "filename" so each user has exactly one profile picture.
    // We keep a stable key like: user-profile-pictures/<doctorId>.<ext>
    const originalName = fileName || "";
    const dotIndex = originalName.lastIndexOf(".");
    const ext = dotIndex !== -1 ? originalName.slice(dotIndex) : "";

    const folder = "clinic-logo";
    const key = `${folder}/${clinicId}-${`${Date.now()}`}${ext}`;

    const { uploadUrl, fileUrl } = await getS3UploadUrl({
      fileName,
      fileType,
      key,
    });

    return res.status(200).json({
      message: "Logo upload URL generated successfully",
      uploadUrl,
      key,
      fileUrl,
    });
  } catch (error) {
    console.error("Error generating Logo upload URL:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate logo upload URL" });
  }
};

module.exports = uploadLogo;
