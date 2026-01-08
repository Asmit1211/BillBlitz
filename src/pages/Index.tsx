import { useState } from 'react';
import { FileDown, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Confetti } from '@/components/ui/confetti';
import { Footer } from '@/components/footer';
import { BusinessSelector } from '@/components/invoice/BusinessSelector';
import { ShopTypeSelector } from '@/components/invoice/ShopTypeSelector';
import { BusinessDetailsForm } from '@/components/invoice/BusinessDetailsForm';
import { InvoiceInfo } from '@/components/invoice/InvoiceInfo';
import { ProductForm } from '@/components/invoice/ProductForm';
import { InvoicePreview } from '@/components/invoice/InvoicePreview';
import { useInvoice } from '@/hooks/useInvoice';
import { generateInvoicePdf } from '@/utils/generatePdf';

const Index = () => {
  const { 
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
    resetInvoice 
  } = useInvoice();

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDownloadPdf = async () => {
    if (invoice.items.length === 0) return;
    
    setIsGeneratingPdf(true);
    
    try {
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      generateInvoicePdf(invoice, calculations);
      
      // Trigger confetti after successful generation
      setShowConfetti(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Confetti Animation */}
      <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="BillBlitz Logo" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-bold text-gray-900">BillBlitz</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetInvoice}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={invoice.items.length === 0 || isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Forms */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BusinessSelector
                  selectedBusiness={selectedBusiness}
                  customBusinessName={customBusinessName}
                  onBusinessChange={updateBusinessSelection}
                />
                <ShopTypeSelector
                  value={invoice.shopType}
                  onChange={updateShopType}
                />
                <Separator />
                <BusinessDetailsForm
                  businessDetails={invoice.businessDetails}
                  onChange={updateBusinessDetails}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
