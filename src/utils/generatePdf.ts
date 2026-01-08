import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceData } from '@/types/invoice';

interface Calculations {
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  gstRate: number;
}

const formatCurrencyForPDF = (amount: number) => {
  // Simple formatting for PDF to avoid special character issues
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rs. ${formatted}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const generateInvoicePdf = (invoice: InvoiceData, calculations: Calculations) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Define consistent margins and spacing
  const leftMargin = 20;
  const rightMargin = 20;
  const lineHeight = 7;
  
  let currentY = 20;

  // Header Section
  // Business Name - Bold, Large, Centered
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.businessName, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  
  // Branch and Address
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.businessDetails.branch, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 6;
  
  doc.setFontSize(10);
  doc.text(invoice.businessDetails.address, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 5;
  
  // Contact and GSTIN
  doc.text(`Ph: ${invoice.businessDetails.contactNumber} | GSTIN: ${invoice.businessDetails.gstin}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  
  // TAX INVOICE - Centered
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 5;
  
  // Shop Type and GST Rate
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${invoice.shopType.name} • GST: ${(invoice.shopType.gstRate * 100).toFixed(0)}%`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  
  // Horizontal separator line
  doc.setLineWidth(0.8);
  doc.line(leftMargin, currentY, pageWidth - rightMargin, currentY);
  
  currentY += 12;

  // Invoice Details Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Left side details
  const leftDetailsY = currentY;
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, leftMargin, leftDetailsY);
  doc.text(`Payment Mode: ${invoice.paymentMode}`, leftMargin, leftDetailsY + lineHeight);
  doc.text(`Cashier: ${invoice.businessDetails.cashierName}`, leftMargin, leftDetailsY + (lineHeight * 2));
  
  // Right side details
  const rightDetailsX = pageWidth - rightMargin;
  doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, rightDetailsX, leftDetailsY, { align: 'right' });
  doc.text(`Tax Type: ${invoice.taxType === 'cgst_sgst' ? 'CGST + SGST' : 'IGST'}`, rightDetailsX, leftDetailsY + lineHeight, { align: 'right' });
  if (invoice.businessDetails.counterNumber) {
    doc.text(`Counter: ${invoice.businessDetails.counterNumber}`, rightDetailsX, leftDetailsY + (lineHeight * 2), { align: 'right' });
  }
  
  currentY = leftDetailsY + (lineHeight * 3) + 8;

  // Items Table using autoTable
  const tableData = invoice.items.map((item, index) => [
    (index + 1).toString(),
    item.productName,
    item.quantity.toString(),
    formatCurrencyForPDF(item.pricePerUnit),
    formatCurrencyForPDF(item.lineTotal),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['S.No', 'Product Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    margin: { left: leftMargin, right: rightMargin },
    tableWidth: 'auto',
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 11,
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      fontSize: 10,
      valign: 'middle',
    },
    columnStyles: {
      0: { 
        cellWidth: 18, 
        halign: 'center',
        fontStyle: 'normal'
      },
      1: { 
        cellWidth: 70, 
        halign: 'left',
        cellPadding: { left: 3, right: 3, top: 3, bottom: 3 }
      },
      2: { 
        cellWidth: 20, 
        halign: 'center',
        fontStyle: 'normal'
      },
      3: { 
        cellWidth: 30, 
        halign: 'right',
        fontStyle: 'normal'
      },
      4: { 
        cellWidth: 32, 
        halign: 'right',
        fontStyle: 'bold'
      },
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2,
      lineColor: [100, 100, 100],
      lineWidth: 0.2,
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
  });

  // Get the final Y position after the table
  const tableEndY = (doc as any).lastAutoTable.finalY;
  currentY = tableEndY + 10;

  // Totals Section - Right aligned block, positioned at right margin
  const totalsBlockWidth = 80;
  const totalsStartX = pageWidth - rightMargin - totalsBlockWidth;
  const valueX = pageWidth - rightMargin - 5;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', totalsStartX, currentY);
  doc.text(formatCurrencyForPDF(calculations.subtotal), valueX, currentY, { align: 'right' });
  currentY += lineHeight;
  
  // Tax details
  const gstHalfRate = (calculations.gstRate * 50).toFixed(1);
  const gstFullRate = (calculations.gstRate * 100).toFixed(0);
  
  if (invoice.taxType === 'cgst_sgst') {
    doc.text(`CGST (${gstHalfRate}%):`, totalsStartX, currentY);
    doc.text(formatCurrencyForPDF(calculations.cgst), valueX, currentY, { align: 'right' });
    currentY += lineHeight;
    
    doc.text(`SGST (${gstHalfRate}%):`, totalsStartX, currentY);
    doc.text(formatCurrencyForPDF(calculations.sgst), valueX, currentY, { align: 'right' });
    currentY += lineHeight;
  } else {
    doc.text(`IGST (${gstFullRate}%):`, totalsStartX, currentY);
    doc.text(formatCurrencyForPDF(calculations.igst), valueX, currentY, { align: 'right' });
    currentY += lineHeight;
  }
  
  // Divider line for totals
  currentY += 4;
  doc.setLineWidth(0.8);
  doc.line(totalsStartX, currentY, valueX, currentY);
  currentY += 10;
  
  // Grand Total - Bold and larger
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', totalsStartX, currentY);
  doc.text(formatCurrencyForPDF(calculations.grandTotal), valueX, currentY, { align: 'right' });

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Save PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
