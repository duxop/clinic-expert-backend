const { prisma } = require("../../config/database");

const updateClinicDetails = async (req, res) => {
  try {
    const clinicId = req.userData.clinicId;
    const { email, name, address, phone, workHours, brandColor } = req.body;

    // Build update data object with only provided fields
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (workHours !== undefined) updateData.workHours = workHours;
    if (brandColor !== undefined) updateData.brandColor = brandColor;

    // Check if clinic exists
    const existingClinic = await prisma.Clinic.findUnique({
      where: { id: clinicId },
    });

    if (!existingClinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    // If email is being updated, check if it's already taken by another clinic
    if (email && email !== existingClinic.email) {
      const emailExists = await prisma.Clinic.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(409).json({ error: "Email already exists" });
      }
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
