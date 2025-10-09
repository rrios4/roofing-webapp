import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { QuoteDocumentData } from '../modern-quote-doc';
import { formatDate } from '../../../lib/utils';

interface QuoteSummaryProps {
  quote: QuoteDocumentData;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15
  },
  summaryBox: {
    width: '45%',
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  subtotalRow: {
    backgroundColor: 'transparent'
  },
  totalRow: {
    backgroundColor: '#dbeafe',
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#3b82f6'
  },
  expirationRow: {
    backgroundColor: '#fef3c7',
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#f59e0b'
  },
  expiredRow: {
    backgroundColor: '#fee2e2',
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#ef4444'
  },
  label: {
    fontSize: 8,
    color: '#374151'
  },
  value: {
    fontSize: 8,
    color: '#1f2937',
    fontWeight: 'medium'
  },
  totalLabel: {
    fontSize: 9,
    color: '#1e40af',
    fontWeight: 'bold'
  },
  totalValue: {
    fontSize: 9,
    color: '#1e40af',
    fontWeight: 'bold'
  },
  expirationLabel: {
    fontSize: 8,
    color: '#d97706',
    fontWeight: 'bold'
  },
  expirationValue: {
    fontSize: 8,
    color: '#d97706',
    fontWeight: 'medium'
  },
  expiredLabel: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold'
  },
  expiredValue: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'medium'
  }
});

export const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote }) => {
  const formatMoney = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateSubtotal = () => {
    if (!quote.quote_line_item || quote.quote_line_item.length === 0) {
      return quote.subtotal || 0;
    }
    // Use the actual amount from each line item
    return quote.quote_line_item.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);
  };

  const isExpired = () => {
    if (!quote.expiration_date) return false;
    const expirationDate = new Date(quote.expiration_date);
    const today = new Date();
    return expirationDate < today;
  };

  const subtotal = calculateSubtotal();
  const total = quote.total || subtotal;
  const expired = isExpired();

  return (
    <View style={styles.container}>
      <View style={styles.summaryBox}>
        {/* Subtotal */}
        <View style={[styles.summaryRow, styles.subtotalRow]}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>{formatMoney(subtotal)}</Text>
        </View>

        {/* Total */}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Quote Total:</Text>
          <Text style={styles.totalValue}>{formatMoney(total)}</Text>
        </View>

        {/* Expiration Status */}
        <View style={[styles.summaryRow, expired ? styles.expiredRow : styles.expirationRow]}>
          <Text style={expired ? styles.expiredLabel : styles.expirationLabel}>
            {expired ? 'Quote Expired:' : 'Valid Until:'}
          </Text>
          <Text style={expired ? styles.expiredValue : styles.expirationValue}>
            {formatDate(quote.expiration_date)}
          </Text>
        </View>

        {/* Quote Status if Converted */}
        {quote.converted && (
          <View style={[styles.summaryRow, { backgroundColor: '#d1fae5' }]}>
            <Text style={[styles.label, { color: '#059669', fontWeight: 'bold' }]}>Status:</Text>
            <Text style={[styles.value, { color: '#059669', fontWeight: 'bold' }]}>
              Converted to Invoice
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
