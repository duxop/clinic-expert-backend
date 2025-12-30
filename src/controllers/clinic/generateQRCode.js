const QRCode = require("qrcode");
const { prisma } = require("../../config/database");

const generateQRCode = async (req, res) => {
  try {
    const { id: clinicId } = req.params;

    // Verify clinic exists
    const clinic = await prisma.Clinic.findUnique({
      where: { id: parseInt(clinicId) },
      select: { id: true, name: true },
    });

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // Frontend registration URL with clinic ID
    // Use environment variable if available, otherwise use production URL
    const frontendBaseUrl = "https://clinicxpert.in";
    const registrationUrl = `${frontendBaseUrl}/register/${clinicId}`;

    // Generate QR code as data URL (base64 image)
    const qrCodeDataUrl = await QRCode.toDataURL(registrationUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Return QR code data URL and registration URL
    res.status(200).json({
      qrCode: qrCodeDataUrl, // Base64 data URL that can be used in <img src="">
      registrationUrl: registrationUrl,
      clinicName: clinic.name,
      clinicId: clinic.id,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = generateQRCode;

