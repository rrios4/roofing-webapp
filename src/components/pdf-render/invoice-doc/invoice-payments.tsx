import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceDocumentData } from '../modern-invoice-doc';

interface InvoicePaymentsProps {
  invoice: InvoiceDocumentData;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  dateHeader: {
    flex: 2
  },
  methodHeader: {
    flex: 2
  },
  amountHeader: {
    flex: 1,
    textAlign: 'right'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  lastRow: {
    borderBottomWidth: 0
  },
  tableCell: {
    fontSize: 10,
    color: '#1f2937'
  },
  dateCell: {
    flex: 2
  },
  methodCell: {
    flex: 2
  },
  amountCell: {
    flex: 1,
    textAlign: 'right'
  },
  noPayments: {
    padding: 16,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 9,
    fontStyle: 'italic'
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 2,
    borderTopColor: '#f59e0b'
  },
  totalLabel: {
    flex: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    textAlign: 'right',
    paddingRight: 12
  },
  totalAmount: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    textAlign: 'right'
  }
});

export const InvoicePayments: React.FC<InvoicePaymentsProps> = ({ invoice }) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPaymentMethod = (method: string) => {
    // Convert snake_case to Title Case
    return method
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const calculateTotalPayments = () => {
    if (!invoice.invoice_payment || invoice.invoice_payment.length === 0) {
      return 0;
    }
    return invoice.invoice_payment.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const totalPayments = calculateTotalPayments();

  // Don't render if no payments
  if (!invoice.invoice_payment || invoice.invoice_payment.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payments Received</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.dateHeader]}>Date</Text>
          <Text style={[styles.tableHeaderCell, styles.methodHeader]}>Method</Text>
          <Text style={[styles.tableHeaderCell, styles.amountHeader]}>Amount</Text>
        </View>

        {/* Payment Rows */}
        {invoice.invoice_payment.map((payment, index) => {
          const isLastRow = index === invoice.invoice_payment!.length - 1;

          return (
            <View
              key={payment.id}
              style={[styles.tableRow, ...(isLastRow ? [styles.lastRow] : [])]}>
              <Text style={[styles.tableCell, styles.dateCell]}>
                {formatDate(payment.date_received)}
              </Text>
              <Text style={[styles.tableCell, styles.methodCell]}>
                {formatPaymentMethod(payment.payment_method)}
              </Text>
              <Text style={[styles.tableCell, styles.amountCell]}>
                {formatMoney(payment.amount)}
              </Text>
            </View>
          );
        })}

        {/* Total Row */}
        {totalPayments > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payments:</Text>
            <Text style={styles.totalAmount}>{formatMoney(totalPayments)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
