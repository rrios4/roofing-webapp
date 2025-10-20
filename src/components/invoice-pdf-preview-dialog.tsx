import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { CloudDownloadIcon, XIcon, FileTextIcon, LoaderIcon, CheckIcon } from 'lucide-react';
import { ModernInvoiceDocument, InvoiceDocumentData } from './pdf-render/modern-invoice-doc';

interface PDFDisplayOptions {
  showPaymentHistory: boolean;
  showCustomerNotes: boolean;
  showPaymentInformation: boolean;
}

interface InvoicePDFPreviewDialogProps {
  invoice: InvoiceDocumentData;
  trigger: React.ReactNode;
}

export const InvoicePDFPreviewDialog: React.FC<InvoicePDFPreviewDialogProps> = ({
  invoice,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [displayOptions, setDisplayOptions] = useState<PDFDisplayOptions>({
    showPaymentHistory: true,
    showCustomerNotes: true,
    showPaymentInformation: true
  });

  useEffect(() => {
    if (isOpen) {
      // Set a timeout to simulate loading
      const timer = setTimeout(() => {
        setIsPreviewLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsPreviewLoading(true);
    }
  }, [isOpen]);

  // Don't render if invoice is missing required data
  if (!invoice || !invoice.customer) {
    return trigger;
  }

  const formatNumber = (num: number) => {
    return num.toString().padStart(4, '0');
  };

  const getInvoiceFileName = () => {
    const invoiceNumber = formatNumber(invoice.invoice_number || 0);
    const customerName = invoice.customer
      ? `${invoice.customer.first_name}_${invoice.customer.last_name}`.replace(/\s+/g, '_')
      : 'Unknown_Customer';
    return `INV-${invoiceNumber}_${customerName}.pdf`;
  };

  const toggleOption = (option: keyof PDFDisplayOptions) => {
    setDisplayOptions((prev) => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full h-full max-w-full max-h-full p-0 sm:max-w-6xl sm:max-h-[95vh] sm:p-6 flex flex-col sm:rounded-lg">
        <DialogHeader className="flex-shrink-0 p-6 sm:p-0">
          <DialogTitle className="flex items-center gap-2">
            <FileTextIcon className="w-5 h-5 text-blue-600" />
            Invoice PDF Preview
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>
              Preview and download invoice INV-{formatNumber(invoice.invoice_number || 0)}
            </span>
            <Badge variant="outline" className="ml-2">
              {invoice.customer
                ? `${invoice.customer.first_name} ${invoice.customer.last_name}`
                : 'Unknown Customer'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-0">
          {/* Display Options */}
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
              PDF Display Options
            </h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={displayOptions.showPaymentHistory}
                  onCheckedChange={() => toggleOption('showPaymentHistory')}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show Payment History
                </span>
                {displayOptions.showPaymentHistory && (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                )}
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={displayOptions.showCustomerNotes}
                  onCheckedChange={() => toggleOption('showCustomerNotes')}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show Customer Notes
                </span>
                {displayOptions.showCustomerNotes && (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                )}
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={displayOptions.showPaymentInformation}
                  onCheckedChange={() => toggleOption('showPaymentInformation')}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show Payment Information
                </span>
                {displayOptions.showPaymentInformation && (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                )}
              </label>
            </div>
          </div>

          {/* PDF Preview Container */}
          <div className="min-h-[500px] relative border-0 sm:border border-gray-200 sm:rounded-lg overflow-hidden bg-gray-50 mb-4">
            {isPreviewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <LoaderIcon className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-600">Loading PDF preview...</p>
                </div>
              </div>
            )}

            <PDFViewer width="100%" height="500px" className="border-0">
              <ModernInvoiceDocument invoice={invoice} displayOptions={displayOptions} />
            </PDFViewer>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 flex flex-row justify-between items-center pt-4 border-t px-6 sm:px-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileTextIcon className="w-4 h-4" />
            <span>File: {getInvoiceFileName()}</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <XIcon className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <PDFDownloadLink
              document={<ModernInvoiceDocument invoice={invoice} displayOptions={displayOptions} />}
              fileName={getInvoiceFileName()}>
              {({ loading }) => (
                <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <CloudDownloadIcon className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
