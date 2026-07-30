const { prisma } = require("../../config/database");

const updateClinicDetails = async (req, res) => {
  try {
    const clinicId = req.userData.clinicId;
    const {
      name,
      address,
      phone,
      workHours,
      brandColor,
      ConsentTermsAndConditions,
      feedbackLink,
    } = req.body;
    // Build update data object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (workHours !== undefined) updateData.workHours = workHours;
    if (brandColor !== undefined) updateData.brandColor = brandColor;
    if (ConsentTermsAndConditions !== undefined) updateData.ConsentTermsAndConditions = ConsentTermsAndConditions;
    if (feedbackLink !== undefined) updateData.feedbackLink = feedbackLink;

    // Check if clinic exists
    const existingClinic = await prisma.Clinic.findUnique({
      where: { id: clinicId },
    });

    if (!existingClinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // Update clinic details
    const updatedClinic = await prisma.Clinic.update({
      where: { id: clinicId },
      data: updateData,
      select: {
        email: true,
        name: true,
        address: true,
        phone: true,
        workHours: true,
        brandColor: true,
        ConsentTermsAndConditions: true,
        feedbackLink: true,
        messagesLeft: true,
      },
    });

    return res.status(200).json({
      message: "Clinic details updated successfully",
      clinic: updatedClinic,
    });
  } catch (error) {
    console.error("Error during updating clinic details:", error);

    // Handle Prisma unique constraint violation
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateClinicDetails;
