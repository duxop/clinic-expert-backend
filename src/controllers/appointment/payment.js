const { prisma } = require("../../config/database");

const invoicePayment = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const {
      id,
      appointmentId,
      amountPaid,
      modeOfPayment,
      discountType,
      discountValue,
    } = req.body;

    // 1) Validate invoice belongs to this clinic
    const checkInvoice = await prisma.invoice.findFirst({
      where: {
        id,
        appointmentId,
        Appointment: {
          clinicId,
        },
      },
      include: {
        InvoiceItems: true,
      },
    });

    if (!checkInvoice) {
      return res.status(401).json({ err: "Invalid request" });
    }

    // 2) Update payment + discount
    const postPayment = await prisma.invoice.update({
      where: { id },
      data: {
        amountPaid: {
          increment: Number(amountPaid || 0),
        },
        modeOfPayment,
        discountType: discountType || checkInvoice.discountType || "AMOUNT",
        discountValue:
          discountValue !== undefined && discountValue !== null
            ? Number(discountValue)
            : Number(checkInvoice.discountValue || 0),
      },
      include: {
        InvoiceItems: true,
      },
    });

    // 3) Update appointment status
    const appointment = await prisma.appointment.update({
      where: {
        id: parseInt(appointmentId),
        clinicId,
      },
      data: {
        status: "CONFIRMED",
      },
      include: {
        Patient: true,
        Doctor: true,
        Invoice: {
          include: {
            InvoiceItems: true,
          },
        },
        AppointmentDocument: true,
        EPrescription: true,
      },
    });

    return res.status(201).json({ Invoice: postPayment, appointment });
  } catch (err) {
    console.error("Invoice payment error:", err);
    return res.status(500).json({ err: "Server error" });
  }
};

module.exports = invoicePayment;
