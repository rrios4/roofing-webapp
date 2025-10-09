import React from 'react';
import { Page, Document, StyleSheet } from '@react-pdf/renderer';
import { Quote, QuoteLineItem, Customer, Service, QuoteStatus } from '../../types/db_types';
import {
  QuoteHeader,
  QuoteCustomerInfo,
  QuoteItemsTable,
  QuoteSummary,
  QuoteFooter
} from './quote-doc';

// Extended quote line item with service relation
export interface QuoteLineItemWithService extends QuoteLineItem {
  service?: Service;
}

// Extended quote type with related data for PDF generation
export interface QuoteDocumentData extends Quote {
  customer: Customer;
  service?: Service;
  quote_status?: QuoteStatus;
  quote_line_item?: QuoteLineItemWithService[];
}

interface ModernQuoteDocumentProps {
  quote: QuoteDocumentData;
}

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    paddingTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 25,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    lineHeight: 1.3
  }
});

export const ModernQuoteDocument: React.FC<ModernQuoteDocumentProps> = ({ quote }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo, quote info, and status */}
        <QuoteHeader quote={quote} />

        {/* Customer and quote information */}
        <QuoteCustomerInfo quote={quote} />

        {/* Line items table */}
        <QuoteItemsTable quote={quote} />

        {/* Summary with totals and expiration */}
        <QuoteSummary quote={quote} />

        {/* Footer with notes and company info */}
        <QuoteFooter quote={quote} />
      </Page>
    </Document>
  );
};

export default ModernQuoteDocument;
