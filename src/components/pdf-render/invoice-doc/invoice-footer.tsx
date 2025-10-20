import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceDocumentData, PDFDisplayOptions } from '../modern-invoice-doc';

interface InvoiceFooterProps {
  invoice: InvoiceDocumentData;
  displayOptions?: PDFDisplayOptions;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto', // Push to bottom of page
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  notesSection: {
    marginBottom: 10
  },
  notesTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3
  },
  notesText: {
    fontSize: 7,
    color: '#4b5563',
    lineHeight: 1.2
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  companyInfo: {
    flex: 1
  },
  companyName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 1
  },
  companyAddress: {
    fontSize: 6,
    color: '#6b7280',
    marginBottom: 0.5
  },
  companyContact: {
    fontSize: 6,
    color: '#6b7280'
  },
  thankYou: {
    flex: 1,
    textAlign: 'center'
  },
  thankYouText: {
    fontSize: 8,
    color: '#3b82f6',
    fontWeight: 'medium',
    marginBottom: 1
  },
  tagline: {
    fontSize: 6,
    color: '#6b7280',
    fontStyle: 'italic'
  },
  paymentInfo: {
    flex: 1,
    textAlign: 'right'
  },
  paymentTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2
  },
  paymentText: {
    fontSize: 6,
    color: '#4b5563',
    marginBottom: 0.5
  }
});

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  invoice,
  displayOptions = {
    showPaymentHistory: true,
    showCustomerNotes: true,
    showPaymentInformation: true
  }
}) => {
  return (
    <View style={styles.container}>
      {/* Notes Section */}
      {displayOptions.showCustomerNotes && (invoice.public_note || invoice.cust_note) && (
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>{invoice.public_note || invoice.cust_note}</Text>
        </View>
      )}

      {/* Footer Content */}
      <View style={styles.footerContent}>
        {/* Company Info */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>RIOS ROOFING</Text>
          <Text style={styles.companyAddress}>
            {invoice.bill_from_street_address || '150 Tallant St'}
          </Text>
          <Text style={styles.companyAddress}>
            {invoice.bill_from_city || 'Houston'}, {invoice.bill_from_state || 'TX'}{' '}
            {invoice.bill_from_zipcode || '77076'}
          </Text>
          <Text style={styles.companyContact}>
            {invoice.bill_from_email || 'info@riosroofing.com'}
          </Text>
        </View>

        {/* Thank You Message */}
        <View style={styles.thankYou}>
          <Text style={styles.thankYouText}>Thank you for your business!</Text>
          <Text style={styles.tagline}>Your trusted roofing partner</Text>
        </View>

        {/* Payment Information */}
        {displayOptions.showPaymentInformation && (
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Payment Information</Text>
            <Text style={styles.paymentText}>Payment is due within 30 days</Text>
            <Text style={styles.paymentText}>
              Please reference Invoice #{invoice.invoice_number}
            </Text>
            <Text style={styles.paymentText}>Questions? Contact us at:</Text>
            <Text style={styles.paymentText}>
              {invoice.bill_from_email || 'info@riosroofing.com'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
