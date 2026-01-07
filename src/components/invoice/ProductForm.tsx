import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductFormProps {
  onAddItem: (productName: string, quantity: number, pricePerUnit: number) => void;
}

export const ProductForm = ({ onAddItem }: ProductFormProps) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseFloat(quantity);
    const price = parseFloat(pricePerUnit);

    if (!productName.trim() || isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) {
      return;
    }

    onAddItem(productName.trim(), qty, price);
    setProductName('');
    setQuantity('');
    setPricePerUnit('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            step="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricePerUnit">Price per Unit (₹)</Label>
          <Input
            id="pricePerUnit"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </form>
  );
};
