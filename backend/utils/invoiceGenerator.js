const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order, items) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const invoicePath = path.join(dir, `invoice_${order.id}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(invoicePath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;

    // ======== HEADER (Blue Section) ========
    doc.rect(0, 0, pageWidth, 120)
      .fill('#003366'); // Dark Professional Blue

    // INVOICE left
    doc.fillColor('white')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('INVOICE', 50, 40);

    // Order ID right
    doc.fontSize(12)
      .font('Helvetica')
      .text(`Order #: ${order.id}`, pageWidth - 150, 40);

    // Company Name center
    doc.fontSize(20)
      .font('Helvetica-Bold')
      .text('Econest Bedding Inc.', 0, 80, { align: 'center' });

    // ======== BILL TO / FROM SECTION ========
    doc.moveDown(5);

    doc.fillColor('black')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Bill To:', 50, doc.y);

    doc.fontSize(12)
      .font('Helvetica')
      .text(`Name: ${order.name || 'Unknown'}`, 50)
      .text(`Email: ${order.email || 'Unknown'}`, 50)
      .text(`Address: ${order.address || 'Unknown'}`, 50);

    // From Section (Company Info)
    doc.fontSize(14)
      .font('Helvetica-Bold')
      .text('From:', pageWidth / 2 + 30, 160);

    doc.fontSize(12)
      .font('Helvetica')
      .text('Econest Bedding Inc.', pageWidth / 2 + 30)
      .text('1935 30 Ave NE, Unit 7, Calgary, AB, Canada', pageWidth / 2 + 30)
      .text('Phone: +1 825-883-0015', pageWidth / 2 + 30)
      .text('Email: Albertamattress@gmail.com', pageWidth / 2 + 30);

    // ======== DATE CENTER ========
    doc.moveDown(2);
    doc.fontSize(12)
      .font('Helvetica')
      .text(`Order Date: ${order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}`, { align: 'center' })
      .moveDown(2);

    // ======== TABLE HEADER ========
    const drawTableHeader = () => {
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('Description', 50, doc.y, { continued: true })
        .text('Qty', 280, doc.y, { continued: true })
        .text('Price', 350, doc.y, { continued: true })
        .text('Subtotal', 450, doc.y)
        .moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    };

    drawTableHeader();

    // ======== TABLE BODY ========
    doc.font('Helvetica').fontSize(11).fillColor('#000000');

    if (Array.isArray(items) && items.length > 0) {
      items.forEach(item => {
        const quantity = Number(item?.quantity ?? 0);
        const price = Number(item?.price ?? 0);
        const subtotal = (quantity * price).toFixed(2);
        const productName = item?.name || 'Unnamed Product';

        if (doc.y > doc.page.height - 120) {
          doc.addPage();
          drawTableHeader();
        }

        doc.moveDown(0.5)
          .text(productName, 50, doc.y, { continued: true })
          .text(quantity.toString(), 280, doc.y, { continued: true })
          .text(`$${price.toFixed(2)}`, 350, doc.y, { continued: true })
          .text(`$${subtotal}`, 450, doc.y);
      });
    } else {
      doc.moveDown(1)
        .fontSize(12)
        .text('No items found for this order', { align: 'center' });
    }

    // ======== TOTAL ========
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    const totalPrice = Number(order?.total_price ?? 0);
    doc.moveDown(1)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(`Total Amount: CAD $${totalPrice.toFixed(2)}`, { align: 'right' });

    // ======== THANK YOU FOOTER ========
    doc.moveDown(4)
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#003366')
      .text('Thank You For Your Business!', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(invoicePath));
    stream.on('error', reject);
  });
};

module.exports = { generateInvoice };
