const { prisma } = require("../../config/database");

const updateReceptionistProfile = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { firstName, lastName, phone, email, Address, Age } = req.body;

    // Check if receptionist exists
    const existingReceptionist = await prisma.Receptionist.findUnique({
      where: { userId },
    });

    if (!existingReceptionist) {
      return res.status(404).json({ error: "Receptionist profile not found" });
    }

    // Build update data object with only provided fields
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (Address !== undefined) updateData.Address = Address;
    if (Age !== undefined) updateData.Age = Age;

    // If email is being updated, check if it's already taken by another receptionist
    if (email && email !== existingReceptionist.email) {
      const emailExists = await prisma.Receptionist.findFirst({
        where: { 
          email,
          userId: { not: userId }
        },
      });

      if (emailExists) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

    // Update receptionist profile
    const updatedReceptionist = await prisma.Receptionist.update({
      where: { userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        Address: true,
        Age: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      message: "Receptionist profile updated successfully",
      receptionist: updatedReceptionist,
    });
  } catch (error) {
    console.error("Error during updating receptionist profile:", error);
    
    // Handle Prisma unique constraint violation
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }
    
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateReceptionistProfile;
