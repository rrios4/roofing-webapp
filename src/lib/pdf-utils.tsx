import type { InvoiceDocumentData } from '../components/pdf-render/modern-invoice-doc';
import type { QuoteDocumentData } from '../components/pdf-render/modern-quote-doc-final';

// Helper function to transform invoice data from the API to the PDF format
export const transformInvoiceForPDF = (invoice: any): InvoiceDocumentData => {
  return {
    ...invoice,
    // Transform invoice_line_service to invoice_line_services with service relation
    invoice_line_services:
      invoice.invoice_line_service?.map((item: any) => ({
        ...item,
        service: invoice.service
      })) || [],
    // Ensure invoice_payment is properly formatted
    invoice_payment:
      invoice.invoice_payment?.map((payment: any) => ({
        id: payment.id,
        date_received: payment.date_received,
        payment_method: payment.payment_method,
        amount: payment.amount
      })) || []
  };
};

// Helper function to transform quote data from the API to the PDF format
export const transformQuoteForPDF = (quote: any): QuoteDocumentData => {
  return {
    ...quote,
    // Transform quote_line_item to include service relation if available
    quote_line_item:
      quote.quote_line_item?.map((item: any) => ({
        ...item,
        service: item.service || quote.service
      })) || []
  };
};

// Helper function to generate invoice PDF as base64 for email attachment
// Note: This function is now implemented directly in the email form component
// to avoid JSX compilation issues in utility files

// Helper function to get invoice PDF filename
export const getInvoicePDFFilename = (invoice: InvoiceDocumentData): string => {
  const formatNumber = (num: number) => num.toString().padStart(4, '0');
  const invoiceNumber = formatNumber(invoice.invoice_number || 0);
  const customerName = invoice.customer
    ? `${invoice.customer.first_name}_${invoice.customer.last_name}`.replace(/\s+/g, '_')
    : 'Unknown_Customer';
  return `INV-${invoiceNumber}_${customerName}.pdf`;
};
