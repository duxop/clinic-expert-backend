const { prisma } = require("../../config/database");

const getAllStaff = async (req, res) => {
  try {
    const clinicId = req.userData.clinicId;

    const staffList = await prisma.User.findMany({
      where: {
        clinicId: clinicId, // Ensure `clinicId` is correctly defined or passed
        role: {
          not: "ADMIN", // Use `not` for exclusion
        },
      },
    });
    console.log(staffList);
    const staffData = staffList.map((data) => {
      const { password, ...wioutPassword } = data;
      return wioutPassword;
    });
    return res.status(200).json({ staff: staffData });
  } catch (error) {
    console.error("Error during getting all staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllStaff;
