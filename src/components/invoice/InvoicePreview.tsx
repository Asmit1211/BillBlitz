import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { Separator } from '@/components/ui/separator';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  calculations: {
    subtotal: number;
    taxAmount: number;
    grandTotal: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  onRemoveItem: (id: string) => void;
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

export const InvoicePreview = ({
  invoice,
  calculations,
  onRemoveItem,
}: InvoicePreviewProps) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{invoice.businessName}</h2>
        <p className="text-sm text-gray-500 mt-1">TAX INVOICE</p>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Invoice No.</p>
          <p className="font-medium">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Date</p>
          <p className="font-medium">{formatDate(invoice.invoiceDate)}</p>
        </div>
        <div>
          <p className="text-gray-500">Payment Mode</p>
          <p className="font-medium">{invoice.paymentMode}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Tax Type</p>
          <p className="font-medium">
            {invoice.taxType === 'cgst_sgst' ? 'CGST + SGST' : 'IGST'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Items Table */}
      {invoice.items.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No items added yet</p>
          <p className="text-sm">Add products from the form on the left</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item: InvoiceItem) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.pricePerUnit)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.lineTotal)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Totals */}
      {invoice.items.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(calculations.subtotal)}</span>
            </div>

            {invoice.taxType === 'cgst_sgst' ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">CGST (9%)</span>
                  <span>{formatCurrency(calculations.cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SGST (9%)</span>
                  <span>{formatCurrency(calculations.sgst)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span className="text-gray-500">IGST (18%)</span>
                <span>{formatCurrency(calculations.igst)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Grand Total</span>
              <span className="text-primary">{formatCurrency(calculations.grandTotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
