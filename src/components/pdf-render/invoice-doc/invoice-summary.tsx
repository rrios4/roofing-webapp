import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceDocumentData } from '../modern-invoice-doc';

interface InvoiceSummaryProps {
  invoice: InvoiceDocumentData;
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
  taxRow: {
    backgroundColor: 'transparent'
  },
  totalRow: {
    backgroundColor: '#dbeafe',
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#3b82f6'
  },
  amountDueRow: {
    backgroundColor: '#f3e8ff',
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#8b5cf6'
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
  amountDueLabel: {
    fontSize: 10,
    color: '#7c3aed',
    fontWeight: 'bold'
  },
  amountDueValue: {
    fontSize: 10,
    color: '#7c3aed',
    fontWeight: 'bold'
  },
  paidLabel: {
    fontSize: 8,
    color: '#059669'
  },
  paidValue: {
    fontSize: 8,
    color: '#059669',
    fontWeight: 'medium'
  }
});

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoice }) => {
  const formatMoney = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateSubtotal = () => {
    if (!invoice.invoice_line_services || invoice.invoice_line_services.length === 0) {
      return invoice.subtotal || 0;
    }
    // Use the actual amount from each line item instead of calculating qty × rate
    return invoice.invoice_line_services.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);
  };

  const calculateTotalPayments = () => {
    if (!invoice.invoice_payment || invoice.invoice_payment.length === 0) {
      return 0;
    }
    return invoice.invoice_payment.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const subtotal = calculateSubtotal();
  const total = invoice.total || subtotal; // Use subtotal as total when no tax
  // const taxAmount = total - subtotal; // TODO: Add tax functionality later
  const totalPayments = calculateTotalPayments();
  const amountDue = invoice.amount_due || total - totalPayments;

  return (
    <View style={styles.container}>
      <View style={styles.summaryBox}>
        {/* Subtotal */}
        <View style={[styles.summaryRow, styles.subtotalRow]}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>{formatMoney(subtotal)}</Text>
        </View>

        {/* Tax (commented out - will be added later) */}
        {/* {taxAmount > 0 && (
          <View style={[styles.summaryRow, styles.taxRow]}>
            <Text style={styles.label}>Tax:</Text>
            <Text style={styles.value}>{formatMoney(taxAmount)}</Text>
          </View>
        )} */}

        {/* Total */}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatMoney(total)}</Text>
        </View>

        {/* Payments (only show if there are payments) */}
        {totalPayments > 0 && (
          <View style={[styles.summaryRow]}>
            <Text style={styles.paidLabel}>Payments:</Text>
            <Text style={styles.paidValue}>-{formatMoney(totalPayments)}</Text>
          </View>
        )}

        {/* Amount Due */}
        <View style={[styles.summaryRow, styles.amountDueRow]}>
          <Text style={styles.amountDueLabel}>
            {amountDue <= 0 ? 'Paid in Full' : 'Amount Due:'}
          </Text>
          <Text style={styles.amountDueValue}>
            {amountDue <= 0 ? '$0.00' : formatMoney(amountDue)}
          </Text>
        </View>
      </View>
    </View>
  );
};
