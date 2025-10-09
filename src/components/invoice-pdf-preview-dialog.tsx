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
import { CloudDownloadIcon, XIcon, FileTextIcon, LoaderIcon } from 'lucide-react';
import { ModernInvoiceDocument, InvoiceDocumentData } from './pdf-render/modern-invoice-doc';

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full h-full max-w-full max-h-full p-0 sm:max-w-5xl sm:max-h-[90vh] sm:p-6 flex flex-col sm:rounded-lg">
        <DialogHeader className="p-6 sm:p-0">
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

        {/* PDF Preview Container */}
        <div className="flex-1 min-h-[500px] relative border-0 sm:border border-gray-200 sm:rounded-lg overflow-hidden bg-gray-50 mx-6 sm:mx-0">
          {isPreviewLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="flex flex-col items-center gap-3">
                <LoaderIcon className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Loading PDF preview...</p>
              </div>
            </div>
          )}

          <PDFViewer
            width="100%"
            height="100%"
            className="border-0 min-h-[calc(100vh-200px)] sm:min-h-[500px]">
            <ModernInvoiceDocument invoice={invoice} />
          </PDFViewer>
        </div>

        <DialogFooter className="flex flex-row justify-between items-center pt-4 border-t px-6 sm:px-0">
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
              document={<ModernInvoiceDocument invoice={invoice} />}
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
