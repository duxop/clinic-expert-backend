const { AppointmentStatus } = require("@prisma/client");
const { prisma } = require("../../config/database");

const invoicePayment = async (req, res) => {
  const { clinicId, id: lastUpdatedById } = req.userData;

  const { id, appointmentId, amountPaid, modeOfPayment } = req.body;
  const checkInvoice = await prisma.Invoice.findUnique({
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
  if (!checkInvoice) return res.status(401).json({ err: "Invalid request" });

  const postPayemnt = await prisma.Invoice.update({
    where: {
      id,
    },
    data: {
      amountPaid: {
        increment: amountPaid, // adds on top of current amountPaid
      },
      modeOfPayment,
    },
    include: {
      InvoiceItems: true,
    },
  });

  console.log(postPayemnt);
  return res.status(201).json({ Invoice: postPayemnt });
};

module.exports = invoicePayment;
