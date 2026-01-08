import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BUSINESSES } from '@/types/invoice';

interface BusinessSelectorProps {
  selectedBusiness: string;
  customBusinessName: string;
  onBusinessChange: (business: string, customName?: string) => void;
}

export const BusinessSelector = ({ 
  selectedBusiness, 
  customBusinessName, 
  onBusinessChange 
}: BusinessSelectorProps) => {
  const handleSelectChange = (value: string) => {
    onBusinessChange(value, customBusinessName);
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customName = e.target.value;
    onBusinessChange('Custom Business Name', customName);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="business">Business Name</Label>
      <Select value={selectedBusiness} onValueChange={handleSelectChange}>
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
      
      {selectedBusiness === 'Custom Business Name' && (
        <div className="mt-2">
          <Input
            placeholder="Enter your business name"
            value={customBusinessName}
            onChange={handleCustomNameChange}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
