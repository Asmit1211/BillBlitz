export interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  lineTotal: number;
}

export interface ShopType {
  name: string;
  gstRate: number;
}

export interface BusinessDetails {
  branch: string;
  address: string;
  contactNumber: string;
  gstin: string;
  cashierName: string;
  counterNumber: string;
}

export interface InvoiceData {
  businessName: string;
  shopType: ShopType;
  businessDetails: BusinessDetails;
  invoiceNumber: string;
  invoiceDate: string;
  paymentMode: string;
  taxType: 'cgst_sgst' | 'igst';
  items: InvoiceItem[];
}

export const SHOP_TYPES: ShopType[] = [
  { name: 'Pharmacy', gstRate: 0.12 },
  { name: 'Electronics', gstRate: 0.18 },
  { name: 'General Store', gstRate: 0.00 },
  { name: 'Luxury Store', gstRate: 0.28 },
];

export const BUSINESSES = [
  'BillBlitz Pharmacy',
  'BillBlitz Electronics',
  'BillBlitz General Store',
  'BillBlitz Luxury Store',
  'Custom Business Name',
] as const;

export const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Bank Transfer'] as const;
