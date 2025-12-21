const {
  updateAppointmentStatus: updateStatus,
} = require("../../utils/updateAppointmentStatus");

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const clinicId = req.userData.clinicId;

    const appointment = await updateStatus(id, status, clinicId, null, true);

    return res.status(200).json({ appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    
    // Handle specific error types
    if (error.message === "Invalid status value") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Appointment not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("Cannot transition")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to update appointment status" });
  }
};

module.exports = updateAppointmentStatus;

