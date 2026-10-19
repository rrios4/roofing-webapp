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
import { CloudDownloadIcon, XIcon, FileBadgeIcon, LoaderIcon } from 'lucide-react';
import { ModernProposalDocument, ProposalDocumentData } from './pdf-render/modern-proposal-doc';
import { formatNumber } from '../lib/utils';

interface ProposalPDFPreviewDialogProps {
  quote: ProposalDocumentData;
  trigger?: React.ReactNode;
  // Optional controlled mode — when provided, the dialog can be opened without a trigger
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ProposalPDFPreviewDialog: React.FC<ProposalPDFPreviewDialogProps> = ({
  quote,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = controlledOnOpenChange ?? setInternalOpen;
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsPreviewLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsPreviewLoading(true);
    }
  }, [isOpen]);

  // Don't render if quote is missing required data
  if (!quote || !quote.customer) {
    return <>{trigger ?? null}</>;
  }

  const getProposalFileName = () => {
    const quoteNumber = formatNumber(quote.quote_number || 0);
    const customerName = quote.customer
      ? `${quote.customer.first_name}_${quote.customer.last_name}`.replace(/\s+/g, '_')
      : 'Unknown_Customer';
    return `PROPOSAL_QT-${quoteNumber}_${customerName}.pdf`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-full h-full max-w-full max-h-full p-0 sm:max-w-6xl sm:max-h-[95vh] sm:p-6 flex flex-col sm:rounded-lg">
        <DialogHeader className="flex-shrink-0 p-6 sm:p-0">
          <DialogTitle className="flex items-center gap-2">
            <FileBadgeIcon className="w-5 h-5 text-blue-600" />
            Roofing Proposal Preview
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>
              Preview and download proposal for QT-{formatNumber(quote.quote_number || 0)}
            </span>
            <Badge variant="outline" className="ml-2">
              {quote.customer
                ? `${quote.customer.first_name} ${quote.customer.last_name}`
                : 'Unknown Customer'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-0">
          {/* PDF Preview Container */}
          <div className="min-h-[500px] relative border-0 sm:border border-gray-200 sm:rounded-lg overflow-hidden bg-gray-50 mb-4">
            {isPreviewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <LoaderIcon className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-sm text-muted-foreground">Loading PDF preview...</p>
                </div>
              </div>
            )}

            <PDFViewer width="100%" height="600px" className="border-0">
              <ModernProposalDocument quote={quote} />
            </PDFViewer>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0 border-t px-6 sm:px-0 sm:space-x-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
            <FileBadgeIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">File: {getProposalFileName()}</span>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <XIcon className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <PDFDownloadLink
              document={<ModernProposalDocument quote={quote} />}
              fileName={getProposalFileName()}>
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

export default ProposalPDFPreviewDialog;
