const { prisma } = require("../../config/database");

const invoice = async (req, res) => {
  try {
    const { clinicId } = req.userData;

    const {
      id,
      appointmentId,
      InvoiceItems = [],
      discountType = "AMOUNT",
      discountValue = 0,
    } = req.body.invoice;

    // 1) Validate invoice belongs to this clinic (secure)
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

    // 2) Update discount fields on invoice
    await prisma.invoice.update({
      where: { id },
      data: {
        discountType,
        discountValue: Number(discountValue || 0),
      },
    });

    // 3) Delete existing items
    await prisma.invoiceItems.deleteMany({
      where: { invoiceId: id },
    });

    // 4) Insert new items
    const data = InvoiceItems.filter((item) => {
      const name = item?.name?.trim();
      const amount = Number(item?.amount || 0);
      return name && amount >= 0;
    }).map((item) => ({
      invoiceId: id,
      name: item.name.trim(),
      quantity: Number(item.quantity || 0),
      amount: Number(item.amount || 0),
    }));

    const newInvoiceItems = await prisma.invoiceItems.createMany({
      data,
    });

    // 5) Return updated invoice (best for frontend)
    const updatedInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        InvoiceItems: true,
      },
    });

    return res.status(201).json({ Invoice: updatedInvoice });
  } catch (err) {
    console.error("Invoice save error:", err);
    return res.status(500).json({ err: "Server error" });
  }
};

module.exports = invoice;
