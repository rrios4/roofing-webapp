import type { QuoteDocumentData } from '../modern-quote-doc-final';

// Data shape for the roofing proposal PDF. Extends the existing quote PDF
// data shape with the shingle selection columns and the joined customer_type
// label, both added specifically to support this document.
export interface ProposalDocumentData extends QuoteDocumentData {
  shingle_brand?: string;
  shingle_model?: string;
  shingle_color?: string;
  customer?: QuoteDocumentData['customer'] & {
    customer_type?: {
      name?: string;
    };
  };
}
