const { getS3UploadUrl } = require("../../utils/uploadS3");

const uploadUserPP = async (req, res) => {
  try {
    // console.log("req.userData.id", req.userData.id);
    const doctorId = req.userData?.doctor?.id;
    const { fileName, fileType } = req.body || {};

    if (!doctorId) {
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

    const folder = "doctor-profile-pictures";
    const key = `${folder}/${doctorId}-${`${Date.now()}`}${ext}`;

    const { uploadUrl, fileUrl } = await getS3UploadUrl({
      fileName,
      fileType,
      key,
    });

    return res.status(200).json({
      message: "Profile picture upload URL generated successfully",
      uploadUrl,
      key,
      fileUrl,
    });
  } catch (error) {
    console.error("Error generating profile picture upload URL:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate profile picture upload URL" });
  }
};

module.exports = uploadUserPP;
