const { AppointmentStatus } = require("@prisma/client");
const { prisma } = require("../../config/database");

const invoice = async (req, res) => {
  //   const { invoice } = req.body;
  const { clinicId, id: lastUpdatedById } = req.userData;

  const { id, appointmentId, InvoiceItems } = req.body.invoice;
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

  await prisma.InvoiceItems.deleteMany({
    where: {
      invoiceId: id,
    },
  });

  const data = InvoiceItems.filter((item) => {
    const { name, amount } = item;
    return name && amount;
  }).map((item) => {
    const { name, quantity, amount } = item;
    return {
      invoiceId: id,
      name,
      quantity,
      amount,
    };
  });

  const newInvoiceItems = await prisma.InvoiceItems.createManyAndReturn({
    data,
  });

  console.log(newInvoiceItems);
  return res.status(201).json({ Invoice: newInvoiceItems });
};

module.exports = invoice;
