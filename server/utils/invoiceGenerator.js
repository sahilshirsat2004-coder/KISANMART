import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Stream directly to response
  doc.pipe(res);

  // Header Banner
  doc.rect(40, 40, 515, 60).fill('#15803d'); // Emerald Green
  doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold').text('KisanMart', 55, 52);
  doc.fontSize(10).font('Helvetica').text('Agricultural Wholesale & Logistics Network', 55, 78);
  doc.fontSize(14).font('Helvetica-Bold').text('TAX INVOICE', 430, 62);

  doc.fillColor('#111827'); // Reset font color to dark

  // Invoice & Order Metadata
  const topY = 120;
  doc.fontSize(9).font('Helvetica-Bold').text('Invoice No:', 40, topY);
  doc.font('Helvetica').text(`INV-${order._id.toString().slice(-8).toUpperCase()}`, 110, topY);

  doc.font('Helvetica-Bold').text('Date:', 40, topY + 15);
  doc.font('Helvetica').text(new Date(order.updatedAt || Date.now()).toLocaleDateString('en-IN'), 110, topY + 15);

  doc.font('Helvetica-Bold').text('Order Type:', 40, topY + 30);
  doc.font('Helvetica').text(order.orderType === 'FUTURE' ? 'Future Harvest Pre-Booking' : 'Spot Market Direct', 110, topY + 30);

  // Farmer & Buyer Billing Blocks
  const partyY = 175;
  doc.rect(40, partyY, 250, 85).stroke('#e5e7eb');
  doc.rect(305, partyY, 250, 85).stroke('#e5e7eb');

  doc.font('Helvetica-Bold').fontSize(10).text('SELLER / PRODUCER (FARMER):', 50, partyY + 10);
  doc.font('Helvetica').fontSize(9).text(`Name: ${order.farmer?.name || 'Verified Farmer'}`, 50, partyY + 26);
  doc.text(`Contact: ${order.farmer?.phone || 'N/A'}`, 50, partyY + 40);
  doc.text(`Location: ${order.farmer?.address?.city || 'Local Farm'}, ${order.farmer?.address?.state || 'Maharashtra'}`, 50, partyY + 54);

  doc.font('Helvetica-Bold').fontSize(10).text('BUYER / CONSIGNEE (SHOPKEEPER):', 315, partyY + 10);
  doc.font('Helvetica').fontSize(9).text(`Name: ${order.buyer?.name || 'Authorized Retailer'}`, 315, partyY + 26);
  doc.text(`Contact: ${order.buyer?.phone || 'N/A'}`, 315, partyY + 40);
  doc.text(`Destination: ${order.deliveryAddress?.city || 'Local Retail Market'}`, 315, partyY + 54);

  // Table Header
  const tableY = 280;
  doc.rect(40, tableY, 515, 22).fill('#f3f4f6');
  doc.fillColor('#374151').font('Helvetica-Bold').fontSize(9);
  doc.text('Item Description', 50, tableY + 6);
  doc.text('Category', 210, tableY + 6);
  doc.text('Qty', 310, tableY + 6);
  doc.text('Rate', 380, tableY + 6);
  doc.text('Total (INR)', 470, tableY + 6);

  // Table Row
  const rowY = tableY + 25;
  doc.fillColor('#111827').font('Helvetica').fontSize(9);
  doc.text(order.product?.name || 'Fresh Produce', 50, rowY + 6);
  doc.text(order.product?.category || 'Crops', 210, rowY + 6);
  doc.text(`${order.quantity} ${order.product?.unit || 'kg'}`, 310, rowY + 6);
  doc.text(`Rs. ${order.agreedPricePerUnit}`, 380, rowY + 6);
  doc.text(`Rs. ${order.totalAmount}`, 470, rowY + 6);

  doc.moveTo(40, rowY + 22).lineTo(555, rowY + 22).stroke('#e5e7eb');

  // Logistics & Settled Details
  const logisticsY = 350;
  doc.fontSize(9).font('Helvetica-Bold').text('Logistics Partner / Transporter:', 40, logisticsY);
  doc.font('Helvetica').text(
    order.driver ? `${order.driver.name} (Phone: ${order.driver.phone})` : 'Self-Dispatched / Local Transit',
    40,
    logisticsY + 14
  );

  // Financial Summary Breakdown
  const sumX = 350;
  const sumY = 410;
  doc.font('Helvetica').text('Subtotal:', sumX, sumY);
  doc.text(`Rs. ${order.totalAmount}`, 480, sumY);

  doc.text('Platform Convenience Fee (0% APMC):', sumX, sumY + 16);
  doc.text('Rs. 0.00', 480, sumY + 16);

  doc.rect(sumX - 10, sumY + 35, 215, 26).fill('#ecfdf5');
  doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(10);
  doc.text('Total Settled Amount:', sumX, sumY + 43);
  doc.text(`Rs. ${order.totalAmount}`, 475, sumY + 43);

  // Footer Disclaimer & Verification
  doc.fillColor('#6b7280').font('Helvetica').fontSize(8);
  doc.text(
    'This is a computer-generated invoice authenticated under KisanMart direct trade protocols. No signature required.',
    40,
    720,
    { align: 'center', width: 515 }
  );

  doc.end();
};