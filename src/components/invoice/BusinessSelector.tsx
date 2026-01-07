import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BUSINESSES } from '@/types/invoice';

interface BusinessSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const BusinessSelector = ({ value, onChange }: BusinessSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="business">Business Name</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="business">
          <SelectValue placeholder="Select business" />
        </SelectTrigger>
        <SelectContent>
          {BUSINESSES.map((business) => (
            <SelectItem key={business} value={business}>
              {business}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
