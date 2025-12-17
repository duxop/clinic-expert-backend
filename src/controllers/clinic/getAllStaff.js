const { prisma } = require("../../config/database");

const getAllStaff = async (req, res) => {
  try {
    const clinicId = req.userData.clinicId;

    const staffList = await prisma.User.findMany({
      where: {
        clinicId: clinicId,
        role: {
          not: "ADMIN", // Use `not` for exclusion
        },
      },
      include: {
        Doctor: {
          select: {
            id: true,
            profilePicture: true,
            name: true,
            email: true,
            degree: true,
            specialization: true,
            experience: true,
          },
        },
      },
    });
    
    console.log(staffList);
    const staffData = staffList.map((data) => {
      const { password, ...withoutPassword } = data;
      
      const profilePicture = data.Doctor?.profilePicture || null;
      
      return {
        ...withoutPassword,
        profilePicture, // Add profilePicture field
        doctorId: data.Doctor?.id || null, // Include doctorId for reference
      };
    });
    
    return res.status(200).json({ staff: staffData });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllStaff;
