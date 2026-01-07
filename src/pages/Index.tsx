import { FileDown, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BusinessSelector } from '@/components/invoice/BusinessSelector';
import { InvoiceInfo } from '@/components/invoice/InvoiceInfo';
import { ProductForm } from '@/components/invoice/ProductForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { useInvoice } from '@/hooks/useInvoice';
import { generateInvoicePdf } from '@/utils/generatePdf';

const Index = () => {
  const { invoice, updateInvoice, addItem, removeItem, calculations, resetInvoice } = useInvoice();

  const handleDownloadPdf = () => {
    if (invoice.items.length === 0) return;
    generateInvoicePdf(invoice, calculations);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">GST Invoice Generator</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetInvoice}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={invoice.items.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Forms */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Details</CardTitle>
              </CardHeader>
              <CardContent>
                <BusinessSelector
                  value={invoice.businessName}
                  onChange={(value) => updateInvoice({ businessName: value })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Information</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceInfo invoice={invoice} onUpdate={updateInvoice} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Product</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductForm onAddItem={addItem} />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <InvoicePreview
              invoice={invoice}
              calculations={calculations}
              onRemoveItem={removeItem}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
