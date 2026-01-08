import { useState, useMemo } from 'react';
import { InvoiceData, InvoiceItem, SHOP_TYPES, BusinessDetails } from '@/types/invoice';

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}-${random}`;
};

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const getDefaultBusinessDetails = (): BusinessDetails => ({
  branch: 'Main Branch',
  address: '123 Business Street, City, State - 123456',
  contactNumber: '+91 98765 43210',
  gstin: '22AAAAA0000A1Z5',
  cashierName: 'Asmit Samal',
  counterNumber: 'Counter 1',
});

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    businessName: 'BillBlitz Electronics',
    shopType: SHOP_TYPES[1], // Electronics - 18% GST
    businessDetails: getDefaultBusinessDetails(),
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: getTodayDate(),
    paymentMode: 'Cash',
    taxType: 'cgst_sgst',
    items: [],
  });

  const [selectedBusiness, setSelectedBusiness] = useState<string>('BillBlitz Electronics');
  const [customBusinessName, setCustomBusinessName] = useState<string>('');

  const updateInvoice = (updates: Partial<InvoiceData>) => {
    setInvoice((prev) => ({ ...prev, ...updates }));
  };

  const updateBusinessSelection = (business: string, customName?: string) => {
    setSelectedBusiness(business);
    if (business === 'Custom Business Name') {
      setCustomBusinessName(customName || '');
      updateInvoice({ businessName: customName || '' });
    } else {
      setCustomBusinessName('');
      updateInvoice({ businessName: business });
    }
  };

  const updateShopType = (shopType: typeof SHOP_TYPES[0]) => {
    updateInvoice({ shopType });
  };

  const updateBusinessDetails = (businessDetails: BusinessDetails) => {
    updateInvoice({ businessDetails });
  };

  const addItem = (productName: string, quantity: number, pricePerUnit: number) => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      productName,
      quantity,
      pricePerUnit,
      lineTotal: quantity * pricePerUnit,
    };
    setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const calculations = useMemo(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxRate = invoice.shopType.gstRate; // Use dynamic GST rate from shop type
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    return {
      subtotal,
      taxAmount,
      grandTotal,
      cgst: invoice.taxType === 'cgst_sgst' ? taxAmount / 2 : 0,
      sgst: invoice.taxType === 'cgst_sgst' ? taxAmount / 2 : 0,
      igst: invoice.taxType === 'igst' ? taxAmount : 0,
      gstRate: taxRate,
    };
  }, [invoice.items, invoice.taxType, invoice.shopType.gstRate]);

  const resetInvoice = () => {
    setSelectedBusiness('BillBlitz Electronics');
    setCustomBusinessName('');
    setInvoice({
      businessName: 'BillBlitz Electronics',
      shopType: SHOP_TYPES[1], // Electronics - 18% GST
      businessDetails: getDefaultBusinessDetails(),
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: getTodayDate(),
      paymentMode: 'Cash',
      taxType: 'cgst_sgst',
      items: [],
    });
  };

  return {
    invoice,
    selectedBusiness,
    customBusinessName,
    updateInvoice,
    updateBusinessSelection,
    updateShopType,
    updateBusinessDetails,
    addItem,
    removeItem,
    calculations,
    resetInvoice,
  };
};
