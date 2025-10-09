import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuoteDocumentData } from '../modern-quote-doc';
import { formatNumber } from '../../../lib/utils';

interface QuoteFooterProps {
  quote: QuoteDocumentData;
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
  quoteInfo: {
    flex: 1,
    textAlign: 'right'
  },
  quoteTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2
  },
  quoteText: {
    fontSize: 6,
    color: '#4b5563',
    marginBottom: 0.5
  },
  acceptanceSection: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 3,
    borderLeftWidth: 2,
    borderLeftColor: '#f59e0b'
  },
  acceptanceTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 2
  },
  acceptanceText: {
    fontSize: 7,
    color: '#78350f',
    lineHeight: 1.2
  }
});

export const QuoteFooter: React.FC<QuoteFooterProps> = ({ quote }) => {
  return (
    <View style={styles.container}>
      {/* Quote Acceptance Section */}
      <View style={styles.acceptanceSection}>
        <Text style={styles.acceptanceTitle}>Quote Acceptance</Text>
        <Text style={styles.acceptanceText}>
          To accept this quote, please contact us at 832-310-3593 or rrios.roofing@gmail.com. This
          quote is valid until the expiration date shown above.
        </Text>
      </View>

      {/* Notes Section */}
      {(quote.public_note || quote.cust_note) && (
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesText}>{quote.public_note || quote.cust_note}</Text>
        </View>
      )}

      {/* Footer Content */}
      <View style={styles.footerContent}>
        {/* Company Info */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>RIOS ROOFING</Text>
          <Text style={styles.companyAddress}>150 Tallant St</Text>
          <Text style={styles.companyAddress}>Houston, TX 77076</Text>
          <Text style={styles.companyContact}>rrios.roofing@gmail.com</Text>
        </View>

        {/* Thank You Message */}
        <View style={styles.thankYou}>
          <Text style={styles.thankYouText}>Thank you for considering us!</Text>
          <Text style={styles.tagline}>Your trusted roofing partner</Text>
        </View>

        {/* Quote Information */}
        <View style={styles.quoteInfo}>
          <Text style={styles.quoteTitle}>Quote Information</Text>
          <Text style={styles.quoteText}>
            Quote reference: QT-{formatNumber(quote.quote_number || 0)}
          </Text>
          <Text style={styles.quoteText}>Questions? Contact us at:</Text>
          <Text style={styles.quoteText}>832-310-3593</Text>
          <Text style={styles.quoteText}>rrios.roofing@gmail.com</Text>
        </View>
      </View>
    </View>
  );
};
