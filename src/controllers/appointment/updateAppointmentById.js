const { prisma } = require("../../config/database");

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const clinicId = req.userData.clinicId;

    // Verify the appointment exists and belongs to the clinic
    const existingAppointment = await prisma.Appointment.findFirst({
      where: {
        id: parseInt(id),
        clinicId: clinicId
      },
      include: {
        Invoice: true
      }
    });

    if (!existingAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Start a transaction to update both appointment and invoice
    const updatedAppointment = await prisma.$transaction(async (prisma) => {
      // Update the appointment
      const appointment = await prisma.Appointment.update({
        where: {
          id: parseInt(id)
        },
        data: {
          scheduledTime: updateData.scheduledTime ? new Date(updateData.scheduledTime) : undefined,
          duration: updateData.duration,
          status: updateData.status,
          notes: updateData.notes,
          isWalkIn: updateData.isWalkIn,
          patientId: updateData.patientId,
          doctorId: updateData.doctorId,
          updatedAt: new Date()
        },
        include: {
          Patient: true,
          Doctor: true,
          createdBy: true,
          Invoice: true
        }
      });

      // If invoice items are provided in the update data, update the invoice
      if (updateData.invoice) {
        if (existingAppointment.Invoice.length > 0) {
          // Update existing invoice
          await prisma.Invoice.update({
            where: {
              appointmentId: parseInt(id)
            },
            data: {
              items: updateData.invoice.items,
              paymentStatus: updateData.invoice.paymentStatus,
              modeOfPayment: updateData.invoice.modeOfPayment,
              updatedAt: new Date()
            }
          });
        } else {
          // Create new invoice if it doesn't exist
          await prisma.Invoice.create({
            data: {
              items: updateData.invoice.items,
              paymentStatus: updateData.invoice.paymentStatus || "PAID",
              modeOfPayment: updateData.invoice.modeOfPayment,
              appointmentId: parseInt(id),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        }
      }

      // Fetch the final state with updated invoice
      return prisma.Appointment.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          Patient: true,
          Doctor: true,
          createdBy: true,
          Invoice: true
        }
      });
    });

    return res.status(200).json({ 
      message: "Appointment updated successfully",
      appointment: updatedAppointment 
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateAppointment;
