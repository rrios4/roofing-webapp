import type { InvoiceDocumentData } from '../components/pdf-render/modern-invoice-doc';

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