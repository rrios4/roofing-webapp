import type { InvoiceDocumentData } from '../components/pdf-render/modern-invoice-doc';
import type { QuoteDocumentData } from '../components/pdf-render/modern-quote-doc-final';

// Helper function to transform invoice data from the API to the PDF format
export const transformInvoiceForPDF = (invoice: any): InvoiceDocumentData => {
  return {
    ...invoice,
    // Transform invoice_line_service to invoice_line_services with service relation
    invoice_line_services: invoice.invoice_line_service?.map((item: any) => ({
      ...item,
      service: invoice.service
    })) || [],
    // Ensure invoice_payment is properly formatted
    invoice_payment: invoice.invoice_payment?.map((payment: any) => ({
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
    quote_line_item: quote.quote_line_item?.map((item: any) => ({
      ...item,
      service: item.service || quote.service
    })) || []
  };
};