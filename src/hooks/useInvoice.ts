import { useState, useMemo } from 'react';
import { InvoiceData, InvoiceItem } from '@/types/invoice';

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

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    businessName: 'Asmit Electronics',
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: getTodayDate(),
    paymentMode: 'Cash',
    taxType: 'cgst_sgst',
    items: [],
  });

  const updateInvoice = (updates: Partial<InvoiceData>) => {
    setInvoice((prev) => ({ ...prev, ...updates }));
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
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    return {
      subtotal,
      taxAmount,
      grandTotal,
      cgst: invoice.taxType === 'cgst_sgst' ? taxAmount / 2 : 0,
      sgst: invoice.taxType === 'cgst_sgst' ? taxAmount / 2 : 0,
      igst: invoice.taxType === 'igst' ? taxAmount : 0,
    };
  }, [invoice.items, invoice.taxType]);

  const resetInvoice = () => {
    setInvoice({
      businessName: 'Asmit Electronics',
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: getTodayDate(),
      paymentMode: 'Cash',
      taxType: 'cgst_sgst',
      items: [],
    });
  };

  return {
    invoice,
    updateInvoice,
    addItem,
    removeItem,
    calculations,
    resetInvoice,
  };
};
