export interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  lineTotal: number;
}

export interface InvoiceData {
  businessName: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentMode: string;
  taxType: 'cgst_sgst' | 'igst';
  items: InvoiceItem[];
}

export const BUSINESSES = [
  'Asmit Electronics',
  'Asmit Pharmacy',
  'Asmit General Store',
] as const;

export const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Bank Transfer'] as const;
