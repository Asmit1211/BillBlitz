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
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
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

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.businessName, pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('TAX INVOICE', pageWidth / 2, 33, { align: 'center' });

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(14, 38, pageWidth - 14, 38);

  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, 14, 48);
  doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, pageWidth - 14, 48, { align: 'right' });
  doc.text(`Payment Mode: ${invoice.paymentMode}`, 14, 55);
  doc.text(`Tax Type: ${invoice.taxType === 'cgst_sgst' ? 'CGST + SGST' : 'IGST'}`, pageWidth - 14, 55, { align: 'right' });

  // Items table
  const tableData = invoice.items.map((item, index) => [
    index + 1,
    item.productName,
    item.quantity,
    formatCurrency(item.pricePerUnit),
    formatCurrency(item.lineTotal),
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['#', 'Product', 'Qty', 'Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
  });

  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totals section
  const totalsX = pageWidth - 70;
  let currentY = finalY;

  doc.setFontSize(10);
  doc.text('Subtotal:', totalsX, currentY);
  doc.text(formatCurrency(calculations.subtotal), pageWidth - 14, currentY, { align: 'right' });

  currentY += 7;
  if (invoice.taxType === 'cgst_sgst') {
    doc.text('CGST (9%):', totalsX, currentY);
    doc.text(formatCurrency(calculations.cgst), pageWidth - 14, currentY, { align: 'right' });
    currentY += 7;
    doc.text('SGST (9%):', totalsX, currentY);
    doc.text(formatCurrency(calculations.sgst), pageWidth - 14, currentY, { align: 'right' });
  } else {
    doc.text('IGST (18%):', totalsX, currentY);
    doc.text(formatCurrency(calculations.igst), pageWidth - 14, currentY, { align: 'right' });
  }

  currentY += 10;
  doc.setLineWidth(0.3);
  doc.line(totalsX - 5, currentY - 3, pageWidth - 14, currentY - 3);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', totalsX, currentY + 2);
  doc.text(formatCurrency(calculations.grandTotal), pageWidth - 14, currentY + 2, { align: 'right' });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business!', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

  // Save PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
