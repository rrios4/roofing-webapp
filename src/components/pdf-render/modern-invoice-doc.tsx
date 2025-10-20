import React from 'react';
import { Page, Document, StyleSheet } from '@react-pdf/renderer';
import { Invoice, InvoiceLineService, Customer, Service } from '../../types/db_types';
import { InvoiceHeader } from './invoice-doc/invoice-header';
import { InvoiceCustomerInfo } from './invoice-doc/invoice-customer-info';
import { InvoiceItemsTable } from './invoice-doc/invoice-items-table';
import { InvoicePayments } from './invoice-doc/invoice-payments';
import { InvoiceSummary } from './invoice-doc/invoice-summary';
import { InvoiceFooter } from './invoice-doc/invoice-footer';

// Extended invoice line service with service relation
export interface InvoiceLineServiceWithService extends InvoiceLineService {
  service?: Service;
}

// Extended invoice type with related data for PDF generation
export interface InvoiceDocumentData extends Invoice {
  customer: Customer;
  invoice_line_services?: InvoiceLineServiceWithService[];
  invoice_payment?: Array<{
    id: number;
    date_received: string;
    payment_method: string;
    amount: number;
  }>;
}

export interface PDFDisplayOptions {
  showPaymentHistory: boolean;
  showCustomerNotes: boolean;
  showPaymentInformation: boolean;
}

interface ModernInvoiceDocumentProps {
  invoice: InvoiceDocumentData;
  displayOptions?: PDFDisplayOptions;
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

export const ModernInvoiceDocument: React.FC<ModernInvoiceDocumentProps> = ({
  invoice,
  displayOptions = {
    showPaymentHistory: true,
    showCustomerNotes: true,
    showPaymentInformation: true
  }
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo, invoice info, and status */}
        <InvoiceHeader invoice={invoice} />

        {/* Customer and billing information */}
        <InvoiceCustomerInfo invoice={invoice} />

        {/* Line items table */}
        <InvoiceItemsTable invoice={invoice} />

        {/* Payment history (if any) */}
        {displayOptions.showPaymentHistory && <InvoicePayments invoice={invoice} />}

        {/* Summary with totals */}
        <InvoiceSummary invoice={invoice} />

        {/* Footer with notes and company info */}
        <InvoiceFooter invoice={invoice} displayOptions={displayOptions} />
      </Page>
    </Document>
  );
};

export default ModernInvoiceDocument;
