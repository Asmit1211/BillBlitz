import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PAYMENT_MODES, InvoiceData } from '@/types/invoice';

interface InvoiceInfoProps {
  invoice: InvoiceData;
  onUpdate: (updates: Partial<InvoiceData>) => void;
}

export const InvoiceInfo = ({ invoice, onUpdate }: InvoiceInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={invoice.invoiceNumber}
            onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceDate">Invoice Date</Label>
          <Input
            id="invoiceDate"
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => onUpdate({ invoiceDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMode">Payment Mode</Label>
        <Select
          value={invoice.paymentMode}
          onValueChange={(value) => onUpdate({ paymentMode: value })}
        >
          <SelectTrigger id="paymentMode">
            <SelectValue placeholder="Select payment mode" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_MODES.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tax Type</Label>
        <RadioGroup
          value={invoice.taxType}
          onValueChange={(value: 'cgst_sgst' | 'igst') => onUpdate({ taxType: value })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cgst_sgst" id="cgst_sgst" />
            <Label htmlFor="cgst_sgst" className="font-normal cursor-pointer">
              CGST + SGST (9% + 9%)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="igst" id="igst" />
            <Label htmlFor="igst" className="font-normal cursor-pointer">
              IGST (18%)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
