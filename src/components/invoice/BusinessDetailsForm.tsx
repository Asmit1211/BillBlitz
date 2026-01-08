import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusinessDetails } from '@/types/invoice';

interface BusinessDetailsFormProps {
  businessDetails: BusinessDetails;
  onChange: (details: BusinessDetails) => void;
}

export const BusinessDetailsForm = ({ businessDetails, onChange }: BusinessDetailsFormProps) => {
  const handleChange = (field: keyof BusinessDetails, value: string) => {
    onChange({
      ...businessDetails,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="branch">Branch / Location</Label>
          <Input
            id="branch"
            placeholder="Main Branch"
            value={businessDetails.branch}
            onChange={(e) => handleChange('branch', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            placeholder="+91 98765 43210"
            value={businessDetails.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Business Street, City, State - 123456"
          value={businessDetails.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN Number</Label>
          <Input
            id="gstin"
            placeholder="22AAAAA0000A1Z5"
            value={businessDetails.gstin}
            onChange={(e) => handleChange('gstin', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cashierName">Cashier Name</Label>
          <Input
            id="cashierName"
            placeholder="Asmit Samal"
            value={businessDetails.cashierName}
            onChange={(e) => handleChange('cashierName', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="counterNumber">Counter Number (Optional)</Label>
        <Input
          id="counterNumber"
          placeholder="Counter 1"
          value={businessDetails.counterNumber}
          onChange={(e) => handleChange('counterNumber', e.target.value)}
        />
      </div>
    </div>
  );
};