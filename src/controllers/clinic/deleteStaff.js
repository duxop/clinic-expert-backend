const { prisma } = require("../../config/database");

const deleteStaff = async (req, res) => {
  try {
    const { role: userRole, clinicId } = req.userData;
    const { id } = req.params;
    console.log("Deleting staff role:", userRole);
    if (userRole !== "ADMIN") {
      return res.status(403).json({ error: "Unauthorized to delete staff" });
    }
    const staff = await prisma.User.findUnique({
      where: { id: parseInt(id) },
    });
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    if (staff.clinicId !== clinicId || staff.role === "ADMIN") {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this staff" });
    }

    if (staff.role === "DOCTOR") {
      await prisma.Doctor.update({
        where: { userId: parseInt(staff.id) },
        data: { isDeleted: true, userId: null },
      });
    }
    const deletedStaff = await prisma.User.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      message: "Staff deleted successfully",
      staff: deletedStaff,
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deleteStaff;
