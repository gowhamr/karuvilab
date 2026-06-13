import { LineItem, TemplateType, InvoiceParty, InvoiceMeta } from '../types';

interface Totals {
  subtotal: number;
  discountAmt: number;
  afterDiscount: number;
  tax: number;
  total: number;
}

export async function generateInvoicePDF(params: {
  logo: string | null;
  currency: string;
  template: TemplateType;
  from: InvoiceParty;
  to: InvoiceParty;
  meta: InvoiceMeta;
  items: LineItem[];
  taxRate: number;
  discount: number;
  notes: string;
  terms: string;
  totals: Totals;
}) {
  const { logo, currency, template, from, to, meta, items, taxRate, discount, notes, terms, totals } = params;
  
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let y = height - 60;
  const margin = 50;

  const blueColor = rgb(0.31, 0.27, 0.9); 
  const lightGray = rgb(0.97, 0.97, 0.98);
  const textDark = rgb(0.06, 0.09, 0.16);
  const textMuted = rgb(0.4, 0.4, 0.4);

  if (logo) {
    try {
      const logoBytes = await fetch(logo).then(res => res.arrayBuffer());
      const isPng = logo.includes("png");
      const logoImage = isPng ? await pdfDoc.embedPng(logoBytes) : await pdfDoc.embedJpg(logoBytes);
      const logoDims = logoImage.scale(0.2);
      page.drawImage(logoImage, {
        x: margin,
        y: y - logoDims.height + 20,
        width: logoDims.width,
        height: logoDims.height,
      });
    } catch (e) { console.error("Logo embed fail", e); }
  }

  if (template === "modern") {
     page.drawRectangle({ x: 0, y: height - 120, width: width, height: 120, color: lightGray });
     page.drawText('INVOICE', { x: width - 180, y: height - 65, size: 32, font: fontBold, color: blueColor });
     page.drawText('# ' + meta.number, { x: width - 180, y: height - 90, size: 12, font: fontBold, color: textDark });
     
     y = height - 160;
     const colW = (width - margin * 2) / 3;
     
     page.drawText('ISSUED BY', { x: margin, y, size: 9, font: fontBold, color: textMuted });
     y -= 15;
     page.drawText(from.name || "Business Name", { x: margin, y, size: 11, font: fontBold });
     y -= 14;
     page.drawText(from.email || "", { x: margin, y, size: 9, font: fontRegular });
     y -= 12;
     page.drawText(from.address || "", { x: margin, y, size: 8, font: fontRegular, maxWidth: colW });

     let partyY = height - 160;
     page.drawText('BILL TO', { x: margin + colW * 1.2, y: partyY, size: 9, font: fontBold, color: textMuted });
     partyY -= 15;
     page.drawText(to.name || "Client Name", { x: margin + colW * 1.2, y: partyY, size: 11, font: fontBold });
     partyY -= 14;
     page.drawText(to.email || "", { x: margin + colW * 1.2, y: partyY, size: 9, font: fontRegular });
     partyY -= 12;
     page.drawText(to.address || "", { x: margin + colW * 1.2, y: partyY, size: 8, font: fontRegular, maxWidth: colW });

     partyY = height - 160;
     page.drawText('DETAILS', { x: width - margin - 100, y: partyY, size: 9, font: fontBold, color: textMuted });
     partyY -= 15;
     page.drawText('Date: ' + meta.date, { x: width - margin - 100, y: partyY, size: 9, font: fontRegular });
     if (meta.dueDate) {
       partyY -= 12;
       page.drawText('Due: ' + meta.dueDate, { x: width - margin - 100, y: partyY, size: 9, font: fontRegular, color: blueColor });
     }
     partyY -= 12;
     page.drawText('Status: ' + meta.status.toUpperCase(), { x: width - margin - 100, y: partyY, size: 9, font: fontBold, color: meta.status === 'paid' ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0) });

     y = Math.min(y, partyY) - 50;
  } 
  else if (template === "minimal") {
     page.drawText(from.name || "Business Name", { x: margin, y: height - 60, size: 14, font: fontBold });
     page.drawText('INVOICE', { x: width - margin - 80, y: height - 60, size: 14, font: fontBold });
     
     y = height - 100;
     page.drawText('Invoice No: ' + meta.number, { x: width - margin - 120, y, size: 9, font: fontRegular });
     y -= 12;
     page.drawText('Date: ' + meta.date, { x: width - margin - 120, y, size: 9, font: fontRegular });
     
     y = height - 140;
     page.drawText('BILL TO:', { x: margin, y, size: 8, font: fontBold, color: textMuted });
     y -= 15;
     page.drawText(to.name || "Client Name", { x: margin, y, size: 10, font: fontBold });
     if (to.company) {
       y -= 12;
       page.drawText(to.company, { x: margin, y, size: 9, font: fontRegular });
     }
     y -= 12;
     page.drawText(to.address || "", { x: margin, y, size: 8, font: fontRegular, maxWidth: 200 });

     y -= 40;
  }
  else if (template === "professional") {
     page.drawText('INVOICE', { x: margin, y: height - 60, size: 28, font: fontBold, color: textDark });
     page.drawRectangle({ x: margin, y: height - 75, width: 40, height: 4, color: blueColor });
     
     page.drawText(from.name || "Business Name", { x: width - margin - 150, y: height - 55, size: 12, font: fontBold, color: textDark });
     page.drawText(from.address || "", { x: width - margin - 150, y: height - 70, size: 8, font: fontRegular, maxWidth: 150 });
     
     y = height - 140;
     page.drawRectangle({ x: margin, y: y, width: width - margin * 2, height: 60, color: lightGray });
     
     page.drawText('BILL TO:', { x: margin + 20, y: y + 40, size: 8, font: fontBold, color: textMuted });
     page.drawText(to.name || "Client Name", { x: margin + 20, y: y + 25, size: 11, font: fontBold });
     
     page.drawText('INVOICE NO:', { x: margin + 220, y: y + 40, size: 8, font: fontBold, color: textMuted });
     page.drawText(meta.number, { x: margin + 220, y: y + 25, size: 11, font: fontBold });
     
     page.drawText('DATE:', { x: margin + 380, y: y + 40, size: 8, font: fontBold, color: textMuted });
     page.drawText(meta.date, { x: margin + 380, y: y + 25, size: 11, font: fontBold });

     y -= 40;
  }
  else {
     page.drawText('INVOICE', { x: width / 2 - 40, y: height - 60, size: 24, font: fontBold });
     y = height - 100;
     page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: textDark });
     y -= 30;
     
     page.drawText('From: ' + from.name, { x: margin, y, size: 10, font: fontBold });
     page.drawText('Invoice #: ' + meta.number, { x: width - 150, y, size: 10, font: fontBold });
     y -= 15;
     page.drawText(from.address || "", { x: margin, y, size: 8, font: fontRegular });
     page.drawText('Date: ' + meta.date, { x: width - 150, y, size: 10, font: fontRegular });
     y -= 30;
  }

  page.drawRectangle({ x: margin, y: y - 5, width: width - margin * 2, height: 25, color: blueColor });
  page.drawText('DESCRIPTION', { x: margin + 10, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('QTY', { x: margin + 300, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('PRICE', { x: margin + 360, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('TOTAL', { x: margin + 440, y, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  
  y -= 30;

  items.forEach((item, i) => {
    if (i % 2 === 0) {
       page.drawRectangle({ x: margin, y: y - 5, width: width - margin * 2, height: 20, color: rgb(0.98, 0.98, 1) });
    }
    page.drawText(item.desc || "Item Description", { x: margin + 10, y, size: 9, font: fontRegular });
    page.drawText(item.qty.toString(), { x: margin + 300, y, size: 9, font: fontRegular });
    page.drawText(currency + item.price.toLocaleString(), { x: margin + 360, y, size: 9, font: fontRegular });
    page.drawText(currency + (item.qty * item.price).toLocaleString(), { x: margin + 440, y, size: 9, font: fontBold });
    y -= 20;
  });

  y -= 30;
  const totalX = width - margin - 150;
  
  const drawTotalLine = (label: string, value: string, isBold = false) => {
     const currentFont = isBold ? fontBold : fontRegular;
     page.drawText(label, { x: totalX, y, size: 9, font: currentFont, color: isBold ? textDark : textMuted });
     
     const valueWidth = currentFont.widthOfTextAtSize(value, 10);
     page.drawText(value, { x: width - margin - valueWidth, y, size: 10, font: currentFont, color: isBold ? blueColor : textDark });
     y -= 18;
  };

  drawTotalLine("Subtotal", currency + totals.subtotal.toLocaleString());
  if (discount > 0) drawTotalLine('Discount (' + discount + '%)', '-' + currency + totals.discountAmt.toLocaleString());
  drawTotalLine('GST (' + taxRate + '%)', '+' + currency + totals.tax.toLocaleString());
  y -= 5;
  page.drawRectangle({ x: totalX, y: y + 15, width: width - margin - totalX, height: 1, color: lightGray });
  drawTotalLine("GRAND TOTAL", currency + totals.total.toLocaleString(), true);

  if (notes || terms) {
    y -= 40;
    if (notes) {
      page.drawText('NOTES', { x: margin, y, size: 8, font: fontBold, color: blueColor });
      y -= 15;
      page.drawText(notes, { x: margin, y, size: 8, font: fontRegular, maxWidth: 300, lineHeight: 10 });
      y -= 30;
    }
    if (terms) {
      page.drawText('TERMS & CONDITIONS', { x: margin, y, size: 8, font: fontBold, color: textMuted });
      y -= 15;
      page.drawText(terms, { x: margin, y, size: 7, font: fontRegular, maxWidth: width - margin * 2 });
    }
  }

  page.drawText('Generated via KaruviLab — Professional Local-First Tools', {
    x: width / 2 - 100,
    y: 30,
    size: 7,
    font: fontRegular,
    color: textMuted
  });

  return await pdfDoc.save();
}
