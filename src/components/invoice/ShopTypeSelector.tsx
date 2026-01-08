import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SHOP_TYPES, ShopType } from '@/types/invoice';

interface ShopTypeSelectorProps {
  value: ShopType;
  onChange: (shopType: ShopType) => void;
}

export const ShopTypeSelector = ({ value, onChange }: ShopTypeSelectorProps) => {
  const handleChange = (shopTypeName: string) => {
    const selectedShopType = SHOP_TYPES.find(type => type.name === shopTypeName);
    if (selectedShopType) {
      onChange(selectedShopType);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="shopType">Shop / Store Type</Label>
      <Select value={value.name} onValueChange={handleChange}>
        <SelectTrigger id="shopType">
          <SelectValue placeholder="Select shop type" />
        </SelectTrigger>
        <SelectContent>
          {SHOP_TYPES.map((shopType) => (
            <SelectItem key={shopType.name} value={shopType.name}>
              {shopType.name} ({(shopType.gstRate * 100).toFixed(0)}% GST)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500">
        Current GST Rate: {(value.gstRate * 100).toFixed(0)}%
      </p>
    </div>
  );
};